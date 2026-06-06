import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import {
    ProductGridCard,
    type ProductCardProduct,
} from "../products/ProductGridCard";
import type { Store } from "../../types/store";

const mockStores: Store[] = [
    { id: 1, name: "Computer Shop", slug: "computer-shop", isActive: true },
    { id: 2, name: "Toy Shop", slug: "toy-shop", isActive: true },
    { id: 3, name: "Fish Shop", slug: "fish-shop", isActive: true },
    { id: 4, name: "Pet Shop", slug: "pet-shop", isActive: true },
    { id: 5, name: "Gadget Store", slug: "gadget-store", isActive: true },
    { id: 6, name: "Home Living", slug: "home-living", isActive: true },
    { id: 7, name: "Game Shop", slug: "game-shop", isActive: true },
];

const mockProducts: ProductCardProduct[] = [
    {
        id: 101,
        storeId: 1,
        categoryId: 1,
        name: "Gaming Keyboard Set",
        description: "Keyboard, headset, and mouse set",
        price: 490000,
        stock: 34,
        imageUrl:
            "https://images.unsplash.com/photo-1541140532154-b024d705b90a?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: true,
        badge: "ໃໝ່",
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 102,
        storeId: 2,
        categoryId: 2,
        name: "Teddy Bear",
        description: "Soft plush teddy bear",
        price: 159000,
        stock: 42,
        imageUrl:
            "https://images.unsplash.com/photo-1560040509-19f98c49f7d5?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: true,
        badge: "ແນະນຳ",
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 103,
        storeId: 3,
        categoryId: 3,
        name: "Aquarium Decoration Set",
        description: "Aquarium plants and castle decor",
        price: 120000,
        stock: 29,
        imageUrl:
            "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: false,
        badge: "ໃໝ່",
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 104,
        storeId: 4,
        categoryId: 4,
        name: "Premium Dog Food",
        description: "Healthy food for adult dogs",
        price: 450,
        stock: 20,
        imageUrl:
            "https://images.unsplash.com/photo-1582397502212-1a6b5721afe4?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: false,
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 105,
        storeId: 5,
        categoryId: 1,
        name: "Wireless Headphones",
        description: "Comfortable wireless headphones",
        price: 350000,
        stock: 18,
        imageUrl:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: true,
        badge: "ແນະນຳ",
        rating: 4.7,
        reviews: 96,
    },
    {
        id: 106,
        storeId: 4,
        categoryId: 4,
        name: "Cat Tree Tower",
        description: "Multi-level cat tower",
        price: 680000,
        stock: 11,
        imageUrl:
            "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: false,
        badge: "ໃໝ່",
        rating: 4.8,
        reviews: 128,
    },
    {
        id: 107,
        storeId: 7,
        categoryId: 5,
        name: "Game Controller",
        description: "Wireless game controller",
        price: 390000,
        stock: 24,
        imageUrl:
            "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: true,
        badge: "ແນະນຳ",
        rating: 4.7,
        reviews: 88,
    },
    {
        id: 108,
        storeId: 6,
        categoryId: 6,
        name: "LED Desk Lamp",
        description: "Minimal LED desk lamp",
        price: 210000,
        stock: 16,
        imageUrl:
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
        isActive: true,
        isFeatured: false,
        rating: 4.8,
        reviews: 74,
    },
];

type SectionHeaderProps = {
    title: string;
};

function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-base font-black text-shop-text md:text-xl">
                {title}
            </h2>
            <a
                href="#/products"
                className="inline-flex items-center gap-1 text-xs font-black text-shop-primary transition hover:text-shop-secondary md:text-sm"
            >
                ເບິ່ງທັງໝົດ
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <path
                        d="m9 6 6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.2"
                    />
                </svg>
            </a>
        </div>
    );
}

export function HomeFeaturedProducts() {
    const [products, setProducts] = useState<ProductCardProduct[]>(mockProducts);
    const [stores, setStores] = useState<Store[]>(mockStores);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const [featuredResult, productsResult, storesResult] =
                    await Promise.allSettled([
                        api.featuredProducts(),
                        api.products(),
                        api.stores(),
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
                const apiFeatured =
                    featuredResult.status === "fulfilled"
                        ? (featuredResult.value.data ?? []).filter(
                              (product) => product.isActive,
                          )
                        : [];
                const apiStores =
                    storesResult.status === "fulfilled"
                        ? (storesResult.value.data ?? []).filter((store) => store.isActive)
                        : [];
                const mergedProducts =
                    apiProducts.length > 0
                        ? apiProducts
                        : apiFeatured.length > 0
                          ? apiFeatured
                          : mockProducts;

                setProducts(mergedProducts);
                setStores(apiStores.length > 0 ? apiStores : mockStores);
            } catch {
                if (isMounted) {
                    setProducts(mockProducts);
                    setStores(mockStores);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            isMounted = false;
        };
    }, []);

    const storeById = useMemo(
        () => new Map(stores.map((store) => [store.id, store])),
        [stores],
    );
    const visibleAll = products.slice(0, 8);
    const visibleStores = stores.slice(0, 4);

    return (
        <section id="products" className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
            {isLoading ? (
                <div className="space-y-7">
                    <div className="grid grid-cols-4 gap-2 md:grid-cols-6 md:gap-4">
                        {[1, 2, 3, 4, 5, 6].map((item) => (
                            <div
                                key={item}
                                className={`h-36 animate-pulse rounded-xl bg-white shadow-[0_8px_20px_rgba(51,51,51,0.04)] ${
                                    item > 4 ? "hidden md:block" : ""
                                }`}
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className={`h-44 animate-pulse rounded-2xl bg-white shadow-[0_10px_26px_rgba(51,51,51,0.04)] sm:h-64 md:h-80 ${
                                    item > 2 ? "hidden md:block" : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-7">
                    <div>
                        <SectionHeader title="ຮ້ານຄ້າແນະນຳ" />
                        <div className="grid grid-cols-4 gap-2 md:gap-5">
                            {visibleStores.map((store) => (
                                <a
                                    key={store.id}
                                    href="#/stores"
                                    className="group overflow-hidden rounded-xl border border-red-50 bg-white shadow-[0_6px_16px_rgba(51,51,51,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(229,57,53,0.12)] md:rounded-2xl"
                                >
                                    <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#fff4f1] md:aspect-[4/3]">
                                        {store.bannerUrl ? (
                                            <img
                                                src={store.bannerUrl}
                                                alt=""
                                                className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                                            />
                                        ) : null}
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/10 to-white/70" />
                                        <div className="absolute bottom-[-16px] grid h-11 w-11 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_8px_18px_rgba(51,51,51,0.14)] md:bottom-[-22px] md:h-16 md:w-16 md:border-4 md:shadow-[0_10px_24px_rgba(51,51,51,0.16)]">
                                            {store.logoUrl ? (
                                                <img
                                                    src={store.logoUrl}
                                                    alt={store.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className="h-5 w-5 text-shop-primary md:h-7 md:w-7"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M4 10h16v10H4zM7 10V7a5 5 0 0 1 10 0v3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-1.5 pb-2 pt-5 text-center md:px-4 md:pb-4 md:pt-8">
                                        <h3 className="line-clamp-1 text-[10px] font-black leading-4 text-shop-text md:text-base">
                                            {store.name}
                                        </h3>
                                        <p className="mt-1 hidden line-clamp-2 min-h-8 text-[10px] font-semibold leading-4 text-gray-500 md:block md:text-xs md:leading-5">
                                            {store.description ?? "RubyStores"}
                                        </p>
                                        <span className="mt-3 hidden h-9 w-full items-center justify-center rounded-xl bg-shop-primary px-4 text-xs font-black text-white shadow-[0_10px_22px_rgba(229,57,53,0.18)] transition group-hover:bg-shop-secondary md:inline-flex">
                                            ເຂົ້າຮ້ານຄ້າ
                                        </span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <SectionHeader title="ສິນຄ້າທັງໝົດ" />
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                            {visibleAll.map((product) => (
                                <ProductGridCard
                                    key={product.id}
                                    product={product}
                                    store={storeById.get(product.storeId)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
