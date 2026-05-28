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

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_22px_rgba(51,51,51,0.04)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(229,57,53,0.12)]">
      <div className="flex h-40 items-center justify-center bg-white p-4">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full bg-shop-light text-shop-primary">
            <CartIcon />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 min-h-11 text-sm font-black leading-6 text-shop-text">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 min-h-10 text-xs leading-5 text-gray-500">
          {product.description ?? "ສິນຄ້າແນະນຳຈາກ RubyStores"}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-black text-shop-text">
            {formatPrice(product.price)}
          </p>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-lg border border-red-100 text-shop-primary transition hover:border-shop-primary hover:bg-shop-primary hover:text-white"
            aria-label="ເພີ່ມລົງກະຕ່າ"
          >
            <CartIcon />
          </button>
        </div>
      </div>
    </article>
  );
}

