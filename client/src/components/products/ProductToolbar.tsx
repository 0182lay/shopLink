type ProductToolbarProps = {
    count: number;
    sort: "recommended" | "price-low" | "price-high";
    onSortChange: (sort: "recommended" | "price-low" | "price-high") => void;
};

export function ProductToolbar({ count, sort, onSortChange }: ProductToolbarProps) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
                <h1 className="text-2xl font-black text-shop-text md:text-3xl">
                    ສິນຄ້າທັງໝົດ
                </h1>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                    ພົບສິນຄ້າທັງໝົດ {count} ລາຍການ
                </p>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
                <label htmlFor="product-sort" className="sr-only">
                    ຈັດຮຽງສິນຄ້າ
                </label>
                <select
                    id="product-sort"
                    value={sort}
                    onChange={(event) =>
                        onSortChange(event.target.value as ProductToolbarProps["sort"])
                    }
                    className="h-10 rounded-xl border border-red-100 bg-white px-4 text-sm font-bold text-shop-text shadow-sm outline-none transition focus:border-shop-primary"
                >
                    <option value="recommended">ຮຽງຕາມ: ແນະນຳ</option>
                    <option value="price-low">ລາຄາ: ຕ່ຳ ຫາ ສູງ</option>
                    <option value="price-high">ລາຄາ: ສູງ ຫາ ຕ່ຳ</option>
                </select>
            </div>
        </div>
    );
}
