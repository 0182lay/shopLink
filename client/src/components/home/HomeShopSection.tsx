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
    <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-shop-text md:text-lg">
            ຮ້ານແນະນຳສຳລັບທ່ານ
          </h2>
        </div>

        <button
          type="button"
          className="text-xs font-black text-shop-primary transition hover:text-shop-secondary"
        >
          ເບິ່ງທັງໝົດ
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-52 animate-pulse rounded-xl bg-white shadow-[0_8px_22px_rgba(51,51,51,0.035)]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-white p-6 text-sm font-semibold text-shop-primary">
          {error}
        </div>
      ) : stores.length > 0 ? (
        <div
          className={`grid gap-4 ${
            stores.length === 1
              ? "max-w-sm"
              : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {stores.map((store) => (
            <ShopCard key={store.id} store={store} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
          ຍັງບໍ່ມີຮ້ານຄ້າໃນລະບົບ
        </div>
      )}
    </section>
  );
}
