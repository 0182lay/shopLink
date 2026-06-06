import type { Store } from "../../types/store";

type SortMode = "recommended" | "price-low" | "price-high";

type ProductMobileControlsProps = {
    stores: Store[];
    selectedStoreId: number | "all";
    sort: SortMode;
    onSelectStore: (storeId: number | "all") => void;
    onSortChange: (sort: SortMode) => void;
};

function SelectChevron() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="m7 10 5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

export function ProductMobileControls({
    stores,
    selectedStoreId,
    sort,
    onSelectStore,
    onSortChange,
}: ProductMobileControlsProps) {
    return (
        <div className="grid grid-cols-2 items-center gap-3 lg:hidden">
            <label className="relative min-w-0">
                <span className="sr-only">ຕົວກອງຮ້ານຄ້າ</span>
                <select
                    value={selectedStoreId}
                    onChange={(event) => {
                        const value = event.target.value;
                        onSelectStore(value === "all" ? "all" : Number(value));
                    }}
                    className="h-10 w-full appearance-none rounded-xl border border-red-100 bg-white px-10 text-xs font-black text-shop-text shadow-[0_8px_18px_rgba(51,51,51,0.045)] outline-none transition focus:border-shop-primary"
                >
                    <option value="all">ຕົວກອງ</option>
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
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <SelectChevron />
                </span>
            </label>

            <label className="relative min-w-0">
                <span className="sr-only">ຈັດຮຽງສິນຄ້າ</span>
                <select
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value as SortMode)}
                    className="h-10 w-full appearance-none rounded-xl border border-red-100 bg-white px-10 text-xs font-black text-shop-text shadow-[0_8px_18px_rgba(51,51,51,0.045)] outline-none transition focus:border-shop-primary"
                >
                    <option value="recommended">ຍອດນິຍົມ</option>
                    <option value="price-low">ລາຄາຕ່ຳກ່ອນ</option>
                    <option value="price-high">ລາຄາສູງກ່ອນ</option>
                </select>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-shop-text">
                    ↕
                </span>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    <SelectChevron />
                </span>
            </label>
        </div>
    );
}
