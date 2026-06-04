import { useEffect, useMemo, useState } from "react";
import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { ProductCategoryBar } from "../components/products/ProductCategoryBar";
import { ProductFilterSidebar } from "../components/products/ProductFilterSidebar";
import { ProductGridCard } from "../components/products/ProductGridCard";
import { ProductMobileControls } from "../components/products/ProductMobileControls";
import { ProductToolbar } from "../components/products/ProductToolbar";
import { StoreShowcaseSection } from "../components/stores/StoreShowcaseSection";
import { api, apiGet, type Category, type Product } from "../lib/api";
import type { Store } from "../types/store";

type SortMode = "recommended" | "price-low" | "price-high";

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | "all">("all");
    const [selectedStoreId, setSelectedStoreId] = useState<number | "all">("all");
    const [sort, setSort] = useState<SortMode>("recommended");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadProductsPage() {
            try {
                const [productsResult, categoriesResult, storesResult] =
                    await Promise.allSettled([
                        api.products(),
                        api.categories(),
                        apiGet<Store[]>("/api/stores"),
                    ]);

                if (isMounted) {
                    const products =
                        productsResult.status === "fulfilled"
                            ? (productsResult.value.data ?? []).filter(
                                  (product) => product.isActive,
                              )
                            : [];
                    const categories =
                        categoriesResult.status === "fulfilled"
                            ? (categoriesResult.value.data ?? []).filter(
                                  (category) => category.isActive,
                              )
                            : [];
                    const stores =
                        storesResult.status === "fulfilled"
                            ? storesResult.value.filter((store) => store.isActive)
                            : [];

                    setProducts(products);
                    setCategories(categories);
                    setStores(stores);
                    setError(productsResult.status === "rejected" ? "ດຶງຂໍ້ມູນສິນຄ້າບໍ່ສຳເລັດ" : null);
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

        loadProductsPage();

        return () => {
            isMounted = false;
        };
    }, []);

    const storeById = useMemo(
        () => new Map(stores.map((store) => [store.id, store])),
        [stores],
    );

    const visibleProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            const matchesCategory =
                selectedCategoryId === "all" || product.categoryId === selectedCategoryId;
            const matchesStore =
                selectedStoreId === "all" || product.storeId === selectedStoreId;

            return matchesCategory && matchesStore;
        });

        return filtered.sort((a, b) => {
            if (sort === "price-low") {
                return Number(a.price) - Number(b.price);
            }

            if (sort === "price-high") {
                return Number(b.price) - Number(a.price);
            }

            return Number(b.isFeatured ?? false) - Number(a.isFeatured ?? false);
        });
    }, [products, selectedCategoryId, selectedStoreId, sort]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 text-shop-text md:pb-10">
            <HomeHeader activePage="products" />

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div>
                    <ProductToolbar
                        count={visibleProducts.length}
                        sort={sort}
                        onSortChange={setSort}
                    />

                    <div className="mt-5">
                        <ProductCategoryBar
                            categories={categories}
                            selectedCategoryId={selectedCategoryId}
                            onSelectCategory={setSelectedCategoryId}
                        />
                    </div>

                    <div className="mt-4">
                        <ProductMobileControls
                            stores={stores}
                            selectedStoreId={selectedStoreId}
                            sort={sort}
                            onSelectStore={setSelectedStoreId}
                            onSortChange={setSort}
                        />
                    </div>

                    <StoreShowcaseSection
                        stores={stores}
                        isLoading={isLoading}
                        error={error}
                        title="ຮ້ານຄ້າຍອດນິຍົມ"
                        limit={4}
                        className="mt-6"
                    />

                    <div className="mt-5 flex gap-5">
                        <ProductFilterSidebar
                            stores={stores}
                            selectedStoreId={selectedStoreId}
                            onSelectStore={setSelectedStoreId}
                        />

                        <div className="min-w-0 flex-1">
                            {isLoading ? (
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                        <div
                                            key={item}
                                            className="h-80 animate-pulse rounded-2xl bg-white"
                                        />
                                    ))}
                                </div>
                            ) : error ? (
                                <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm font-bold text-shop-primary">
                                    {error}
                                </div>
                            ) : visibleProducts.length === 0 ? (
                                <div className="rounded-2xl border border-red-100 bg-white p-6 text-sm font-bold text-gray-500">
                                    ຍັງບໍ່ມີສິນຄ້າໃນຕົວກອງນີ້
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
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
                    </div>
                </div>
            </section>

            <MobileBottomNav activePage="products" />
        </main>
    );
}
