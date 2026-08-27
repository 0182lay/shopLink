import { GridIcon, HomeIcon } from "./icons";

type HeaderNavProps = {
    activePage?: "home" | "products" | "stores" | "orders" | "account";
};

function StoreIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M5 10h14l-1-5H6zM7 10v9h10v-9M9 14h6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function OrderIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path
                d="M7 4h10v16l-2-1-2 1-2-1-2 1-2-1zM9 8h6M9 12h6M9 16h4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
            />
        </svg>
    );
}

const navItems = [
    { key: "home", label: "ໜ້າຫຼັກ", href: "#home", icon: <HomeIcon /> },
    { key: "products", label: "ສິນຄ້າ", href: "#/products", icon: <GridIcon /> },
    { key: "stores", label: "ຮ້ານຄ້າ", href: "#/stores", icon: <StoreIcon /> },
    { key: "orders", label: "ຄຳສັ່ງຊື້", href: "#/orders", icon: <OrderIcon /> },
] as const;

export function HeaderNav({ activePage = "home" }: HeaderNavProps) {
    return (
        <nav className="flex h-10 items-center justify-center gap-10 overflow-x-auto text-sm font-semibold">
            {navItems.map((item) => {
                const isActive = item.key === activePage;

                return (
                    <a
                        key={item.key}
                        href={item.href}
                        className={`relative flex h-full min-w-20 shrink-0 items-center justify-center gap-1 px-1 transition after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-12 after:-translate-x-1/2 after:rounded-full after:content-[''] ${
                            isActive
                                ? "text-shop-primary after:bg-shop-primary"
                                : "text-shop-text after:bg-transparent hover:text-shop-primary"
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </a>
                );
            })}
        </nav>
    );
}
