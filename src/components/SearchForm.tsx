import { Form, useSearchParams } from "react-router";
import { Search, X } from "lucide-react";
import { useState } from "react";

export function SearchForm() {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get("query") ?? "");

  const clearSearch = () => {
    setSearchValue("");
  };

  return (
    <div className="relative">
      <Form action="/recipes/search" className="relative">
        <div className="relative min-w-[280px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="search"
            name="query"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
            placeholder="Search for recipes..."
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-12 flex items-center justify-center px-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            className="absolute inset-y-0 right-0 flex items-center justify-center px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-r-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200"
            type="submit"
          >
            <Search className="w-4 h-4 stroke-2" />
          </button>
        </div>
      </Form>
    </div>
  );
}

export default SearchForm;
