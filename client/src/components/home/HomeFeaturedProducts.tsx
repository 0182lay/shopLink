import { useEffect, useState } from "react";
import { api, type Product } from "../../lib/api";
import { ProductCard } from "./ProductCard";

const formatPrice = (price: Product["price"]) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(Number(price));

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

function CompactProductCard({ product }: { product: Product }) {
    return (
        <a
            href="#/products"
            className="group block overflow-hidden rounded-xl border border-red-50 bg-white shadow-[0_8px_20px_rgba(51,51,51,0.045)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(229,57,53,0.11)]"
        >
            <div className="flex aspect-square items-center justify-center bg-white p-3">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <span className="text-4xl" aria-hidden="true">
                        🛍️
                    </span>
                )}
            </div>
            <div className="px-2.5 pb-3">
                <p className="truncate text-[11px] font-black text-shop-primary">
                    {formatPrice(product.price)}
                </p>
            </div>
        </a>
    );
}

export function HomeFeaturedProducts() {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const [featuredResult, productsResult] = await Promise.allSettled([
                    api.featuredProducts(),
                    api.products(),
                ]);

                if (isMounted) {
                    const products =
                        productsResult.status === "fulfilled"
                            ? (productsResult.value.data ?? []).filter(
                                  (product) => product.isActive,
                              )
                            : [];
                    const featured =
                        featuredResult.status === "fulfilled"
                            ? (featuredResult.value.data ?? []).filter(
                                  (product) => product.isActive,
                              )
                            : [];

                    setFeaturedProducts(
                        featured.length > 0
                            ? featured
                            : products.filter((product) => product.isFeatured),
                    );
                    setAllProducts(products);
                    setError(products.length === 0 && featured.length === 0 ? "ດຶງຂໍ້ມູນສິນຄ້າບໍ່ສຳເລັດ" : null);
                }
            } catch {
                if (isMounted) {
                    setError("ດຶງຂໍ້ມູນສິນຄ້າບໍ່ສຳເລັດ");
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

    const visibleFeatured = featuredProducts.slice(0, 6);
    const visibleAll = allProducts;

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
                                className={`h-72 animate-pulse rounded-2xl bg-white shadow-[0_10px_26px_rgba(51,51,51,0.04)] ${
                                    item > 2 ? "hidden md:block" : ""
                                }`}
                            />
                        ))}
                    </div>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm font-semibold text-shop-primary">
                    {error}
                </div>
            ) : (
                <div className="space-y-7">
                    <div>
                        <SectionHeader title="ສິນຄ້າແນະນຳ" />
                        {visibleFeatured.length === 0 ? (
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">
                                ຍັງບໍ່ມີສິນຄ້າແນະນຳ
                            </div>
                        ) : (
                            <div className="grid grid-cols-4 gap-2 md:grid-cols-6 md:gap-4">
                                {visibleFeatured.map((product, index) => (
                                    <div
                                        key={product.id}
                                        className={index > 3 ? "hidden md:block" : ""}
                                    >
                                        <CompactProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <SectionHeader title="ສິນຄ້າທັງໝົດ" />
                        {visibleAll.length === 0 ? (
                            <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">
                                ຍັງບໍ່ມີສິນຄ້າ
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                                {visibleAll.map((product) => (
                                    <div key={product.id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
