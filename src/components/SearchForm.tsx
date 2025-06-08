import { Form, useSearchParams } from "react-router";
import { Search } from "lucide-react";

export function SearchForm() {
  const [searchParams] = useSearchParams();
  return (
    <div className="relative">
      <Form action="/recipes/search" className="flex items-center gap-2">
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="search"
            name="query"
            defaultValue={searchParams.get("query") ?? ""}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Search for recipes..."
          />
        </div>
        <button
          className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2.5 rounded-lg font-medium hover:from-orange-600 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          type="submit"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </Form>
    </div>
  );
}

export default SearchForm;
