import { SearchIcon } from "./icons";

type HeaderSearchProps = {
    id: string;
    compact?: boolean;
};

export function HeaderSearch({ id, compact = false }: HeaderSearchProps) {
    return (
        <form
            className={`flex overflow-hidden rounded-md border border-red-100 bg-white shadow-sm ${
                compact ? "w-full" : "w-full max-w-2xl"
            }`}
        >
            <label htmlFor={id} className="sr-only">
                ຄົ້ນຫາສິນຄ້າ
            </label>
            <input
                id={id}
                className="h-10 min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-gray-400"
                placeholder="ຄົ້ນຫາສິນຄ້າ..."
                type="search"
            />
            <button
                type="submit"
                className="grid h-10 w-14 place-items-center bg-shop-primary text-white transition hover:bg-shop-secondary"
                aria-label="ຄົ້ນຫາ"
            >
                <SearchIcon />
            </button>
        </form>
    );
}
