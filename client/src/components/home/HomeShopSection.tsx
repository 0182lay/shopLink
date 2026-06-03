import { useEffect, useState } from "react";
import { apiGet } from "../../lib/api";
import type { Store } from "../../types/store";
import { ShopCard } from "./ShopCard";

export function HomeShopSection() {
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadStores() {
            try {
                const data = await apiGet<Store[]>("/api/stores");

                if (isMounted) {
                    setStores(data.filter((store) => store.isActive));
                    setError(null);
                }
            } catch {
                if (isMounted) {
                    setError("ດຶງຂໍ້ມູນຮ້ານຄ້າບໍ່ສຳເລັດ");
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

    return (
        <section className="mx-auto mt-1 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-black text-shop-text md:text-xl">
                    ຮ້ານແນະນຳສຳລັບທ່ານ
                </h2>
                <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm font-black text-shop-primary transition hover:text-shop-secondary"
                >
                    ດູທັງໝົດ
                    <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        aria-hidden="true"
                    >
                        <path
                            d="m9 6 6 6-6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.2"
                        />
                    </svg>
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-56 animate-pulse rounded-xl bg-white shadow-[0_10px_26px_rgba(51,51,51,0.04)]"
                        />
                    ))}
                </div>
            ) : error && stores.length === 0 ? (
                <div className="rounded-xl border border-red-100 bg-white p-6 text-sm font-semibold text-shop-primary">
                    {error}
                </div>
            ) : stores.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">
                    ຍັງບໍ່ມີຮ້ານແນະນຳ
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {stores.slice(0, 4).map((store, index) => (
                        <ShopCard key={store.id} store={store} index={index} />
                    ))}
                </div>
            )}
        </section>
    );
}
