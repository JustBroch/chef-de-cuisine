export type RecipeData = {
  id: number;
  name: string;
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  ingredients: string;
  description: string;
  rating: number;
  url: string;
  cuisine_pat: string;
  nutrition: object;
  timing: object;
  img_src: string;
};

//export type RecipesResult = {
//  recipes: RecipeData[];
//};
function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function assertIsRecipeResult(
  searchData: unknown
): asserts searchData is RecipeData {
  if (!isObject(searchData)) {
    throw new Error("result not an object");
  }
  if (!("id" in searchData)) {
    throw new Error("result has no id");
  }
  if (typeof searchData.id != "number") {
    throw new Error("id is not a number");
  }
  if (!("name" in searchData)) {
    throw new Error("result has no name");
  }
  if (typeof searchData.name != "string") {
    throw new Error("name is not a string");
  }
  if (!("total_time" in searchData)) {
    throw new Error("result has no name");
  }
  if (typeof searchData.total_time != "string") {
    throw new Error("total_time is not a string");
  }
  if (!("ingredients" in searchData)) {
    throw new Error("result has no ingredients");
  }
  if (typeof searchData.ingredients != "string") {
    throw new Error("ingredients is not a string");
  }
  if (!("description" in searchData)) {
    throw new Error("result has no description");
  }
  if (typeof searchData.description != "string") {
    throw new Error("description is not a string");
  }
  if (!("rating" in searchData)) {
    throw new Error("result has no rating");
  }
  if (typeof searchData.rating != "number") {
    throw new Error("ratings is not a number");
  }
  if (!("img_src" in searchData)) {
    throw new Error("result has no img_src");
  }
  if (typeof searchData.img_src != "string") {
    throw new Error("img_src is not a string");
  }
}

export function assertIsRecipesResult(
  searchData: unknown
): asserts searchData is RecipeData[] {
  if (!Array.isArray(searchData)) {
    throw new Error("result not an array");
  }
  if (searchData.length === 0) {
    return;
  }
  searchData.forEach((result) => {
    assertIsRecipeResult(result);
  });
}
