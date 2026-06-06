import { CircleIcon, GridIcon, HomeIcon } from "./header/icons";

type MobileBottomNavProps = {
    activePage?: "home" | "products" | "stores" | "orders" | "account";
};

function StoreIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M5 10h14l-1-5H6zM7 10v9h10v-9M9 14h6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

function OrderIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M7 4h10v17l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2zM9 8h6M9 12h6M9 16h4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

const bottomItems = [
    { key: "home", label: "ໜ້າຫຼັກ", href: "#home", icon: <HomeIcon /> },
    { key: "products", label: "ສິນຄ້າ", href: "#/products", icon: <GridIcon /> },
    { key: "stores", label: "ຮ້ານຄ້າ", href: "#/stores", icon: <StoreIcon /> },
    {
        key: "orders",
        label: "ອໍເດີ",
        href: "#orders",
        icon: <OrderIcon />,
        badge: 3,
    },
    {
        key: "account",
        label: "ບັນຊີ",
        href: "#/login",
        icon: <CircleIcon type="user" />,
    },
] as const;

export function MobileBottomNav({ activePage = "home" }: MobileBottomNavProps) {
    return (
        <nav
            className="fixed inset-x-3 bottom-2 z-[120] rounded-[24px] border border-red-100/70 bg-white/95 px-1.5 shadow-[0_10px_30px_rgba(51,51,51,0.12)] backdrop-blur md:hidden"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 6px)" }}
        >
            <div className="mx-auto grid h-[55px] max-w-md grid-cols-5 items-center">
                {bottomItems.map((item) => {
                    const isActive = item.key === activePage;

                    return (
                        <a
                            key={item.key}
                            href={item.href}
                            className={`relative mx-0.5 flex h-[50px] flex-col items-center justify-center gap-0.5 rounded-[20px] text-[10px] font-bold transition ${
                                isActive
                                    ? "bg-shop-light text-shop-primary shadow-[0_8px_20px_rgba(229,57,53,0.10)]"
                                    : "text-gray-500 hover:text-shop-primary"
                            }`}
                        >
                            <span className="relative grid h-4 w-6 place-items-center">
                                {item.icon}
                                {"badge" in item ? (
                                    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-shop-primary px-1 text-[9px] font-black leading-none text-white shadow-sm">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </span>
                            <span>{item.label}</span>
                            {isActive ? (
                                <span className="absolute bottom-1.5 h-0.5 w-6 rounded-full bg-shop-primary" />
                            ) : null}
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
