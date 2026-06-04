import type { Store } from "../../types/store";
import { StoreCard } from "./StoreCard";

type StoreShowcaseSectionProps = {
    stores: Store[];
    isLoading?: boolean;
    error?: string | null;
    title?: string;
    limit?: number;
    viewAllHref?: string;
    className?: string;
};

export function StoreShowcaseSection({
    stores,
    isLoading = false,
    error = null,
    title = "ຮ້ານແນະນຳສຳລັບທ່ານ",
    limit = 4,
    viewAllHref = "#/stores",
    className = "",
}: StoreShowcaseSectionProps) {
    const visibleStores = stores.slice(0, limit);

    return (
        <section className={className}>
            <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-lg font-black text-shop-text md:text-xl">
                    {title}
                </h2>
                <a
                    href={viewAllHref}
                    className="inline-flex items-center gap-1 text-sm font-black text-shop-primary transition hover:text-shop-secondary"
                >
                    ເບິ່ງທັງໝົດ
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
                </a>
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
            ) : error && visibleStores.length === 0 ? (
                <div className="rounded-xl border border-red-100 bg-white p-6 text-sm font-semibold text-shop-primary">
                    {error}
                </div>
            ) : visibleStores.length === 0 ? (
                <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm font-semibold text-gray-500">
                    ຍັງບໍ່ມີຮ້ານແນະນຳ
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                    {visibleStores.map((store, index) => (
                        <StoreCard key={store.id} store={store} index={index} />
                    ))}
                </div>
            )}
        </section>
    );
}
