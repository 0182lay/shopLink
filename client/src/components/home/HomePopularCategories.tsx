import { useEffect, useMemo, useState } from "react";
import { api, type Category } from "../../lib/api";

const fallbackIcons = [
    { keywords: ["dog", "puppy", "ໝາ"], icon: "🐶" },
    { keywords: ["cat", "kitten", "ແມວ"], icon: "🐱" },
    { keywords: ["fish", "ປາ"], icon: "🐠" },
    { keywords: ["toy", "ຂອງຫຼິ້ນ"], icon: "🧸" },
    { keywords: ["food", "ອາຫານ"], icon: "🥣" },
    { keywords: ["plant", "tree", "ຕົ້ນໄມ້"], icon: "🌿" },
    { keywords: ["fashion", "ແຟຊັນ"], icon: "👕" },
    { keywords: ["health", "beauty", "ສຸຂະພາບ"], icon: "🧴" },
];

const defaultIcons = ["🛍️", "🥣", "🧸", "🐠", "🏠", "🧴", "🌿", "👕"];

function getCategoryIcon(category: Category, index: number) {
    const text = `${category.name} ${category.slug}`.toLowerCase();
    const matched = fallbackIcons.find((item) =>
        item.keywords.some((keyword) => text.includes(keyword.toLowerCase())),
    );

    return matched?.icon ?? defaultIcons[index % defaultIcons.length];
}

function CategorySkeleton() {
    return (
        <div className="h-20 w-28 shrink-0 animate-pulse rounded-xl border border-red-50 bg-white" />
    );
}

export function HomePopularCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadCategories() {
            try {
                const response = await api.categories();

                if (isMounted) {
                    setCategories((response.data ?? []).filter((item) => item.isActive));
                }
            } catch {
                if (isMounted) {
                    setCategories([]);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadCategories();

        return () => {
            isMounted = false;
        };
    }, []);

    const visibleCategories = useMemo(() => categories.slice(0, 8), [categories]);

    if (!isLoading && visibleCategories.length === 0) {
        return null;
    }

    return (
        <section id="categories" className="mx-auto mt-7 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-sm font-black text-shop-text md:text-base">
                    ໝວດໝູ່ສິນຄ້າ
                </h2>
                <a
                    href="#products"
                    className="inline-flex items-center gap-1 text-xs font-black text-shop-primary transition hover:text-shop-secondary"
                >
                    ດູທັງໝົດ
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
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

            <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="grid auto-cols-[calc((100%-36px)/4)] grid-flow-col items-stretch gap-3 sm:flex sm:min-w-max">
                    {isLoading
                        ? [1, 2, 3, 4, 5, 6].map((item) => (
                              <CategorySkeleton key={item} />
                          ))
                        : visibleCategories.map((category, index) => (
                              <button
                                  key={category.id}
                                  type="button"
                                  className="group flex h-20 min-w-0 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-red-50 bg-white px-2 text-center shadow-[0_6px_18px_rgba(51,51,51,0.035)] transition hover:-translate-y-0.5 hover:border-red-100 hover:shadow-[0_10px_22px_rgba(229,57,53,0.08)] sm:w-28 sm:px-3"
                              >
                                  {category.iconUrl ? (
                                      <img
                                          src={category.iconUrl}
                                          alt=""
                                          className="h-9 w-9 rounded-full object-cover"
                                      />
                                  ) : (
                                      <span className="text-3xl leading-none">
                                          {getCategoryIcon(category, index)}
                                      </span>
                                  )}
                                  <span className="line-clamp-1 text-xs font-black leading-4 text-shop-text group-hover:text-shop-primary">
                                      {category.name}
                                  </span>
                              </button>
                          ))}
                </div>
            </div>
        </section>
    );
}
