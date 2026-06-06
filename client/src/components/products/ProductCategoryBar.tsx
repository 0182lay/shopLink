import type { Category } from "../../lib/api";

type ProductCategoryBarProps = {
    categories: Category[];
    selectedCategoryId: number | "all";
    onSelectCategory: (categoryId: number | "all") => void;
};

const fallbackIcons = ["💻", "👕", "🏠", "🧸", "🐟", "🌿", "🐶", "🛍️"];

function categoryButtonClass(isActive: boolean) {
    return `group flex h-10 min-w-max shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-center shadow-[0_6px_16px_rgba(51,51,51,0.035)] transition hover:-translate-y-0.5 md:h-11 md:hover:translate-y-0 ${
        isActive
            ? "border-shop-primary bg-shop-primary text-white shadow-[0_10px_22px_rgba(229,57,53,0.16)]"
            : "border-red-100 bg-white text-shop-text hover:border-shop-primary hover:text-shop-primary"
    }`;
}

function categoryIconClass(isActive: boolean) {
    return `grid h-5 w-5 place-items-center overflow-hidden rounded-full text-base transition ${
        isActive ? "text-white" : "text-shop-text group-hover:text-shop-primary"
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
                <button
                    type="button"
                    onClick={() => onSelectCategory("all")}
                    className={categoryButtonClass(selectedCategoryId === "all")}
                >
                    <span className={categoryIconClass(selectedCategoryId === "all")}>
                        🛍️
                    </span>
                    <span className="line-clamp-1 text-xs font-black md:text-sm">
                        ທັງໝົດ
                    </span>
                </button>

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
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span>{fallbackIcons[index % fallbackIcons.length]}</span>
                                )}
                            </span>
                            <span
                                className={`line-clamp-1 text-xs font-black md:text-sm ${
                                    isActive
                                        ? "text-white"
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
