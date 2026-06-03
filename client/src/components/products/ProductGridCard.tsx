import type { Product } from "../../lib/api";
import type { Store } from "../../types/store";

type ProductGridCardProps = {
    product: Product;
    store?: Store;
};

const formatPrice = (price: Product["price"]) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(Number(price));

export function ProductGridCard({ product, store }: ProductGridCardProps) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-red-50 bg-white shadow-[0_10px_26px_rgba(51,51,51,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(229,57,53,0.12)]">
            <div className="relative flex aspect-square items-center justify-center bg-gradient-to-br from-white via-[#fff8f6] to-[#ffece5] p-3 sm:p-4">
                {product.isFeatured ? (
                    <span className="absolute left-3 top-3 rounded-full bg-shop-primary px-2.5 py-1 text-[11px] font-black text-white">
                        ແນະນຳ
                    </span>
                ) : null}
                <button
                    type="button"
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-gray-400 shadow-sm transition hover:text-shop-primary"
                    aria-label="ເພີ່ມໃນລາຍການທີ່ມັກ"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                        <path
                            d="M20.8 8.8c0 5.3-8.8 10-8.8 10s-8.8-4.7-8.8-10A4.7 4.7 0 0 1 12 5.7a4.7 4.7 0 0 1 8.8 3.1Z"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.8"
                        />
                    </svg>
                </button>

                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain drop-shadow-sm transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="grid h-20 w-20 place-items-center rounded-full bg-white/80 text-3xl shadow-sm">
                        🛍️
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-4">
                <h3 className="line-clamp-2 min-h-10 text-xs font-black leading-5 text-shop-text sm:text-sm">
                    {product.name}
                </h3>
                <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-gray-500 sm:text-xs">
                    {store?.name ?? "RubyStores"}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-gray-500 sm:text-xs">
                    <span className="text-[#ff9f1c]">★</span>
                    <span>4.8</span>
                    <span>(128)</span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-shop-primary sm:text-base">
                        {formatPrice(product.price)}
                    </p>
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 bg-white text-shop-primary transition hover:border-shop-primary hover:bg-shop-primary hover:text-white"
                        aria-label="ເພີ່ມໃສ່ກະຕ່າ"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                            <path
                                d="M5 6h2l1.4 8.2a2 2 0 0 0 2 1.7h5.8a2 2 0 0 0 1.9-1.4L20 8H8M10 20h.1M17 20h.1"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.9"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
}
