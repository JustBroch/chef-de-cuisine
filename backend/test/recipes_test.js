import http from "k6/http";
import { check, sleep } from "k6";
import { Counter } from "k6/metrics";

// backend address

const ENDPOINT = __ENV.ENDPOINT || "http://chefdeCuisine-alb-1272383064.us-east-1.elb.amazonaws.com";
const errors = new Counter("errors");
const attempts = new Counter("requests_attempted");
const success = new Counter("success");
const registerFail = new Counter("register_fail");
const loginFail = new Counter("login_fail");

export const options = {
    scenarios: {
        registration_login_flow: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '1m', target: 5 },
                { duration: '1m', target: 15 },
                { duration: '1m', target: 0 },
            ],
            exec: 'userFlow',
        },
        api_stress: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '2m', target: 25 },
                { duration: '2m', target: 50 },
                { duration: '1m', target: 0 },
            ],
            exec: 'apiFlow',
            startTime: '4m',
        },
    },
};

function randomStr(len) {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let out = "";
    for (let i = 0; i < len; ++i) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
}

// 1. reg + log  GET JWT
function registerAndLogin() {
    const username = "test_" + randomStr(8);
    const password = "P@ssw0rd" + randomStr(3);
    const email = username + "@test.com";

    // reg
    let res = http.post(`${ENDPOINT}/api/v1/auth/register`, JSON.stringify({
        username: username,
        email: email,
        password: password,
    }), {
        headers: { "Content-Type": "application/json" }
    });

    attempts.add(1, { endpoint: "register" });
    if (!(res.status === 201 || (res.status === 409 && res.json().message === "User already exists"))) {
        registerFail.add(1);
        errors.add(1, { endpoint: "register" });
        return null;
    }

    // log
    res = http.post(`${ENDPOINT}/api/v1/auth/login`, JSON.stringify({
        username: username,
        password: password,
    }), {
        headers: { "Content-Type": "application/json" }
    });

    attempts.add(1, { endpoint: "login" });
    if (res.status !== 200 || !res.json().access_token) {
        loginFail.add(1);
        errors.add(1, { endpoint: "login" });
        return null;
    }
    success.add(1, { endpoint: "login" });
    return res.json().access_token;
}

// 2. GET/POST recipt
function recipesCrud(token) {
    // get recipt
    let res = http.get(`${ENDPOINT}/api/v1/recipes`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    attempts.add(1, { endpoint: "get_recipes" });
    check(res, { "status 200 (GET recipes)": (r) => r.status === 200 });
    success.add(1, { endpoint: "get_recipes" });

    // post recipt
    const newRecipe = {
        name: "test_" + randomStr(5),
        description: "desc_" + randomStr(10),
        time: Math.floor(Math.random() * 60) + 10,
        cuisine: "TestCuisine",
        difficulty: "easy",
        tools: ["pan", "pot"],
        ingredients: ["egg", "rice"],
        taste: ["umami", "fresh"]
    };
    res = http.post(`${ENDPOINT}/api/v1/recipes`, JSON.stringify(newRecipe), {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    attempts.add(1, { endpoint: "add_recipe" });
    check(res, { "status 201 (POST recipes)": (r) => r.status === 201 });
    success.add(1, { endpoint: "add_recipe" });
    let recipeId = null;
    try {
        recipeId = res.json().recipe.id;
    } catch { }

    // search recipt
    res = http.get(`${ENDPOINT}/api/v1/recipes/search?query=test_`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    attempts.add(1, { endpoint: "search_recipes" });
    check(res, { "status 200 (search)": (r) => r.status === 200 });
    success.add(1, { endpoint: "search_recipes" });

    // recipt filter 
    res = http.get(`${ENDPOINT}/api/v1/recipes/filter?cuisine=TestCuisine`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    attempts.add(1, { endpoint: "filter_recipes" });
    check(res, { "status 200 (filter)": (r) => r.status === 200 });
    success.add(1, { endpoint: "filter_recipes" });

    return recipeId;
}

// 3. fav
function favoritesCrud(token, recipeId) {
    if (!recipeId) return;

    // add fav
    let res = http.post(`${ENDPOINT}/api/v1/favorites`, JSON.stringify({ recipe_id: recipeId }), {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
    attempts.add(1, { endpoint: "add_favorite" });
    check(res, { "status 201/200 (POST favorite)": (r) => r.status === 201 || r.status === 200 });
    success.add(1, { endpoint: "add_favorite" });

    // GET fav
    res = http.get(`${ENDPOINT}/api/v1/favorites`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    attempts.add(1, { endpoint: "get_favorites" });
    check(res, { "status 200 (GET favorites)": (r) => r.status === 200 });
    success.add(1, { endpoint: "get_favorites" });

    // DEL fav
    res = http.del(`${ENDPOINT}/api/v1/favorites/${recipeId}`, null, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    attempts.add(1, { endpoint: "del_favorite" });
    check(res, { "status 200/404 (DEL favorite)": (r) => r.status === 200 || r.status === 404 });
    success.add(1, { endpoint: "del_favorite" });
}

// 
export function userFlow() {
    const token = registerAndLogin();
    if (!token) {
        sleep(1);
        return;
    }
    const recipeId = recipesCrud(token);
    favoritesCrud(token, recipeId);
    sleep(2);
}

 
export function apiFlow() {

    const username = "testuser";
    const password = "testpass123";
    // token
    let res = http.post(`${ENDPOINT}/api/v1/auth/login`, JSON.stringify({
        username: username,
        password: password,
    }), {
        headers: { "Content-Type": "application/json" }
    });

    if (res.status !== 200 || !res.json().access_token) {
        loginFail.add(1, { endpoint: "apiFlow_login" });
        errors.add(1, { endpoint: "apiFlow_login" });
        sleep(2);
        return;
    }
    const token = res.json().access_token;
    const recipeId = recipesCrud(token);
    favoritesCrud(token, recipeId);
    sleep(2);
}