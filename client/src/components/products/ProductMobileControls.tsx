import type { Store } from "../../types/store";

type SortMode = "recommended" | "price-low" | "price-high";

type ProductMobileControlsProps = {
    stores: Store[];
    selectedStoreId: number | "all";
    sort: SortMode;
    onSelectStore: (storeId: number | "all") => void;
    onSortChange: (sort: SortMode) => void;
};

export function ProductMobileControls({
    stores,
    selectedStoreId,
    sort,
    onSelectStore,
    onSortChange,
}: ProductMobileControlsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 lg:hidden">
            <label className="relative min-w-0">
                <span className="sr-only">ຮ້ານຄ້າ</span>
                <select
                    value={selectedStoreId}
                    onChange={(event) => {
                        const value = event.target.value;
                        onSelectStore(value === "all" ? "all" : Number(value));
                    }}
                    className="h-11 w-full rounded-xl border border-red-100 bg-white px-3 pl-9 text-xs font-black text-shop-text shadow-sm outline-none transition focus:border-shop-primary"
                >
                    <option value="all">ຮ້ານຄ້າ: ທຸກຮ້ານ</option>
                    {stores.map((store) => (
                        <option key={store.id} value={store.id}>
                            {store.name}
                        </option>
                    ))}
                </select>
                <svg
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-shop-text"
                    aria-hidden="true"
                >
                    <path
                        d="M4 7h16M7 12h10M10 17h4"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                    />
                </svg>
            </label>

            <label className="relative min-w-0">
                <span className="sr-only">ຈັດຮຽງສິນຄ້າ</span>
                <select
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value as SortMode)}
                    className="h-11 w-full rounded-xl border border-red-100 bg-white px-3 text-xs font-black text-shop-text shadow-sm outline-none transition focus:border-shop-primary"
                >
                    <option value="recommended">ຮຽງຕາມ: ແນະນຳ</option>
                    <option value="price-low">ລາຄາ: ຕ່ຳ-ສູງ</option>
                    <option value="price-high">ລາຄາ: ສູງ-ຕ່ຳ</option>
                </select>
            </label>
        </div>
    );
}
