import { CircleIcon, GridIcon, HomeIcon } from "./header/icons";

type MobileBottomNavProps = {
    activePage?: "home" | "products" | "orders" | "account";
};

const bottomItems = [
    { key: "home", label: "ໜ້າຫຼັກ", href: "#home", icon: <HomeIcon /> },
    { key: "products", label: "ສິນຄ້າ", href: "#products", icon: <GridIcon /> },
    { key: "orders", label: "ຄຳສັ່ງຊື້", href: "#orders", icon: <CircleIcon type="cart" /> },
    { key: "account", label: "ບັນຊີ", href: "#/login", icon: <CircleIcon type="user" /> },
] as const;

export function MobileBottomNav({ activePage = "home" }: MobileBottomNavProps) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-red-100 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(51,51,51,0.08)] backdrop-blur md:hidden">
            <div className="mx-auto grid h-16 max-w-md grid-cols-4">
                {bottomItems.map((item) => {
                    const isActive = item.key === activePage;

                    return (
                        <a
                            key={item.key}
                            href={item.href}
                            className={`flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
                                isActive
                                    ? "text-shop-primary"
                                    : "text-gray-500 hover:text-shop-primary"
                            }`}
                        >
                            <span className="grid h-6 w-6 place-items-center">
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </a>
                    );
                })}
            </div>
        </nav>
    );
}
