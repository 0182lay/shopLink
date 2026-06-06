import type { Product } from "../../lib/api";
import type { Store } from "../../types/store";

export type ProductCardProduct = Product & {
    badge?: string;
    oldPrice?: number;
    rating?: number;
    reviews?: number;
    soldText?: string;
};

type ProductGridCardProps = {
    product: ProductCardProduct;
    store?: Store;
};

const formatPrice = (price: Product["price"]) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(Number(price));

export function ProductGridCard({ product, store }: ProductGridCardProps) {
    const badge = product.badge ?? (product.isFeatured ? "ແນະນຳ" : null);

    return (
        <article
            onClick={() => {
                window.location.hash = `#/products/${product.id}`;
            }}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-red-50 bg-white shadow-[0_8px_22px_rgba(51,51,51,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(229,57,53,0.12)]"
        >
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#fff4f1]">
                {badge ? (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-shop-primary px-2 py-1 text-[10px] font-black text-white shadow-sm md:left-3 md:top-3 md:text-[11px]">
                        {badge}
                    </span>
                ) : null}

                <button
                    type="button"
                    onClick={(event) => event.stopPropagation()}
                    className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-gray-500 shadow-[0_4px_12px_rgba(51,51,51,0.10)] transition hover:text-shop-primary md:right-3 md:top-3"
                    aria-label="ເພີ່ມໃສ່ລາຍການທີ່ມັກ"
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
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white/80 text-gray-400 shadow-sm md:h-20 md:w-20">
                        <svg viewBox="0 0 24 24" className="h-8 w-8">
                            <path
                                d="M5 8h14l-1 12H6zM8 8a4 4 0 0 1 8 0"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                            />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex flex-col p-3 md:p-4">
                <h3 className="line-clamp-2 text-[11px] font-black leading-4 text-shop-text sm:text-sm md:text-base md:leading-5">
                    {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 min-h-8 text-[10px] font-semibold leading-4 text-gray-500 sm:text-xs md:leading-5">
                    {product.description ?? store?.name ?? "RubyStores"}
                </p>

                <div className="mt-3 flex items-end justify-between gap-2 md:mt-4">
                    <div className="min-w-0">
                        <p className="truncate text-xs font-black text-shop-primary sm:text-base">
                            {formatPrice(product.price)}
                        </p>
                        <div className="mt-0.5 flex min-h-4 items-center gap-2 text-[9px] font-semibold text-gray-400 sm:text-[11px]">
                            {product.oldPrice ? (
                                <span className="line-through">
                                    {formatPrice(product.oldPrice)}
                                </span>
                            ) : null}
                            {product.soldText ? <span>{product.soldText}</span> : null}
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={(event) => event.stopPropagation()}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-red-100 bg-white text-shop-primary shadow-sm transition hover:border-shop-primary hover:bg-shop-primary hover:text-white md:h-9 md:w-9"
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
