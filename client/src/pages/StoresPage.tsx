import { useEffect, useState } from "react";
import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";
import { StoreShowcaseSection } from "../components/stores/StoreShowcaseSection";
import { apiGet } from "../lib/api";
import type { Store } from "../types/store";

export function StoresPage() {
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
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-24 text-shop-text md:pb-10">
            <HomeHeader activePage="products" />

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <StoreShowcaseSection
                    stores={stores}
                    isLoading={isLoading}
                    error={error}
                    title="ຮ້ານຄ້າທັງໝົດ"
                    limit={stores.length}
                    viewAllHref="#/products"
                />
            </section>

            <MobileBottomNav activePage="products" />
        </main>
    );
}
