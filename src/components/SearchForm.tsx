import React, { useState } from "react";
import { useNavigate } from "react-router";

export function SearchForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <header>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          className="border-grey-600 border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="rounded-md bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="submit"
        >
          Search
        </button>
      </form>
    </header>
  );
}

export default SearchForm;
