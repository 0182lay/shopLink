import { BagIcon } from "./icons";

export function HeaderLogo() {
    return (
        <a
            href="#home"
            className="flex shrink-0 items-center gap-2 text-xl font-black text-shop-primary"
            aria-label="ShopLink home"
        >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-shop-primary text-white shadow-sm">
                <BagIcon />
            </span>
            <span>
                Ruby<span className="text-shop-text">Stores</span>
            </span>
        </a>
    );
}
