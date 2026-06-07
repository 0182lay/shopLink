import { useState } from "react";
import { SearchIcon } from "./icons";

type HeaderSearchProps = {
    id: string;
    compact?: boolean;
};

export function HeaderSearch({ id, compact = false }: HeaderSearchProps) {
    const [query, setQuery] = useState("");

    function openSearchEntry() {
        const nextQuery = query.trim();
        window.location.hash = nextQuery
            ? `#/search-entry?q=${encodeURIComponent(nextQuery)}`
            : "#/search-entry";
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        openSearchEntry();
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex min-w-0 overflow-hidden rounded-md border border-red-100 bg-white shadow-sm ${
                compact ? "w-full" : "w-full max-w-2xl"
            }`}
        >
            <label htmlFor={id} className="sr-only">
                ຄົ້ນຫາສິນຄ້າ
            </label>
            <input
                id={id}
                value={query}
                onFocus={openSearchEntry}
                onChange={(event) => setQuery(event.target.value)}
                className="h-10 min-w-0 flex-1 px-4 text-sm font-bold outline-none placeholder:text-gray-400"
                placeholder="ຄົ້ນຫາສິນຄ້າ, ຮ້ານຄ້າ..."
                type="search"
            />
            <button
                type="submit"
                className="grid h-10 w-12 shrink-0 place-items-center bg-shop-primary text-white transition hover:bg-shop-secondary sm:w-14"
                aria-label="ຄົ້ນຫາ"
            >
                <SearchIcon />
            </button>
        </form>
    );
}
