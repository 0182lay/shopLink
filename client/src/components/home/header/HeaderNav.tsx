import { CircleIcon, GridIcon, HomeIcon } from "./icons";

type HeaderNavProps = {
    activePage?: "home" | "products" | "orders";
};

const navItems = [
    { key: "home", label: "ໜ້າຫຼັກ", href: "#home", icon: <HomeIcon /> },
    { key: "products", label: "ສິນຄ້າທັງໝົດ", href: "#products", icon: <GridIcon /> },
    { key: "orders", label: "ຄຳສັ່ງຊື້", href: "#orders", icon: <CircleIcon type="cart" /> },
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
