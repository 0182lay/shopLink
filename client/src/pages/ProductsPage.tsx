import { useEffect, useMemo, useState } from "react";
import { HomeFooter } from "../components/home/HomeFooter";
import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import {
    ProductGridCard,
    type ProductCardProduct,
} from "../components/products/ProductGridCard";
import { api, type Category } from "../lib/api";
import type { Store } from "../types/store";

type SortMode = "recommended" | "price-low" | "price-high";
type CategoryFilter = number | "all";

const mockStores: Store[] = [
    { id: 1, name: "Ruby Pet Shop", slug: "ruby-pet-shop", isActive: true },
    { id: 2, name: "Toy Shop", slug: "toy-shop", isActive: true },
    { id: 3, name: "Fish Shop", slug: "fish-shop", isActive: true },
    { id: 4, name: "Pet House", slug: "pet-house", isActive: true },
    { id: 5, name: "Computer Shop", slug: "computer-shop", isActive: true },
    { id: 6, name: "Health Shop", slug: "health-shop", isActive: true },
];

const mockProducts: ProductCardProduct[] = [
    {
        id: 201,
        storeId: 1,
        categoryId: 4,
        name: "Royal Canin Medium Adult 15kg",
        description: "ອາຫານສຸນັກ ສູດສຳລັບສຸນັກໃຫຍ່",
        price: 1250000,
        oldPrice: 1590000,
        stock: 24,
        imageUrl:
            "https://images.unsplash.com/photo-1582397502212-1a6b5721afe4?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: true,
        badge: "-20%",
    },
    {
        id: 202,
        storeId: 1,
        categoryId: 4,
        name: "Me-O Cat Food 1.1kg",
        description: "ອາຫານແມວ ສູດປາທູນ່າ 1.1kg",
        price: 189000,
        oldPrice: 220000,
        stock: 31,
        imageUrl:
            "https://images.unsplash.com/photo-1588528770781-00af5b541e8b?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: true,
        badge: "-14%",
    },
    {
        id: 203,
        storeId: 2,
        categoryId: 2,
        name: "ເຊືອກກັດສຸນັກ",
        description: "ຂະໜາດກາງ ຊ່ວຍຝຶກການກັດ",
        price: 120000,
        oldPrice: 150000,
        stock: 40,
        imageUrl:
            "https://images.unsplash.com/photo-1601758064137-0fb6db8081b0?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: true,
        badge: "-20%",
    },
    {
        id: 204,
        storeId: 4,
        categoryId: 5,
        name: "ກະເປົາສັດລ້ຽງ",
        description: "ພົກພາສະດວກ ໃຊ້ໄດ້ທັງໃນບ້ານ ແລະ ນອກບ້ານ",
        price: 550000,
        oldPrice: 690000,
        stock: 18,
        imageUrl:
            "https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: false,
        badge: "-20%",
    },
    {
        id: 205,
        storeId: 3,
        categoryId: 3,
        name: "ຕູ້ປາ ຂະໜາດ 20 ນິ້ວ",
        description: "ພ້ອມອຸປະກອນພື້ນຖານ",
        price: 1290000,
        stock: 9,
        imageUrl:
            "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: false,
    },
    {
        id: 206,
        storeId: 3,
        categoryId: 6,
        name: "ຢາປັບສະພາບນ້ຳປາ",
        description: "ຂວດ 120ml ຊ່ວຍດູແລນ້ຳໃຫ້ໃສ",
        price: 180000,
        stock: 36,
        imageUrl:
            "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: false,
    },
    {
        id: 207,
        storeId: 5,
        categoryId: 1,
        name: "ຈໍຄອມພິວເຕີ 24 ນິ້ວ",
        description: "ຈໍພາບຄົມຊັດ ໃຊ້ງານງ່າຍ",
        price: 1490000,
        stock: 14,
        imageUrl:
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: false,
        badge: "ໃໝ່",
    },
    {
        id: 208,
        storeId: 2,
        categoryId: 2,
        name: "ຕຸກກະຕາ Teddy Bear",
        description: "ນຸ່ມນວນ ເໝາະສຳລັບເດັກນ້ອຍ",
        price: 159000,
        stock: 25,
        imageUrl:
            "https://images.unsplash.com/photo-1560040509-19f98c49f7d5?auto=format&fit=crop&w=700&q=80",
        isActive: true,
        isFeatured: false,
        badge: "ໃໝ່",
    },
];

const categoryTabs = [
    {
        id: "all",
        label: "ທັງໝົດ",
        image: null,
    },
    {
        id: 4,
        label: "ອາຫານສັດ",
        image: "https://images.unsplash.com/photo-1582397502212-1a6b5721afe4?auto=format&fit=crop&w=220&q=80",
    },
    {
        id: 2,
        label: "ຂອງຫຼິ້ນ",
        image: "https://images.unsplash.com/photo-1560040509-19f98c49f7d5?auto=format&fit=crop&w=220&q=80",
    },
    {
        id: 5,
        label: "ອຸປະກອນ",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=220&q=80",
    },
    {
        id: 3,
        label: "ປາ",
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=220&q=80",
    },
    {
        id: 1,
        label: "ຄອມພິວເຕີ",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=220&q=80",
    },
] as const;

function SmallIcon({ type }: { type: "sort" }) {
    const paths = {
        sort: "M7 7h10M9 12h8M11 17h6",
    };

    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d={paths[type]}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function sortProducts(products: ProductCardProduct[], sort: SortMode) {
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

export function ProductsPage() {
    const [products, setProducts] = useState<ProductCardProduct[]>(mockProducts);
    const [stores, setStores] = useState<Store[]>(mockStores);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryFilter>(
        () => getInitialCategory(),
    );
    const [sort, setSort] = useState<SortMode>("recommended");
    const [isSortOpen, setIsSortOpen] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadProductsPage() {
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

                setProducts(apiProducts.length > 0 ? apiProducts : mockProducts);
                setStores(apiStores.length > 0 ? apiStores : mockStores);
                setCategories(apiCategories);
            } catch {
                if (isMounted) {
                    setProducts(mockProducts);
                    setStores(mockStores);
                    setCategories([]);
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
    const activeCategoryTabs = useMemo(() => {
        if (categories.length === 0) {
            return categoryTabs;
        }

        return [
            {
                id: "all" as const,
                label: "ທັງໝົດ",
                image: null,
            },
            ...categories.map((category) => ({
                id: category.id,
                label: category.name,
                image: category.iconUrl ?? null,
            })),
        ];
    }, [categories]);

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
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl font-black text-shop-text md:text-3xl">
                            ໝວດໝູ່ສິນຄ້າ
                        </h1>
                    </div>

                    <div className="grid grid-cols-6 gap-1.5 md:gap-5">
                        {activeCategoryTabs.map((category) => {
                            const isActive = selectedCategoryId === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => setSelectedCategoryId(category.id)}
                                    className="group flex min-w-0 flex-col items-center gap-1.5 text-center transition duration-300 hover:-translate-y-1 md:gap-2"
                                >
                                    <span
                                        className={`grid h-12 w-12 place-items-center overflow-hidden rounded-full border bg-red-50 shadow-[0_5px_14px_rgba(51,51,51,0.06)] transition duration-300 group-hover:scale-105 group-hover:border-shop-primary group-hover:shadow-[0_12px_24px_rgba(229,57,53,0.14)] sm:h-16 sm:w-16 md:h-24 md:w-24 ${
                                            isActive
                                                ? "border-shop-primary ring-2 ring-red-100"
                                                : "border-red-100"
                                        }`}
                                    >
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt=""
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-6 w-6 text-shop-primary md:h-9 md:w-9"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    <span
                                        className={`line-clamp-1 max-w-full text-[9px] font-black leading-4 sm:text-xs md:text-sm ${
                                            isActive
                                                ? "text-shop-primary"
                                                : "text-shop-text group-hover:text-shop-primary"
                                        }`}
                                    >
                                        {category.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-1">
                        <h2 className="text-xl font-black text-shop-text md:text-3xl">
                            ສິນຄ້າ
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsSortOpen((current) => !current)}
                                className="inline-flex h-10 w-44 items-center justify-between gap-3 rounded-2xl border border-red-100 bg-white px-3 text-xs font-black text-shop-text shadow-[0_6px_18px_rgba(51,51,51,0.06)] transition hover:border-shop-primary hover:text-shop-primary"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <SmallIcon type="sort" />
                                    {sort === "recommended"
                                        ? "ຈັດຮຽງ: ແນະນຳ"
                                        : sort === "price-low"
                                          ? "ລາຄາຕ່ຳກ່ອນ"
                                          : "ລາຄາສູງກ່ອນ"}
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
                                <div className="absolute left-0 top-12 z-20 w-44 overflow-hidden rounded-2xl border border-red-100 bg-white p-1.5 shadow-[0_18px_36px_rgba(51,51,51,0.14)]">
                                    {[
                                        ["recommended", "ຈັດຮຽງ: ແນະນຳ"],
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

                    <p className="text-xs font-bold text-gray-500 md:text-sm">
                        ພົບສິນຄ້າ {visibleProducts.length} ລາຍການ
                    </p>

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
                        <>
                            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                                {visibleProducts.map((product) => (
                                    <ProductGridCard
                                        key={product.id}
                                        product={product}
                                        store={storeById.get(product.storeId)}
                                    />
                                ))}
                            </div>

                            <div className="hidden items-center justify-center gap-2 pt-3 md:flex">
                                <button className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 bg-white text-gray-400">
                                    ‹
                                </button>
                                <button className="grid h-9 w-9 place-items-center rounded-xl bg-shop-primary text-sm font-black text-white">
                                    1
                                </button>
                                <button className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-gray-500">
                                    2
                                </button>
                                <button className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-gray-500">
                                    3
                                </button>
                                <span className="px-2 text-sm font-bold text-gray-400">...</span>
                                <button className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-gray-500">
                                    12
                                </button>
                                <button className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 bg-white text-shop-text">
                                    ›
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <HomeFooter />
            <MobileBottomNav activePage="products" />
        </main>
    );
}
