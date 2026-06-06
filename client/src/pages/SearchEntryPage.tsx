import { useMemo, useState } from "react";

const fallbackSearches = [
    "Royal Canin",
    "ກະບະແມວ",
    "ປອກຄໍ",
    "ຂອງຫຼິ້ນແມວ",
    "ອາຫານສຸນັກ",
    "me-o",
];

function getInitialQuery() {
    const queryIndex = window.location.hash.indexOf("?");

    if (queryIndex === -1) {
        return "";
    }

    return new URLSearchParams(window.location.hash.slice(queryIndex + 1)).get("q") ?? "";
}

function getRecentSearches() {
    try {
        const saved = JSON.parse(localStorage.getItem("ruby_recent_searches") ?? "[]") as string[];
        return saved.length > 0 ? saved : fallbackSearches;
    } catch {
        return fallbackSearches;
    }
}

function saveRecentSearch(query: string) {
    const nextQuery = query.trim();

    if (!nextQuery) {
        return;
    }

    const current = getRecentSearches();
    const next = [nextQuery, ...current.filter((item) => item !== nextQuery)].slice(0, 8);
    localStorage.setItem("ruby_recent_searches", JSON.stringify(next));
}

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function BackIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="m15 18-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M5 7h14M10 11v6M14 11v6M8 7l1-3h6l1 3M7 7l1 14h8l1-14"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

export function SearchEntryPage() {
    const [query, setQuery] = useState(() => getInitialQuery());
    const [recentSearches, setRecentSearches] = useState(() => getRecentSearches());
    const visibleSearches = useMemo(() => recentSearches.slice(0, 8), [recentSearches]);

    function submitSearch(nextQuery = query) {
        const cleanQuery = nextQuery.trim();

        if (!cleanQuery) {
            return;
        }

        saveRecentSearch(cleanQuery);
        window.location.hash = `#/search?q=${encodeURIComponent(cleanQuery)}`;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        submitSearch();
    }

    function clearAll() {
        localStorage.removeItem("ruby_recent_searches");
        setRecentSearches([]);
    }

    function removeSearch(item: string) {
        const next = recentSearches.filter((search) => search !== item);
        setRecentSearches(next);
        localStorage.setItem("ruby_recent_searches", JSON.stringify(next));
    }

    return (
        <main className="min-h-screen bg-white text-shop-text">
            <section className="mx-auto max-w-2xl px-4 pb-4 pt-[calc(env(safe-area-inset-top)+28px)] md:py-4">
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-[40px_minmax(0,1fr)_88px] items-center gap-2 md:grid-cols-[44px_minmax(0,1fr)_88px] md:gap-3"
                >
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-shop-text transition hover:bg-red-50"
                        aria-label="ກັບຄືນ"
                    >
                        <BackIcon />
                    </button>

                    <div className="flex h-10 min-w-0 flex-1 overflow-hidden rounded-md border border-red-100 bg-white shadow-sm">
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            className="min-w-0 flex-1 bg-transparent px-4 text-sm font-bold outline-none placeholder:text-gray-400"
                            placeholder="ຄົ້ນຫາສິນຄ້າ..."
                            type="search"
                            autoFocus
                        />
                        {query ? (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="grid h-full w-9 shrink-0 place-items-center text-gray-400"
                                aria-label="ລຶບຄຳຄົ້ນຫາ"
                            >
                                ×
                            </button>
                        ) : null}
                        <button
                            type="submit"
                            className="grid h-full w-12 shrink-0 place-items-center bg-shop-primary text-white transition hover:bg-shop-secondary sm:w-14"
                            aria-label="ຄົ້ນຫາ"
                        >
                            <SearchIcon />
                        </button>
                    </div>
                    <div className="h-10 w-[88px]" aria-hidden="true" />
                </form>

                <div className="mt-6 flex items-center justify-between gap-4">
                    <h1 className="text-base font-black text-shop-text">
                        ຄົ້ນຫາລ່າສຸດ
                    </h1>
                    {visibleSearches.length > 0 ? (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="inline-flex items-center gap-1 text-xs font-black text-shop-primary"
                        >
                            ລ້າງທັງໝົດ
                            <TrashIcon />
                        </button>
                    ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {visibleSearches.map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => submitSearch(item)}
                            className="inline-flex h-9 items-center gap-2 rounded-full bg-gray-100 px-4 text-sm font-black text-shop-text transition hover:bg-red-50 hover:text-shop-primary"
                        >
                            <span>{item}</span>
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    removeSearch(item);
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        event.stopPropagation();
                                        removeSearch(item);
                                    }
                                }}
                                className="text-base leading-none text-gray-500"
                                aria-label={`ລຶບ ${item}`}
                            >
                                ×
                            </span>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
}
