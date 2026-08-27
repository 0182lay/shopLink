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

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
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
            <header className="fixed inset-x-0 top-0 z-50 border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
                <div className="mx-auto max-w-2xl px-4">
                    <form
                        onSubmit={handleSubmit}
                        className="flex h-16 items-center gap-2 md:gap-3"
                    >
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-shop-text transition hover:bg-red-50"
                            aria-label="ກັບຄືນ"
                        >
                            <BackIcon />
                        </button>

                        <div className="flex h-11 min-w-0 flex-1 overflow-hidden rounded-full border border-red-100 bg-[#f7f7f9] focus-within:bg-white focus-within:border-shop-primary focus-within:ring-4 focus-within:ring-red-50 transition-all shadow-xs pl-1 pr-1 items-center">
                            <div className="grid h-9 w-10 shrink-0 place-items-center text-gray-400">
                                <SearchIcon className="h-4.5 w-4.5" />
                            </div>
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                className="min-w-0 flex-1 bg-transparent px-1 text-sm font-bold outline-none placeholder:text-gray-400 py-1.5"
                                placeholder="ຄົ້ນຫາສິນຄ້າ..."
                                type="search"
                                autoFocus
                            />
                            {/* Always render clear button to prevent layout shift, hide via visibility */}
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="grid h-9 w-9 shrink-0 place-items-center text-gray-400 hover:text-shop-primary cursor-pointer hover:bg-gray-200/50 rounded-full mr-1 transition-opacity"
                                aria-label="ລຶບຄຳຄົ້ນຫາ"
                                style={{ visibility: query ? "visible" : "hidden" }}
                            >
                                ×
                            </button>
                            <button
                                type="submit"
                                className="grid h-9 w-9 shrink-0 place-items-center bg-shop-primary text-white rounded-full transition hover:bg-red-600 shadow-sm cursor-pointer"
                                aria-label="ຄົ້ນຫາ"
                            >
                                <SearchIcon className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>
            </header>

            <section className="mx-auto max-w-2xl px-4 pb-4 pt-20">
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
