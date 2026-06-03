import type { Store } from "../../types/store";

type ProductFilterSidebarProps = {
    stores: Store[];
    selectedStoreId: number | "all";
    onSelectStore: (storeId: number | "all") => void;
};

export function ProductFilterSidebar({
    stores,
    selectedStoreId,
    onSelectStore,
}: ProductFilterSidebarProps) {
    return (
        <aside className="hidden w-64 shrink-0 rounded-2xl border border-red-50 bg-white p-5 shadow-[0_12px_30px_rgba(51,51,51,0.04)] lg:block">
            <h2 className="text-base font-black text-shop-text">ຮ້ານຄ້າ</h2>

            <div className="mt-5 border-t border-gray-100 pt-5">
                <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600">
                        <input
                            type="radio"
                            checked={selectedStoreId === "all"}
                            onChange={() => onSelectStore("all")}
                            className="accent-shop-primary"
                        />
                        ທຸກຮ້ານ
                    </label>
                    {stores.map((store) => (
                        <label
                            key={store.id}
                            className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-600"
                        >
                            <input
                                type="radio"
                                checked={selectedStoreId === store.id}
                                onChange={() => onSelectStore(store.id)}
                                className="accent-shop-primary"
                            />
                            {store.name}
                        </label>
                    ))}
                </div>
            </div>
        </aside>
    );
}
