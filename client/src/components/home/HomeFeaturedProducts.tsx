import { useEffect, useState } from "react";
import { api, type Product } from "../../lib/api";
import { ProductCard } from "./ProductCard";

export function HomeFeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const response = await api.featuredProducts();

        if (isMounted) {
          setProducts((response.data ?? []).filter((product) => product.isActive));
          setError(null);
        }
      } catch {
        if (isMounted) {
          setError("ດຶງສິນຄ້າແນະນຳບໍ່ສຳເລັດ");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-base font-black text-shop-text md:text-lg">
          ສິນຄ້າແນະນຳ
        </h2>
        <button
          type="button"
          className="text-xs font-black text-shop-primary transition hover:text-shop-secondary"
        >
          ເບິ່ງທັງໝົດ
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-xl bg-white shadow-[0_8px_22px_rgba(51,51,51,0.035)]"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-white p-6 text-sm font-semibold text-shop-primary">
          {error}
        </div>
      ) : products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">
          ຍັງບໍ່ມີສິນຄ້າແນະນຳ ໃຫ້ເລືອກ isFeatured ໃນສິນຄ້າກ່ອນ
        </div>
      )}
    </section>
  );
}
