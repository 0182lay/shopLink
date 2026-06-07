import { useEffect, useMemo, useState } from "react";
import { api, type Product } from "../../lib/api";
import type { Store } from "../../types/store";
import { ProductGridCard } from "../products/ProductGridCard";

type LoadState = "loading" | "ready" | "error";

type SectionHeaderProps = {
    title: string;
    href?: string;
};

function SectionHeader({ title, href }: SectionHeaderProps) {
    return (
        <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="text-base font-black text-shop-text md:text-xl">
                {title}
            </h2>
            {href ? (
                <a
                    href={href}
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
            ) : null}
        </div>
    );
}

function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-2xl border border-dashed border-red-100 bg-white px-5 py-8 text-sm font-bold text-gray-500 shadow-[0_8px_20px_rgba(51,51,51,0.035)]">
            {text}
        </div>
    );
}

function StoreCard({ store }: { store: Store }) {
    return (
        <a
            href="#/stores"
            className="group overflow-hidden rounded-xl border border-red-50 bg-white shadow-[0_6px_16px_rgba(51,51,51,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(229,57,53,0.12)] md:rounded-2xl"
        >
            <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-[#fff4f1] md:aspect-[4/3]">
                {store.bannerUrl ? (
                    <img
                        src={store.bannerUrl}
                        alt=""
                        className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/10 to-white/70" />
                <div className="absolute bottom-[-16px] z-10 grid h-11 w-11 place-items-center overflow-hidden rounded-full border-[3px] border-white bg-white shadow-[0_8px_18px_rgba(51,51,51,0.14)] md:bottom-[-22px] md:h-16 md:w-16 md:border-4 md:shadow-[0_10px_24px_rgba(51,51,51,0.16)]">
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
    );
}

export function HomeFeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loadState, setLoadState] = useState<LoadState>("loading");

    useEffect(() => {
        let isMounted = true;

        async function loadHomeData() {
            setLoadState("loading");

            try {
                const [productsResult, storesResult] = await Promise.allSettled([
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
                const apiStores =
                    storesResult.status === "fulfilled"
                        ? (storesResult.value.data ?? []).filter((store) => store.isActive)
                        : [];

                setProducts(apiProducts);
                setStores(apiStores);
                setLoadState(
                    productsResult.status === "rejected" && storesResult.status === "rejected"
                        ? "error"
                        : "ready",
                );
            } catch {
                if (isMounted) {
                    setProducts([]);
                    setStores([]);
                    setLoadState("error");
                }
            }
        }

        loadHomeData();

        return () => {
            isMounted = false;
        };
    }, []);

    const storeById = useMemo(
        () => new Map(stores.map((store) => [store.id, store])),
        [stores],
    );
    const visibleStores = stores.slice(0, 4);
    const visibleProducts = products.slice(0, 8);

    return (
        <section id="products" className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
            {loadState === "loading" ? (
                <div className="space-y-7">
                    <div className="grid grid-cols-4 gap-2 md:gap-5">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-32 animate-pulse rounded-xl bg-white shadow-[0_8px_20px_rgba(51,51,51,0.04)] md:h-72 md:rounded-2xl"
                            />
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-64 animate-pulse rounded-2xl bg-white shadow-[0_10px_26px_rgba(51,51,51,0.04)] md:h-80"
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-7">
                    {loadState === "error" ? (
                        <EmptyState text="ຍັງໂຫຼດຂໍ້ມູນຈາກ API ບໍ່ໄດ້ ລອງກວດ backend ຫຼື refresh ໜ້າໃໝ່." />
                    ) : null}

                    <div>
                        <SectionHeader title="ຮ້ານແນະນຳສຳລັບທ່ານ" href="#/stores" />
                        {visibleStores.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 md:gap-5">
                                {visibleStores.map((store) => (
                                    <StoreCard key={store.id} store={store} />
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="ຍັງບໍ່ມີຮ້ານຄ້າໃນລະບົບ." />
                        )}
                    </div>

                    <div>
                        <SectionHeader title="ສິນຄ້າທັງໝົດ" href="#/products" />
                        {visibleProducts.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                                {visibleProducts.map((product) => (
                                    <ProductGridCard
                                        key={product.id}
                                        product={product}
                                        store={storeById.get(product.storeId)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <EmptyState text="ຍັງບໍ່ມີສິນຄ້າໃນລະບົບ." />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
