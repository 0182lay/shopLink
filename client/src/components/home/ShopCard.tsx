import type { Store } from "../../types/store";

type ShopCardProps = {
  store: Store;
};

function PawIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true">
      <path
        d="M8.4 10.2c1 0 1.8-1.1 1.8-2.5S9.4 5.2 8.4 5.2 6.6 6.3 6.6 7.7s.8 2.5 1.8 2.5Zm7.2 0c1 0 1.8-1.1 1.8-2.5s-.8-2.5-1.8-2.5-1.8 1.1-1.8 2.5.8 2.5 1.8 2.5ZM5.3 14c.9 0 1.6-1 1.6-2.2S6.2 9.6 5.3 9.6s-1.6 1-1.6 2.2S4.4 14 5.3 14Zm13.4 0c.9 0 1.6-1 1.6-2.2s-.7-2.2-1.6-2.2-1.6 1-1.6 2.2.7 2.2 1.6 2.2Zm-9.9 1.1c.8-1.4 1.5-2.2 3.2-2.2s2.4.8 3.2 2.2c.7 1.1 2 1.7 2 3.2 0 1.6-1.3 2.5-2.8 2.1-.9-.2-1.5-.5-2.4-.5s-1.5.3-2.4.5c-1.5.4-2.8-.5-2.8-2.1 0-1.5 1.3-2.1 2-3.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ShopCard({ store }: ShopCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-[0_8px_22px_rgba(51,51,51,0.045)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_28px_rgba(229,57,53,0.12)]">
      <div className="relative h-32 overflow-hidden bg-gradient-to-br from-shop-light via-white to-red-50">
        {store.logoUrl ? (
          <img
            src={store.logoUrl}
            alt={store.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-shop-primary text-white shadow-lg shadow-red-500/20">
              <PawIcon />
            </div>
          </div>
        )}

        <div className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-shop-primary text-white shadow-lg shadow-red-500/20">
          <PawIcon />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-shop-text">
              {store.name}
            </h3>
            <p className="mt-1 line-clamp-2 min-h-9 text-xs leading-5 text-gray-500">
              {store.description ?? "ຮ້ານຄ້າຄຸນນະພາບພ້ອມໃຫ້ບໍລິການ"}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="mt-3 h-9 w-full rounded-md border border-shop-primary bg-white text-sm font-black text-shop-primary transition group-hover:bg-shop-primary group-hover:text-white"
        >
          ເຂົ້າຮ້ານ
        </button>
      </div>
    </article>
  );
}
