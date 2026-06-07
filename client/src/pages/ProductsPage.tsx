import { useEffect, useMemo, useState } from "react";
import { HomeFooter } from "../components/home/HomeFooter";
import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { ProductGridCard } from "../components/products/ProductGridCard";
import { api, type Category, type Product } from "../lib/api";
import type { Store } from "../types/store";

type SortMode = "recommended" | "price-low" | "price-high";
type CategoryFilter = number | "all";

function SortIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M7 7h10M9 12h8M11 17h6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function GridCategoryIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6 text-shop-primary md:h-9 md:w-9">
            <path
                d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function sortProducts(products: Product[], sort: SortMode) {
    const sorted = [...products];

    if (sort === "price-low") {
        return sorted.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sort === "price-high") {
        return sorted.sort((a, b) => Number(b.price) - Number(a.price));
    }

    return sorted.sort(
        (a, b) => Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false),
    );
}

function getInitialCategory(): CategoryFilter {
    const queryIndex = window.location.hash.indexOf("?");

    if (queryIndex === -1) {
        return "all";
    }

    const params = new URLSearchParams(window.location.hash.slice(queryIndex + 1));
    const category = params.get("category");

    if (!category || category === "all") {
        return "all";
    }

    const parsed = Number(category);
    return Number.isNaN(parsed) ? "all" : parsed;
}

function getSortLabel(sort: SortMode) {
    if (sort === "price-low") return "ລາຄາຕ່ຳກ່ອນ";
    if (sort === "price-high") return "ລາຄາສູງກ່ອນ";
    return "ແນະນຳ";
}

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryFilter>(
        () => getInitialCategory(),
    );
    const [sort, setSort] = useState<SortMode>("recommended");
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadProductsPage() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const [productsResult, storesResult, categoriesResult] =
                    await Promise.allSettled([
                        api.products(),
                        api.stores(),
                        api.categories(),
                    ]);

                if (!isMounted) {
                    return;
                }

                const apiProducts =
                    productsResult.status === "fulfilled"
                        ? (productsResult.value.data ?? []).filter(
                              (product) => product.isActive,
                          )
                        : [];
                const apiStores =
                    storesResult.status === "fulfilled"
                        ? (storesResult.value.data ?? []).filter((store) => store.isActive)
                        : [];
                const apiCategories =
                    categoriesResult.status === "fulfilled"
                        ? (categoriesResult.value.data ?? []).filter(
                              (category) => category.isActive,
                          )
                        : [];

                setProducts(apiProducts);
                setStores(apiStores);
                setCategories(apiCategories);

                if (
                    productsResult.status === "rejected" ||
                    storesResult.status === "rejected" ||
                    categoriesResult.status === "rejected"
                ) {
                    setErrorMessage("ບາງຂໍ້ມູນໂຫຼດບໍ່ສຳເລັດ ກວດ backend ຫຼື refresh ໃໝ່.");
                }
            } catch {
                if (isMounted) {
                    setProducts([]);
                    setStores([]);
                    setCategories([]);
                    setErrorMessage("ໂຫຼດຂໍ້ມູນສິນຄ້າບໍ່ໄດ້.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProductsPage();

        return () => {
            isMounted = false;
        };
    }, []);

    const storeById = useMemo(
        () => new Map(stores.map((store) => [store.id, store])),
        [stores],
    );
    const categoryTabs = useMemo(
        () => [
            { id: "all" as const, label: "ທັງໝົດ", image: null },
            ...categories.map((category) => ({
                id: category.id,
                label: category.name,
                image: category.iconUrl ?? null,
            })),
        ],
        [categories],
    );
    const visibleProducts = useMemo(() => {
        const filtered =
            selectedCategoryId === "all"
                ? products
                : products.filter((product) => product.categoryId === selectedCategoryId);

        return sortProducts(filtered, sort);
    }, [products, selectedCategoryId, sort]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 pt-[70px] text-shop-text md:pb-10 md:pt-28">
            <HomeHeader activePage="products" />

            <section className="mx-auto max-w-7xl px-3 py-2 sm:px-6 md:py-4 lg:px-8">
                <div className="space-y-4 md:mt-4 md:space-y-5">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h1 className="text-xl font-black text-shop-text md:text-3xl">
                                ສິນຄ້າທັງໝົດ
                            </h1>
                            <p className="mt-1 text-xs font-bold text-gray-500 md:text-sm">
                                ພົບສິນຄ້າ {visibleProducts.length} ລາຍການ
                            </p>
                        </div>
                    </div>

                    {errorMessage ? (
                        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-shop-primary">
                            {errorMessage}
                        </div>
                    ) : null}

                    <div className="grid grid-cols-4 gap-2 md:grid-cols-6 md:gap-5">
                        {categoryTabs.map((category) => {
                            const isActive = selectedCategoryId === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className={`group flex min-w-0 flex-col items-center gap-2 rounded-2xl border bg-white px-2 py-3 text-center shadow-[0_6px_18px_rgba(51,51,51,0.04)] transition duration-300 hover:-translate-y-1 md:px-4 md:py-4 ${
                                        isActive
                                            ? "border-shop-primary text-shop-primary"
                                            : "border-red-50 text-shop-text hover:border-red-100 hover:text-shop-primary"
                                    }`}
                                >
                                    <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-red-50 md:h-16 md:w-16">
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt=""
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <GridCategoryIcon />
                                        )}
                                    </span>
                                    <span className="line-clamp-1 max-w-full text-[10px] font-black leading-4 sm:text-xs md:text-sm">
                                        {category.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-xl font-black text-shop-text md:text-3xl">
                            ສິນຄ້າ
                        </h2>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSortOpen((current) => !current)}
                                className="inline-flex h-10 w-40 items-center justify-between gap-3 rounded-2xl border border-red-100 bg-white px-3 text-xs font-black text-shop-text shadow-[0_6px_18px_rgba(51,51,51,0.06)] transition hover:border-shop-primary hover:text-shop-primary"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <SortIcon />
                                    {getSortLabel(sort)}
                                </span>
                                <svg
                                    viewBox="0 0 24 24"
                                    className={`h-4 w-4 text-gray-400 transition ${isSortOpen ? "rotate-180" : ""}`}
                                    aria-hidden="true"
                                >
                                    <path
                                        d="m7 10 5 5 5-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                    />
                                </svg>
                            </button>

                            {isSortOpen ? (
                                <div className="absolute right-0 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-red-100 bg-white p-1.5 shadow-[0_18px_36px_rgba(51,51,51,0.14)]">
                                    {[
                                        ["recommended", "ແນະນຳ"],
                                        ["price-low", "ລາຄາຕ່ຳກ່ອນ"],
                                        ["price-high", "ລາຄາສູງກ່ອນ"],
                                    ].map(([value, label]) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => {
                                                setSort(value as SortMode);
                                                setIsSortOpen(false);
                                            }}
                                            className={`block w-full rounded-xl px-3 py-2.5 text-left text-xs font-black transition ${
                                                sort === value
                                                    ? "bg-red-50 text-shop-primary"
                                                    : "text-shop-text hover:bg-red-50 hover:text-shop-primary"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <div
                                    key={item}
                                    className="h-64 animate-pulse rounded-2xl bg-white shadow-[0_8px_20px_rgba(51,51,51,0.035)] md:h-72"
                                />
                            ))}
                        </div>
                    ) : visibleProducts.length === 0 ? (
                        <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm font-bold text-gray-500">
                            ຍັງບໍ່ມີສິນຄ້າໃນໝວດນີ້
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                            {visibleProducts.map((product) => (
                                <ProductGridCard
                                    key={product.id}
                                    product={product}
                                    store={storeById.get(product.storeId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <HomeFooter />
            <MobileBottomNav activePage="products" />
        </main>
    );
}
