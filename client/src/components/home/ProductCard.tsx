import type { Product } from "../../lib/api";

type ProductCardProps = {
    product: Product;
};

const formatPrice = (price: Product["price"]) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(Number(price));

function CartIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M5 6h2l1.4 8.2a2 2 0 0 0 2 1.7h5.8a2 2 0 0 0 1.9-1.4L20 8H8M10 20h.1M17 20h.1"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

function ProductFallbackIcon() {
    return (
        <span className="text-5xl" aria-hidden="true">
            🛍️
        </span>
    );
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-red-50 bg-white shadow-[0_12px_30px_rgba(51,51,51,0.055)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(229,57,53,0.13)]">
            <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-white via-[#fff8f6] to-[#ffece5] p-3 sm:h-48 sm:p-5">
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-shop-primary shadow-sm">
                    ແນະນຳ
                </span>
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-contain drop-shadow-sm transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-white/80 text-shop-primary shadow-[0_14px_30px_rgba(229,57,53,0.10)] sm:h-24 sm:w-24">
                        <ProductFallbackIcon />
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-4">
                <h3 className="line-clamp-2 min-h-10 text-xs font-black leading-5 text-shop-text sm:min-h-12 sm:text-base sm:leading-6">
                    {product.name}
                </h3>
                <p className="mt-1 line-clamp-2 min-h-9 text-[11px] leading-5 text-gray-500 sm:min-h-10 sm:text-xs">
                    {product.description ?? "ສິນຄ້າແນະນຳຈາກ RubyStores"}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-black text-shop-text sm:text-xl">
                        {formatPrice(product.price)}
                    </p>
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-xl border border-red-100 bg-white text-shop-primary transition hover:border-shop-primary hover:bg-shop-primary hover:text-white sm:h-11 sm:w-11"
                        aria-label="ເພີ່ມໃສ່ກະຕ່າ"
                    >
                        <CartIcon />
                    </button>
                </div>
            </div>
        </article>
    );
}
