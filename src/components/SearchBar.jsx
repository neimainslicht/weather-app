import { useState } from "react";
export function SearchBar({ onSearch }){
    const [query, setQuery] = useState("");
    function handleSubmit(e){
        e.preventDefault();
        const trimmedQuery = query.trim();
        if(!trimmedQuery) return;
        onSearch(trimmedQuery);
        setQuery("");
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <label>City</label>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">
                Search
            </button>
        </form>
        </>
    )
}