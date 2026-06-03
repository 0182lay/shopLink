import { BagIcon } from "../home/header/icons";

export function AuthLogo() {
    return (
        <a
            href="#home"
            className="inline-flex items-center gap-2 text-xl font-black text-shop-primary"
            aria-label="RubyStores home"
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
