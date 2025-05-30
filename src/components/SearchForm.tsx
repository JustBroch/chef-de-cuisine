import { Form, useSearchParams } from "react-router";

export function SearchForm() {
  const [searchParams] = useSearchParams();
  return (
    <header>
      <Form action="/recipes/search">
        <input
          type="search"
          name="query"
          defaultValue={searchParams.get("query") ?? ""}
          className="border-grey-600 border"
        />
        <button
          className="rounded-md bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="submit"
        >
          Search
        </button>
      </Form>
    </header>
  );
}

export default SearchForm;
