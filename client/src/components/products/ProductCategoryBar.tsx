import type { Category } from "../../lib/api";

type ProductCategoryBarProps = {
    categories: Category[];
    selectedCategoryId: number | "all";
    onSelectCategory: (categoryId: number | "all") => void;
};

const fallbackIcons = ["🛍️", "🥣", "🧸", "🐠", "🌿", "👕", "🧴", "🐶"];

function categoryButtonClass(isActive: boolean) {
    return `group flex h-24 w-[calc((100vw-68px)/4)] min-w-20 max-w-28 shrink-0 flex-col items-center justify-center gap-2 rounded-xl border bg-white px-2 text-center shadow-[0_6px_18px_rgba(51,51,51,0.035)] transition hover:-translate-y-0.5 sm:h-11 sm:w-auto sm:max-w-none sm:flex-row sm:gap-2 sm:px-4 sm:text-sm sm:hover:translate-y-0 ${
        isActive
            ? "border-shop-primary text-shop-primary sm:bg-shop-primary sm:text-white sm:shadow-[0_6px_14px_rgba(229,57,53,0.14)]"
            : "border-red-50 text-shop-text hover:border-red-100 hover:text-shop-primary sm:border-red-100 sm:hover:border-shop-primary"
    }`;
}

function categoryIconClass(isActive: boolean) {
    return `grid h-12 w-12 place-items-center overflow-hidden rounded-full text-3xl transition sm:h-auto sm:w-auto sm:text-sm ${
        isActive ? "text-shop-primary sm:text-white" : "text-shop-text group-hover:text-shop-primary"
    }`;
}

export function ProductCategoryBar({
    categories,
    selectedCategoryId,
    onSelectCategory,
}: ProductCategoryBarProps) {
    return (
        <div className="overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max items-center gap-3">
                {categories.map((category, index) => {
                    const isActive = selectedCategoryId === category.id;

                    return (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => onSelectCategory(category.id)}
                            className={categoryButtonClass(isActive)}
                        >
                            <span className={categoryIconClass(isActive)}>
                                {category.iconUrl ? (
                                    <img
                                        src={category.iconUrl}
                                        alt=""
                                        className="h-full w-full object-cover sm:h-6 sm:w-6 sm:rounded-full"
                                    />
                                ) : (
                                    <span>{fallbackIcons[index % fallbackIcons.length]}</span>
                                )}
                            </span>
                            <span
                                className={`line-clamp-1 text-[11px] font-black sm:text-sm ${
                                    isActive
                                        ? "text-shop-primary sm:text-white"
                                        : "text-shop-text group-hover:text-shop-primary"
                                }`}
                            >
                                {category.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
