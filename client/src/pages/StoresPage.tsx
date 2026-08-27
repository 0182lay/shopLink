import { useEffect, useMemo, useState } from "react";
import { HomeFooter } from "../components/home/HomeFooter";
import { HomeHeader } from "../components/home/HomeHeader";
import { HomeServiceStrip } from "../components/home/HomeServiceStrip";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import type { Store } from "../types/store";
import { api } from "../lib/api";

type StoreSortMode = "popular" | "name";

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

function BagIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
            <path
                d="M5 8h14l-1 12H6zM8 8a4 4 0 0 1 8 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

function StoreCard({ store }: { store: Store }) {
    return (
        <article className="group flex gap-3 overflow-hidden rounded-2xl border border-red-50 bg-white p-3 shadow-[0_8px_22px_rgba(51,51,51,0.055)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(229,57,53,0.12)] md:block md:p-0 md:hover:-translate-y-1">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#fff4f1] md:h-32 md:w-full md:rounded-none">
                {store.bannerUrl ? (
                    <img
                        src={store.bannerUrl}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105"
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/15 to-white/70" />
                <div className="absolute left-1/2 top-1/2 z-10 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full border-[5px] border-white bg-white text-shop-primary shadow-[0_14px_28px_rgba(51,51,51,0.16)] md:top-24 md:h-20 md:w-20 md:border-[6px]">
                    {store.logoUrl ? (
                        <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <BagIcon />
                    )}
                </div>
            </div>

            <div className="relative min-w-0 flex-1 py-1 pr-24 md:px-4 md:pb-5 md:pt-12 md:text-center">
                <h3 className="line-clamp-1 text-base font-black text-shop-text">
                    {store.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 text-gray-500 md:mx-auto md:min-h-[48px] md:max-w-xs">
                    {store.description ?? "ຮ້ານຄ້າໃນ RubyStores"}
                </p>
                <a
                    href={`#/stores/${store.slug}`}
                    className="absolute right-0 top-1 inline-flex h-9 items-center justify-center rounded-xl border border-red-100 px-3 text-[11px] font-black text-shop-primary transition hover:border-shop-primary hover:bg-shop-primary hover:text-white md:static md:mt-3 md:w-full md:px-4 md:text-xs"
                >
                    ເຂົ້າຮ້ານຄ້າ
                </a>
            </div>
        </article>
    );
}

function sortStores(stores: Store[], sort: StoreSortMode) {
    if (sort === "name") {
        return [...stores].sort((a, b) => a.name.localeCompare(b.name));
    }

    return stores;
}

export function StoresPage() {
    const [sort, setSort] = useState<StoreSortMode>("popular");
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadStores() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const result = await api.stores();

                if (!isMounted) {
                    return;
                }

                setStores((result.data ?? []).filter((store) => store.isActive));
            } catch {
                if (isMounted) {
                    setStores([]);
                    setErrorMessage("ໂຫຼດຂໍ້ມູນຮ້ານຄ້າບໍ່ໄດ້.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadStores();

        return () => {
            isMounted = false;
        };
    }, []);

    const visibleStores = useMemo(() => sortStores(stores, sort), [stores, sort]);

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 pt-[70px] text-shop-text md:pb-10 md:pt-28">
            <HomeHeader activePage="stores" title="ຮ້ານຄ້າທັງໝົດ" hideSearch />

            <section className="mx-auto max-w-7xl px-3 py-3 sm:px-6 md:py-5 lg:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div className="hidden">
                        <h1 className="text-2xl font-black text-shop-text md:text-4xl">
                            ຮ້ານຄ້າທັງໝົດ
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-gray-500 md:text-base">
                            ພົບຮ້ານຄ້າທີ່ໃຊ່ ສຳລັບສິນຄ້າທີ່ທ່ານມັກ
                        </p>
                    </div>

                    <label className="relative w-fit md:ml-auto">
                        <span className="sr-only">ຈັດຮຽງ</span>
                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value as StoreSortMode)}
                            className="h-10 appearance-none rounded-2xl border border-red-100 bg-white py-0 pl-9 pr-8 text-xs font-black text-shop-text shadow-sm outline-none transition hover:border-shop-primary"
                        >
                            <option value="popular">ຈັດຮຽງ: ຍອດນິຍົມ</option>
                            <option value="name">ຈັດຮຽງ: ຊື່ຮ້ານ</option>
                        </select>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <SortIcon />
                        </span>
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

                {errorMessage ? (
                    <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-shop-primary">
                        {errorMessage}
                    </div>
                ) : null}

                {isLoading ? (
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-56 animate-pulse rounded-2xl bg-white shadow-[0_8px_22px_rgba(51,51,51,0.055)]"
                            />
                        ))}
                    </div>
                ) : visibleStores.length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 xl:grid-cols-4">
                        {visibleStores.map((store) => (
                            <StoreCard key={store.id} store={store} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-red-100 bg-white px-5 py-10 text-center text-sm font-bold text-gray-500 shadow-[0_8px_22px_rgba(51,51,51,0.04)]">
                        ຍັງບໍ່ມີຮ້ານຄ້າໃນລະບົບ
                    </div>
                )}
            </section>

            <HomeServiceStrip />
            <HomeFooter />
            <MobileBottomNav activePage="stores" />
        </main>
    );
}
