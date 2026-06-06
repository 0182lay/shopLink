import { useMemo, useState } from "react";
import { HomeFooter } from "../components/home/HomeFooter";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { HeaderNav } from "../components/home/header/HeaderNav";
import { CircleIcon } from "../components/home/header/icons";

type SortMode = "relevant" | "price-low" | "price-high";

const searchProducts = [
    {
        id: 1,
        name: "Royal Canin FIT 32",
        description: "ອາຫານແມວໂຕ 2kg",
        price: 640000,
        oldPrice: 800000,
        discount: "-20%",
        store: "Ruby Pet Shop",
        image: "https://images.unsplash.com/photo-1582397502212-1a6b5721afe4?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 2,
        name: "Me-O Cat Food",
        description: "ລົດປາທູນ່າ 1.1kg",
        price: 189000,
        oldPrice: 220000,
        discount: "-15%",
        store: "Fish Shop",
        image: "https://images.unsplash.com/photo-1588528770781-00af5b541e8b?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 3,
        name: "SmartHeart Gold",
        description: "ອາຫານແມວ ລົດປາ 1.3kg",
        price: 259000,
        oldPrice: 315000,
        discount: "-18%",
        store: "Fish Shop",
        image: "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 4,
        name: "Sheba",
        description: "ອາຫານແມວປຽກ 70g x 12",
        price: 199000,
        oldPrice: 240000,
        discount: "-18%",
        store: "Ruby Pet Shop",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 5,
        name: "Whiskas",
        description: "ອາຫານແມວ ລົດປາທູນ່າ 1.2kg",
        price: 215000,
        oldPrice: 245000,
        discount: "-12%",
        store: "Toy Shop",
        image: "https://images.unsplash.com/photo-1560040509-19f98c49f7d5?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 6,
        name: "CIAO Churu",
        description: "ຂົນມແມວເລຍ 14g x 20",
        price: 145000,
        oldPrice: 180000,
        discount: "-20%",
        store: "Ruby Pet Shop",
        image: "https://images.unsplash.com/photo-1583521214690-73421a1829a9?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 7,
        name: "Royal Canin Kitten",
        description: "ອາຫານລູກແມວ 2kg",
        price: 690000,
        oldPrice: 770000,
        discount: "-10%",
        store: "Ruby Pet Shop",
        image: "https://images.unsplash.com/photo-1588528770781-00af5b541e8b?auto=format&fit=crop&w=700&q=80",
    },
    {
        id: 8,
        name: "Fancy Feast",
        description: "ອາຫານແມວປຽກ 85g",
        price: 35000,
        oldPrice: 42000,
        discount: "-17%",
        store: "Fish Shop",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=700&q=80",
    },
];

function getSearchQuery() {
    const queryIndex = window.location.hash.indexOf("?");

    if (queryIndex === -1) {
        return "";
    }

    return new URLSearchParams(window.location.hash.slice(queryIndex + 1)).get("q") ?? "";
}

function saveRecentSearch(query: string) {
    const nextQuery = query.trim();

    if (!nextQuery) {
        return;
    }

    try {
        const current = JSON.parse(localStorage.getItem("ruby_recent_searches") ?? "[]") as string[];
        const next = [nextQuery, ...current.filter((item) => item !== nextQuery)].slice(0, 8);
        localStorage.setItem("ruby_recent_searches", JSON.stringify(next));
    } catch {
        localStorage.setItem("ruby_recent_searches", JSON.stringify([nextQuery]));
    }
}

function formatPrice(price: number) {
    return new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(price);
}

function BackIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
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

function HeaderChatButton() {
    return (
        <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-shop-text transition hover:bg-shop-light"
            aria-label="ແຊດ"
        >
            <CircleIcon type="chat" />
        </button>
    );
}

function HeaderCartButton() {
    return (
        <button
            type="button"
            className="relative grid h-10 w-10 place-items-center rounded-full text-shop-text transition hover:bg-shop-light"
            aria-label="ກະຕ່າສິນຄ້າ"
        >
            <CircleIcon type="cart" />
            <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-shop-primary px-1 text-[10px] font-bold leading-none text-white">
                3
            </span>
        </button>
    );
}

function SearchResultHeader({
    query,
    onQueryChange,
    onSearch,
}: {
    query: string;
    onQueryChange: (value: string) => void;
    onSearch: () => void;
}) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSearch();
    }

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-red-100 bg-white/95 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid h-16 grid-cols-[40px_minmax(0,1fr)_88px] items-center gap-2 md:grid-cols-[44px_minmax(0,1fr)_88px] md:gap-3">
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        className="grid h-10 w-10 place-items-center rounded-full text-shop-text transition hover:bg-red-50"
                        aria-label="ກັບຄືນ"
                    >
                        <BackIcon />
                    </button>

                    <form onSubmit={handleSubmit} className="flex min-w-0 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm md:mx-auto md:w-full md:max-w-4xl">
                        <div className="grid h-11 w-12 shrink-0 place-items-center text-gray-500">
                            <SearchIcon />
                        </div>
                        <input
                            value={query}
                            onChange={(event) => onQueryChange(event.target.value)}
                            className="h-11 min-w-0 flex-1 px-1 text-sm font-bold outline-none placeholder:text-gray-400 md:text-base"
                            placeholder="ຄົ້ນຫາສິນຄ້າ..."
                            type="search"
                        />
                        {query ? (
                            <button
                                type="button"
                                onClick={() => onQueryChange("")}
                                className="grid h-11 w-10 shrink-0 place-items-center text-gray-400"
                                aria-label="ລຶບຄຳຄົ້ນຫາ"
                            >
                                ×
                            </button>
                        ) : null}
                        <button
                            type="submit"
                            className="hidden h-11 w-14 shrink-0 place-items-center bg-shop-primary text-white transition hover:bg-shop-secondary md:grid"
                            aria-label="ຄົ້ນຫາ"
                        >
                            <SearchIcon />
                        </button>
                    </form>

                    <div className="flex justify-end gap-2">
                        <HeaderChatButton />
                        <HeaderCartButton />
                    </div>
                </div>

                <div className="hidden md:block">
                    <HeaderNav activePage="products" />
                </div>
            </div>
        </header>
    );
}

function SearchProductCard({ product }: { product: (typeof searchProducts)[number] }) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-red-50 bg-white shadow-[0_8px_22px_rgba(51,51,51,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(229,57,53,0.12)]">
            <span className="absolute left-3 top-3 z-10 rounded-full bg-shop-primary px-2 py-1 text-[10px] font-black text-white">
                {product.discount}
            </span>
            <button
                type="button"
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-gray-500 shadow-sm transition hover:text-shop-primary"
                aria-label="ເພີ່ມໃສ່ລາຍການທີ່ມັກ"
            >
                <svg viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                        d="M20.8 8.8c0 5.3-8.8 10-8.8 10s-8.8-4.7-8.8-10A4.7 4.7 0 0 1 12 5.7a4.7 4.7 0 0 1 8.8 3.1Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                    />
                </svg>
            </button>

            <div className="aspect-[4/3] overflow-hidden bg-[#fff4f1]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
            </div>
            <div className="p-3 md:p-4">
                <h3 className="line-clamp-1 text-sm font-black text-shop-text md:text-base">
                    {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-gray-500">
                    {product.description}
                </p>
                <div className="mt-3 flex items-end justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-sm font-black text-shop-primary md:text-lg">
                            {formatPrice(product.price)}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 line-through md:text-xs">
                            {formatPrice(product.oldPrice)}
                        </p>
                        <p className="mt-2 line-clamp-1 text-[11px] font-black text-shop-text">
                            {product.store}
                        </p>
                    </div>
                    <button
                        type="button"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-red-100 bg-white text-shop-primary shadow-sm transition hover:border-shop-primary hover:bg-shop-primary hover:text-white"
                        aria-label="ເພີ່ມໃສ່ກະຕ່າ"
                    >
                        <CircleIcon type="cart" />
                    </button>
                </div>
            </div>
        </article>
    );
}

function sortProducts(sort: SortMode) {
    const products = [...searchProducts];

    if (sort === "price-low") {
        return products.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
        return products.sort((a, b) => b.price - a.price);
    }

    return products;
}

export function SearchPage() {
    const [query, setQuery] = useState(() => getSearchQuery());
    const [sort, setSort] = useState<SortMode>("relevant");
    const visibleProducts = useMemo(() => sortProducts(sort), [sort]);
    const displayQuery = query.trim() || "ອາຫານແມວ";

    function submitSearch() {
        const nextQuery = query.trim();

        if (!nextQuery) {
            return;
        }

        saveRecentSearch(nextQuery);
        window.location.hash = `#/search?q=${encodeURIComponent(nextQuery)}`;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 pt-[70px] text-shop-text md:pb-10 md:pt-32">
            <SearchResultHeader
                query={query}
                onQueryChange={setQuery}
                onSearch={submitSearch}
            />

            <section className="mx-auto max-w-7xl px-3 py-3 sm:px-6 md:py-5 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-shop-text md:text-4xl">
                            ຜົນການຄົ້ນຫາ “{displayQuery}”
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-gray-500 md:text-base">
                            ພົບສິນຄ້າ {visibleProducts.length} ລາຍການ
                        </p>
                    </div>

                    <label className="relative shrink-0">
                        <span className="sr-only">ຈັດຮຽງ</span>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value as SortMode)}
                            className="h-11 appearance-none rounded-2xl border border-red-100 bg-white py-0 pl-4 pr-9 text-xs font-black text-shop-text shadow-sm outline-none transition hover:border-shop-primary md:text-sm"
                        >
                            <option value="relevant">ກ່ຽວຂ້ອງ</option>
                            <option value="price-low">ລາຄາຕ່ຳກ່ອນ</option>
                            <option value="price-high">ລາຄາສູງກ່ອນ</option>
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg viewBox="0 0 24 24" className="h-4 w-4">
                                <path
                                    d="m7 10 5 5 5-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                        </span>
                    </label>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {visibleProducts.map((product) => (
                        <SearchProductCard key={product.id} product={product} />
                    ))}
                </div>

                <button
                    type="button"
                    className="mx-auto mt-6 flex h-11 min-w-48 items-center justify-center rounded-2xl border border-red-100 bg-white px-6 text-sm font-black text-shop-text shadow-sm transition hover:border-shop-primary hover:text-shop-primary"
                >
                    ເບິ່ງເພີ່ມ
                </button>
            </section>

            <HomeFooter />
            <MobileBottomNav activePage="products" />
        </main>
    );
}
