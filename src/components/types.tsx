export type RecipeData = {
  id: number;
  name: string;
  time: number;
  description: string;
  ingredients: string[];
  taste: string[];
  tools: string[];
  cuisine: string;
  difficulty: string;
  image_url: string;
};

export type RecipesResult = {
  recipes: RecipeData[];
};

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
  if (!("time" in searchData)) {
    throw new Error("result has no time");
  }
  if (typeof searchData.time != "number") {
    throw new Error("time is not a number");
  }
  if (!("difficulty" in searchData)) {
    throw new Error("result has no difficulty");
  }
  if (typeof searchData.difficulty != "string") {
    throw new Error("difficulty is not a string");
  }
  if (!("description" in searchData)) {
    throw new Error("result has no description");
  }
  if (typeof searchData.description != "string") {
    throw new Error("description is not a string");
  }
  //if (!("img_url" in searchData)) {
  //  throw new Error("result has no img_url");
  //}
  //if (typeof searchData.img_url != "string") {
  //  throw new Error("img_url is not a string");
  //}
  if (!("ingredients" in searchData)) {
    throw new Error("result has no ingredients");
  }
  if (!Array.isArray(searchData.ingredients)) {
    throw new Error("result not an array");
  }
  searchData.ingredients.forEach((ingredient) => {
    if (typeof ingredient != "string") {
      throw new Error("ingredient is not a string");
    }
  });
  if (!("taste" in searchData)) {
    throw new Error("result has no tastes");
  }
  if (!Array.isArray(searchData.taste)) {
    throw new Error("taste not an array");
  }
  searchData.taste.forEach((taste) => {
    if (typeof taste != "string") {
      throw new Error("ingredient is not a string");
    }
  });
  if (!("tools" in searchData)) {
    throw new Error("result has no tools");
  }
  if (!Array.isArray(searchData.tools)) {
    throw new Error("taste not an array");
  }
  searchData.tools.forEach((tool) => {
    if (typeof tool != "string") {
      throw new Error("ingredient is not a string");
    }
  });
}

export function assertIsRecipesResult(
  searchData: unknown
): asserts searchData is RecipesResult {
  if (!isObject(searchData)) {
    throw new Error("result not an object");
  }
  if (!("recipes" in searchData)) {
    throw new Error("result has no recipes");
  }
  if (!Array.isArray(searchData.recipes)) {
    throw new Error("recipes not an array");
  }
  if (searchData.recipes.length === 0) {
    return;
  }
  searchData.recipes.forEach((result) => {
    assertIsRecipeResult(result);
  });
}
