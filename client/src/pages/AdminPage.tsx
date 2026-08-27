import { useEffect, useMemo, useState } from "react";
import { api, type Category, type Product, type BackendOrder } from "../lib/api";
import type { Store } from "../types/store";
import { logout } from "../lib/auth";
import { adminDemoData } from "../lib/demoData";

type AdminSection =
    | "dashboard"
    | "orders"
    | "products"
    | "stores"
    | "categories"
    | "users"
    | "settings"
    | "more";

type AdminPageProps = {
    section: AdminSection;
};

type LoadState = {
    categories: Category[];
    products: Product[];
    stores: Store[];
    orders: BackendOrder[];
    error: string;
    isLoading: boolean;
    isDemo: boolean;
};

const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(Number(price));

const formatOrderDate = (dateString: string) => {
    try {
        return new Intl.DateTimeFormat("lo-LA", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(new Date(dateString)) + " ໂມງ";
    } catch {
        return dateString;
    }
};

const sectionMeta: Record<AdminSection, { label: string; description: string }> = {
    dashboard: {
        label: "ໜ້າພາບລວມ",
        description: "ພາບລວມສະຖິຕິກຳໄລ ຍອດຂາຍ ອໍເດີ ແລະ ສິນຄ້າຂອງລະບົບ",
    },
    orders: {
        label: "ຄຳສັ່ງຊື້",
        description: "ກວດສອບຄຳສັ່ງຊື້ທັງໝົດຂອງລູກຄ້າ ແລະ ຈັດການຂັ້ນຕອນການຈັດສົ່ງ",
    },
    products: {
        label: "ສິນຄ້າ",
        description: "ຈັດການລາຍການສິນຄ້າ ສາງສິນຄ້າ ລາຄາ ແລະ ປະເພດສິນຄ້າ",
    },
    stores: {
        label: "ຮ້ານຄ້າ",
        description: "ຈັດການໜ້າຮ້ານຄ້າ ໂລໂກ້ ແບນເນີ ແລະ ສິດການເປີດຮ້ານ",
    },
    categories: {
        label: "ໝວດໝູ່",
        description: "ຈັດການໝວດໝູ່ສິນຄ້າໃນແຕ່ລະຮ້ານຄ້າ",
    },
    users: {
        label: "ລູກຄ້າ",
        description: "ກວດສອບບັນຊີຜູ້ໃຊ້ງານ ລູກຄ້າ ແລະ ສິດຜູ້ດູແລລະບົບ",
    },
    settings: {
        label: "ຕັ້ງຄ່າ",
        description: "ກຳນົດຊ່ອງທາງການຕິດຕໍ່ ຄ່າຈັດສົ່ງ ແລະ ຂໍ້ມູນຫຼັງບ້ານ",
    },
    more: {
        label: "ເມນູອື່ນໆ",
        description: "ໜ້າຫຼັກເມນູການຈັດການລະບົບເທິງມືຖື",
    },
};

const navItems: Array<{ key: AdminSection; label: string; icon: string }> = [
    { key: "dashboard", label: "Dashboard", icon: "M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6z M4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" },
    { key: "orders", label: "Orders", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 11h6M9 15h4" },
    { key: "products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { key: "categories", label: "Categories", icon: "M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6z M4 14a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z M14 14a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2z" },
    { key: "stores", label: "Stores", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
    { key: "users", label: "Customers", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" },
    { key: "settings", label: "Settings", icon: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" },
];

const mobileNavTabs: Array<{ key: AdminSection; label: string; icon: string }> = [
    { key: "dashboard", label: "ໜ້າພາບລວມ", icon: "M4 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z M14 6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2V6z M4 16a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z" },
    { key: "orders", label: "ຄຳສັ່ງຊື້", icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 M9 11h6M9 15h4" },
    { key: "products", label: "ສິນຄ້າ", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { key: "more", label: "ເມນູອື່ນໆ", icon: "M4 6h16M4 12h16M4 18h16" },
];

const sampleUsers = [
    { id: 1, name: "laylay", email: "laylay@example.com", role: "customer", orders: 3, status: "Active" },
    { id: 2, name: "Ruby Admin", email: "admin@rubystores.local", role: "admin", orders: 0, status: "Active" },
    { id: 3, name: "Demo Buyer", email: "buyer@example.com", role: "customer", orders: 1, status: "Review" },
];

function SvgIcon({ path, className = "h-5 w-5" }: { path: string; className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={path} />
        </svg>
    );
}

function StatusBadge({
    tone,
    children,
}: {
    tone: "green" | "red" | "amber" | "gray" | "blue";
    children: React.ReactNode;
}) {
    const toneClass = {
        green: "bg-[#e6f7ed] text-[#0fa958]",
        red: "bg-red-50 text-shop-primary",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        gray: "bg-gray-100 text-gray-500",
    }[tone];

    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-black ${toneClass}`}>
            {children}
        </span>
    );
}

function Modal({
    title,
    onClose,
    children,
}: {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={onClose} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl transition-all flex flex-col max-h-[85vh] animate-scale-up">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <h3 className="text-base font-black text-shop-text">{title}</h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-shop-primary transition cursor-pointer"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 flex-1 overflow-y-auto pr-1">{children}</div>
            </div>
        </div>
    );
}

function AdminShell({
    children,
    section,
}: {
    children: React.ReactNode;
    section: AdminSection;
}) {
    const meta = sectionMeta[section];

    const handleLogout = () => {
        logout();
        window.location.assign("#home");
    };

    return (
        <main className="min-h-screen bg-[#f8f9fc] text-shop-text pb-24 lg:pb-0">
            {/* Desktop Left Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-100 bg-white px-5 py-6 lg:flex lg:flex-col lg:justify-between">
                <div>
                    <a href="#/admin" className="flex items-center gap-3 px-1">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-shop-primary text-white shadow-[0_8px_20px_rgba(229,57,53,0.2)]">
                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </span>
                        <span className="text-lg font-black tracking-tight">
                            Ruby<span className="text-shop-primary">Stores</span>
                        </span>
                    </a>

                    <p className="mt-6 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        RubyStores Admin
                    </p>

                    <nav className="mt-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = item.key === section;

                            return (
                                <a
                                    key={item.key}
                                    href={item.key === "dashboard" ? "#/admin" : `#/admin/${item.key}`}
                                    className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-bold transition ${
                                        isActive
                                            ? "bg-red-50 text-shop-primary"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-shop-primary"
                                    }`}
                                >
                                    <SvgIcon path={item.icon} className="h-4.5 w-4.5" />
                                    <span>{sectionMeta[item.key].label}</span>
                                </a>
                            );
                        })}
                        <button
                            onClick={handleLogout}
                            className="w-full flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-black text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer mt-2"
                        >
                            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                            </svg>
                            <span>ອອກຈາກລະບົບ</span>
                        </button>
                    </nav>
                </div>

                {/* Sidebar Bottom Mascot Info */}
                <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 text-center relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 h-20 w-20 rounded-full bg-red-100/30" />
                    <div className="flex justify-center gap-2 mb-2">
                        {/* Cute Cat & Dog Emoji representations */}
                        <span className="text-2xl">🐱</span>
                        <span className="text-2xl">🐶</span>
                    </div>
                    <p className="text-xs font-black text-shop-text">RubyStores</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">Version 1.0.0</p>
                </div>
            </aside>

            {/* Main Area */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/90 px-4 py-3.5 backdrop-blur-md lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-shop-primary">
                                RubyStores Admin
                            </p>
                            <h1 className="truncate text-xl lg:text-2xl font-black text-shop-text">
                                {meta.label}
                            </h1>
                        </div>

                        {/* Search and Admin Info */}
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <input
                                    type="text"
                                    placeholder="ຄົ້ນຫາອໍເດີ, ສິນຄ້າ, ລູກຄ້າ..."
                                    className="h-10 w-64 rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-xs font-semibold outline-none focus:border-shop-primary focus:bg-white transition"
                                />
                                <svg viewBox="0 0 24 24" className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>

                            {/* Notification with Badge */}
                            <button className="relative h-10 w-10 rounded-full hover:bg-gray-50 flex items-center justify-center text-gray-600 transition cursor-pointer">
                                <svg viewBox="0 0 24 24" className="h-5.5 w-5.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
                                </svg>
                                <span className="absolute top-1 right-1 h-4 w-4 bg-shop-primary text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm border border-white">
                                    8
                                </span>
                            </button>

                            {/* User Avatar Info */}
                            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
                                <span className="grid h-8 w-8 place-items-center rounded-full bg-shop-light text-xs font-black text-shop-primary">
                                    A
                                </span>
                                <div className="hidden lg:block text-left">
                                    <p className="text-xs font-black leading-none">Admin</p>
                                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">ຮ້ານ Pet Shop</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Section Content */}
                <section className="mx-auto max-w-7xl px-4 py-5 lg:px-8 lg:py-6">
                    {children}
                </section>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="fixed bottom-0 inset-x-0 z-40 h-16 border-t border-gray-100 bg-white/95 backdrop-blur-md px-3 flex items-center justify-around lg:hidden shadow-lg">
                {mobileNavTabs.map((item) => {
                    const isActive = item.key === section || (item.key === "more" && (section === "stores" || section === "categories" || section === "users" || section === "settings"));

                    return (
                        <a
                            key={item.key}
                            href={
                                item.key === "dashboard"
                                    ? "#/admin"
                                    : item.key === "more"
                                    ? "#/admin/more"
                                    : `#/admin/${item.key}`
                            }
                            className={`flex flex-col items-center justify-center gap-1 transition ${
                                isActive ? "text-shop-primary" : "text-gray-400 hover:text-gray-600"
                            }`}
                        >
                            <SvgIcon path={item.icon} className="h-5 w-5" />
                            <span className="text-[9px] font-black leading-none">{item.label}</span>
                        </a>
                    );
                })}
            </nav>
        </main>
    );
}

function MetricCard({
    label,
    value,
    detail,
    tone = "red",
    chartColor = "#E53935",
    sparklinePath = "M0 15 Q15 5, 30 12 T60 3 T85 17 T100 8",
}: {
    label: string;
    value: string;
    detail: string;
    tone?: "red" | "green" | "amber" | "gray" | "blue";
    chartColor?: string;
    sparklinePath?: string;
}) {
    const color = {
        red: "bg-gray-50 text-shop-primary border border-red-100/50",
        green: "bg-gray-50 text-green-600 border border-green-100/50",
        amber: "bg-gray-50 text-amber-600 border border-amber-100/50",
        blue: "bg-gray-50 text-blue-600 border border-blue-100/50",
        gray: "bg-gray-50 text-gray-500 border border-gray-150",
    }[tone];

    return (
        <article className="rounded-2xl border border-gray-100 bg-white p-4.5 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex items-start justify-between gap-2">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        {label}
                    </p>
                    <p className="mt-1 text-xl sm:text-2xl font-black text-shop-text">{value}</p>
                    <p className="text-[10px] font-bold text-gray-500">{detail}</p>
                </div>
                <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${color}`}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                </span>
            </div>

            {/* Sparkline chart at the bottom */}
            <div className="h-6 w-full -mb-1">
                <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none" fill="none">
                    <path
                        d={sparklinePath}
                        stroke={chartColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </article>
    );
}

function Panel({
    title,
    action,
    children,
}: {
    title: string;
    action?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white shadow-xs">
            <div className="flex items-center justify-between gap-4 border-b border-gray-50 px-4.5 py-4">
                <h2 className="text-sm sm:text-base font-black text-shop-text">{title}</h2>
                {action}
            </div>
            {children}
        </section>
    );
}

function EmptyNotice({ text }: { text: string }) {
    return (
        <div className="px-5 py-10 text-center text-xs sm:text-sm font-semibold text-gray-400">
            {text}
        </div>
    );
}

function DashboardView({
    products,
    orders,
}: Pick<LoadState, "products" | "orders">) {
    const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
    
    const lowStock = products.filter((product) => product.stock <= 5);
    const pendingOrdersCount = orders.filter((order) => order.status === "PENDING").length;
    const shippingCount = orders.filter((order) => order.status === "SHIPPING" || order.status === "CONFIRMED").length;

    const statusTranslations: Record<BackendOrder["status"], { label: string; tone: "green" | "red" | "amber" | "gray" | "blue" }> = {
        PENDING: { label: "ລໍຢືນຢັນ", tone: "amber" },
        CONFIRMED: { label: "ກຳລັງແພັກ", tone: "blue" },
        SHIPPING: { label: "ຈັດສົ່ງແລ້ວ", tone: "blue" },
        COMPLETED: { label: "ຈັດສົ່ງສຳເລັດ", tone: "green" },
        CANCELLED: { label: "ຍົກເລີກ", tone: "red" },
    };

    // Calculate last 7 days sales dynamically
    const salesByDay = useMemo(() => {
        const days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return {
                dateString: date.toLocaleDateString("lo-LA", { day: "numeric", month: "short" }),
                key: date.toDateString(),
                sales: 0,
            };
        });

        orders.forEach((order) => {
            const orderDateStr = new Date(order.createdAt).toDateString();
            const day = days.find((d) => d.key === orderDateStr);
            if (day) {
                day.sales += Number(order.totalPrice);
            }
        });

        return days;
    }, [orders]);

    const maxSales = useMemo(() => {
        const max = Math.max(...salesByDay.map((d) => d.sales));
        return max > 0 ? max : 10000000; // default to 10M LAK if zero
    }, [salesByDay]);

    const chartPoints = useMemo(() => {
        return salesByDay.map((d, index) => {
            const x = 5 + index * 15;
            const y = 80 - (d.sales / maxSales) * 60; // normalize
            return { x, y, sales: d.sales, dateString: d.dateString };
        });
    }, [salesByDay, maxSales]);

    const chartPath = useMemo(() => {
        if (chartPoints.length === 0) return "";
        return `M ${chartPoints[0].x} ${chartPoints[0].y} ` + 
            chartPoints.slice(1).map((p) => `L ${p.x} ${p.y}`).join(" ");
    }, [chartPoints]);

    const chartFillPath = useMemo(() => {
        if (chartPoints.length === 0) return "";
        return `${chartPath} L 95 100 L 5 100 Z`;
    }, [chartPoints, chartPath]);

    return (
        <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div>
                <h2 className="text-xs sm:text-sm font-black text-gray-400 uppercase tracking-wider mb-3">ພາບລວມມື້ນີ້</h2>
                <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        label="ຍອດຂາຍມື້ນີ້"
                        value="12,450,000 LAK"
                        detail="↑ 18.5% ຈາກມື້ວານ"
                        tone="red"
                        chartColor="#E53935"
                        sparklinePath="M0 15 Q15 5, 30 12 T60 3 T85 17 T100 8"
                    />
                    <MetricCard
                        label="ຈຳນວນອໍເດີ"
                        value="58 ລາຍການ"
                        detail="↑ 12.3% ຈາກມື້ວານ"
                        tone="amber"
                        chartColor="#F59E0B"
                        sparklinePath="M0 18 C10 10, 20 8, 30 14 C45 6, 55 12, 70 8 S85 18, 100 5"
                    />
                    <MetricCard
                        label="ສິນຄ້າທັງໝົດ"
                        value={`${products.length} ລາຍການ`}
                        detail={`${lowStock.length} ສິນຄ້າໃກ້ໝົດສະຕັອກ`}
                        tone="green"
                        chartColor="#10B981"
                        sparklinePath="M0 10 L15 12 L30 8 L45 10 L60 6 L75 9 L90 5 L100 7"
                    />
                    <MetricCard
                        label="ລູກຄ້າທັງໝົດ"
                        value="932 ຄົນ"
                        detail="↑ 15.1% ຈາກມື້ວານ"
                        tone="blue"
                        chartColor="#3B82F6"
                        sparklinePath="M0 18 Q20 12, 40 16 T80 8 T100 4"
                    />
                </div>
            </div>

            {/* Main Sections Row */}
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                {/* Alert Feed */}
                <Panel title="ແຈ້ງເຕືອນທີ່ຕ້ອງຈັດການ">
                    <div className="divide-y divide-gray-50 px-2.5 pb-2">
                        <a href="#/admin/products" className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition group">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-600">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs sm:text-sm font-black text-shop-text">ສິນຄ້າໃກ້ໝົດສະຕັອກ</p>
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">{lowStock.length} ລາຍການ</p>
                                </div>
                            </div>
                            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-gray-400 group-hover:text-shop-primary transition" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>

                        <a href="#/admin/orders" className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition group">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-shop-primary">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs sm:text-sm font-black text-shop-text">ອໍເດີລໍຢືນຢັນ</p>
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">{pendingOrdersCount} ລາຍການ</p>
                                </div>
                            </div>
                            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-gray-400 group-hover:text-shop-primary transition" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>

                        <a href="#/admin/orders" className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-xl transition group">
                            <div className="flex items-center gap-3">
                                <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                        <rect x="1" y="3" width="15" height="13" />
                                        <polygon points="16 8 20 8 23 11 23 16 16 16" />
                                    </svg>
                                </span>
                                <div>
                                    <p className="text-xs sm:text-sm font-black text-shop-text">ອໍເດີຄ້າງຈັດສົ່ງ</p>
                                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">{shippingCount} ລາຍການ</p>
                                </div>
                            </div>
                            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-gray-400 group-hover:text-shop-primary transition" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>

                        <div className="pt-2 text-center">
                            <a href="#/admin/orders" className="text-xs font-black text-shop-primary hover:underline transition">ເບິ່ງທັງໝົດ</a>
                        </div>
                    </div>
                </Panel>

                {/* Recent Orders List */}
                <Panel title="ອໍເດີຫຼ້າສຸດ" action={<a href="#/admin/orders" className="text-xs font-black text-shop-primary hover:underline">ເບິ່ງທັງໝົດ</a>}>
                    {orders.length > 0 ? (
                        <div className="divide-y divide-gray-50 px-2.5 pb-2">
                            {orders.slice(0, 5).map((order) => {
                                const statusInfo = statusTranslations[order.status] || { label: order.status, tone: "gray" };
                                return (
                                    <div key={order.id} className="flex items-center justify-between gap-4 p-3.5 hover:bg-gray-50/50 rounded-xl transition">
                                        <div className="min-w-0">
                                            <p className="truncate text-xs sm:text-sm font-black text-shop-text">
                                                #RB-{String(order.id).padStart(5, "0")}
                                            </p>
                                            <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">
                                                {order.store?.name || "Pet Shop"} • {formatOrderDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs sm:text-sm font-black text-shop-text">{formatPrice(order.totalPrice)}</p>
                                            <div className="mt-1">
                                                <StatusBadge tone={statusInfo.tone}>
                                                    {statusInfo.label}
                                                </StatusBadge>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyNotice text="ຍັງບໍ່ມີຄຳສັ່ງຊື້ເຂົ້າມາໃນຂະນະນີ້" />
                    )}
                </Panel>
            </div>

            {/* Sales Chart and Best Sellers */}
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                {/* 7 Days Sales Chart */}
                <Panel title="ຍອດຂາຍ 7 ວັນຜ່ານມາ" action={
                    <select className="h-8 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-bold outline-none focus:border-shop-primary cursor-pointer">
                        <option>7 ວັນ</option>
                        <option>30 ວັນ</option>
                    </select>
                }>
                    <div className="p-4 flex flex-col justify-between h-64">
                        {/* Custom SVG Line Chart */}
                        <div className="flex-1 relative mt-2">
                            {/* Grid Y Lines */}
                            <div className="absolute inset-x-0 top-0 border-b border-dashed border-gray-100 text-[10px] font-bold text-gray-400 pt-0.5">{formatPrice(maxSales)}</div>
                            <div className="absolute inset-x-0 top-1/4 border-b border-dashed border-gray-100 text-[10px] font-bold text-gray-400 pt-0.5">{formatPrice(maxSales * 0.75)}</div>
                            <div className="absolute inset-x-0 top-2/4 border-b border-dashed border-gray-100 text-[10px] font-bold text-gray-400 pt-0.5">{formatPrice(maxSales * 0.5)}</div>
                            <div className="absolute inset-x-0 top-3/4 border-b border-dashed border-gray-100 text-[10px] font-bold text-gray-400 pt-0.5">{formatPrice(maxSales * 0.25)}</div>
                            <div className="absolute inset-x-0 bottom-0 border-b border-gray-200 text-[10px] font-bold text-gray-400">0 LAK</div>
                            
                            {/* Chart Line Path */}
                            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Fill area under chart path */}
                                <path
                                    d={chartFillPath}
                                    fill="url(#chart-gradient)"
                                    opacity="0.08"
                                />
                                {/* Red line path */}
                                <path
                                    d={chartPath}
                                    fill="none"
                                    stroke="#E53935"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {/* Definition for gradient fill */}
                                <defs>
                                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#E53935" />
                                        <stop offset="100%" stopColor="#E53935" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {/* Glowing Chart Dots */}
                            {chartPoints.map((pt, idx) => (
                                <div 
                                    key={idx}
                                    className="absolute h-2.5 w-2.5 rounded-full bg-shop-primary border border-white shadow-sm group cursor-pointer" 
                                    style={{ left: `${pt.x}%`, top: `${pt.y}%`, transform: "translate(-50%, -50%)" }}
                                >
                                    {/* Tooltip on Hover */}
                                    <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded bg-gray-950 px-2.5 py-1 text-[9px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-20">
                                        {formatPrice(pt.sales)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        {/* X Axis labels */}
                        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-gray-400 mt-2 px-1">
                            {salesByDay.map((d, i) => (
                                <span key={i}>{d.dateString}</span>
                            ))}
                        </div>
                    </div>
                </Panel>

                {/* Best Selling Products */}
                <Panel title="ສິນຄ້າຂາຍດີ" action={<a href="#/admin/products" className="text-xs font-black text-shop-primary hover:underline">ເບິ່ງທັງໝົດ</a>}>
                    <div className="divide-y divide-gray-50 px-2.5 pb-2">
                        {[
                            { id: 1, name: "Royal Canin Kitten 2kg", sales: "ຂາຍແລ້ວ 45 ອັນ", image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=120&auto=format&fit=crop&q=60" },
                            { id: 2, name: "Me-O Adult 1.1kg", sales: "ຂາຍແລ້ວ 38 ອັນ", image: "https://images.unsplash.com/photo-1608454367599-c11394b46c21?w=120&auto=format&fit=crop&q=60" },
                            { id: 3, name: "JerHigh Stick 500g", sales: "ຂາຍແລ້ວ 32 ອັນ", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=120&auto=format&fit=crop&q=60" },
                        ].map((item, index) => (
                            <div key={item.id} className="flex items-center justify-between gap-4 p-3.5 hover:bg-gray-50/50 rounded-xl transition">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className="text-xs font-black text-gray-400 w-4">{index + 1}.</span>
                                    <img src={item.image} alt="" className="h-10 w-10 rounded-lg object-cover border border-gray-100" />
                                    <div className="min-w-0">
                                        <p className="truncate text-xs sm:text-sm font-black text-shop-text">
                                            {item.name}
                                        </p>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">
                                            {item.sales}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>
            </div>

            {/* Quick Actions Bottom Sheet */}
            {isQuickActionOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
                    <div 
                        className="fixed inset-0 bg-transparent" 
                        onClick={() => setIsQuickActionOpen(false)}
                    />
                    <div className="relative z-10 w-full max-w-md rounded-t-[24px] bg-white p-5 pb-8 shadow-2xl animate-slide-up flex flex-col gap-4">
                        {/* Drag Handle on Mobile */}
                        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-1" />

                        <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                            <h3 className="text-sm font-black text-shop-text">ເມນູດ່ວນ (Quick Actions)</h3>
                            <button
                                onClick={() => setIsQuickActionOpen(false)}
                                className="rounded-full p-1.5 bg-gray-50 text-gray-400 hover:text-shop-primary transition cursor-pointer"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <a 
                                href="#/admin/products?create=true"
                                onClick={() => setIsQuickActionOpen(false)}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-shop-primary/30 text-center transition group cursor-pointer shadow-xs"
                            >
                                <span className="text-2xl mb-1.5 group-hover:scale-110 transition">🛍️</span>
                                <span className="text-xs font-bold text-shop-text">ເພີ່ມສິນຄ້າໃໝ່</span>
                            </a>
                            
                            <a 
                                href="#/admin/stores?create=true"
                                onClick={() => setIsQuickActionOpen(false)}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-shop-primary/30 text-center transition group cursor-pointer shadow-xs"
                            >
                                <span className="text-2xl mb-1.5 group-hover:scale-110 transition">🏢</span>
                                <span className="text-xs font-bold text-shop-text">ເປີດຮ້ານຄ້າໃໝ່</span>
                            </a>
                            
                            <a 
                                href="#/admin/categories?create=true"
                                onClick={() => setIsQuickActionOpen(false)}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-shop-primary/30 text-center transition group cursor-pointer shadow-xs"
                            >
                                <span className="text-2xl mb-1.5 group-hover:scale-110 transition">📁</span>
                                <span className="text-xs font-bold text-shop-text">ເພີ່ມໝວດໝູ່</span>
                            </a>
                            
                            <a 
                                href="#/admin/orders"
                                onClick={() => setIsQuickActionOpen(false)}
                                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-gray-100 hover:border-shop-primary/30 text-center transition group cursor-pointer shadow-xs"
                            >
                                <span className="text-2xl mb-1.5 group-hover:scale-110 transition">📦</span>
                                <span className="text-xs font-bold text-shop-text">ຈັດການຄຳສັ່ງຊື້</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Floating Action Button (+) */}
            <button
                onClick={() => setIsQuickActionOpen(true)}
                className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-shop-primary text-white shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition cursor-pointer"
                title="ເມນູດ່ວນ"
            >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
}

function OrdersView({ orders, onRefresh }: { orders: BackendOrder[]; onRefresh: () => void }) {
    const [statusFilter, setStatusFilter] = useState<BackendOrder["status"] | "ALL">("PENDING");
    const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
    const [updating, setUpdating] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [swipingCardId, setSwipingCardId] = useState<number | null>(null);
    const [swipeDistance, setSwipeDistance] = useState<number>(0);
    const [touchStartX, setTouchStartX] = useState<number>(0);
    
    // Quick Actions States
    const [barcodeModalOrder, setBarcodeModalOrder] = useState<BackendOrder | null>(null);
    const [scanningOrder, setScanningOrder] = useState<BackendOrder | null>(null);
    const [scanningSuccess, setScanningSuccess] = useState(false);

    // Auto trigger scanning if query param exists
    useEffect(() => {
        if (window.location.hash.includes("scan=true")) {
            const confirmedOrder = orders.find((o) => o.status === "CONFIRMED");
            if (confirmedOrder) {
                setScanningOrder(confirmedOrder);
                setScanningSuccess(false);
            } else {
                alert("ບໍ່ມີອໍເດີໃນສະຖານະ 'ກຳລັງແພັກ' ທີ່ພ້ອມໃຫ້ສະແກນໃນຂະນະນີ້");
            }
            window.history.replaceState(null, "", window.location.pathname + window.location.hash.split("?")[0]);
        }
    }, [orders]);

    const handleShareProof = (order: BackendOrder) => {
        const shareMsg = `ໃບຝາກສົ່ງພັດສະດຸສຳລັບອໍເດີ #RB-${String(order.id).padStart(5, "0")}\nຮ້ານຄ້າ: ${order.store?.name || "Pet Shop"}\nເລກແທຣັກກິ້ງ: AN-${String(order.id).padStart(5, "0")}-LA\nລິ້ງກວດສອບ: https://rubystores.la/track/AN-${order.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'ຫຼັກຖານການຈັດສົ່ງພັດສະດຸ',
                text: shareMsg,
                url: window.location.origin + '/shipping-label.png'
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareMsg);
            setToastMsg("ສຳເນົາຂໍ້ຄວາມ ແລະ ລິ້ງຫຼັກຖານພັດສະດຸຮຽບຮ້ອຍແລ້ວ!");
            setTimeout(() => setToastMsg(null), 2500);
        }
    };

    const filteredOrders = useMemo(() => {
        if (statusFilter === "ALL") return orders;
        return orders.filter((order) => order.status === statusFilter);
    }, [orders, statusFilter]);

    const statusTranslations: Record<BackendOrder["status"], { label: string; tone: "green" | "red" | "amber" | "gray" | "blue" }> = {
        PENDING: { label: "ລໍຢືນຢັນ", tone: "amber" },
        CONFIRMED: { label: "ກຳລັງແພັກ", tone: "blue" },
        SHIPPING: { label: "ຈັດສົ່ງແລ້ວ", tone: "blue" },
        COMPLETED: { label: "ຈັດສົ່ງສຳເລັດ", tone: "green" },
        CANCELLED: { label: "ຍົກເລີກ", tone: "red" },
    };

    const statusCounts = useMemo(() => {
        return {
            PENDING: orders.filter((o) => o.status === "PENDING").length,
            CONFIRMED: orders.filter((o) => o.status === "CONFIRMED").length,
            SHIPPING: orders.filter((o) => o.status === "SHIPPING" || o.status === "COMPLETED").length,
            CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
        };
    }, [orders]);

    const handleUpdateStatus = async (orderId: number, nextStatus: BackendOrder["status"]) => {
        if (updating) return;
        setUpdating(true);
        try {
            const res = await api.updateOrderStatus(orderId, nextStatus);
            if (res.success && res.data) {
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder(res.data);
                }
                setToastMsg(`ອັບເດດສະຖານະອໍເດີ #${orderId} ຮຽບຮ້ອຍແລ້ວ`);
                setTimeout(() => setToastMsg(null), 2500);
                onRefresh();
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error updating order status");
        } finally {
            setUpdating(false);
        }
    };

    const getChatLink = (order: BackendOrder, channel: "whatsapp" | "messenger") => {
        const orderMsg = [
            `ສະບາຍດີ, ອໍເດີ #RB-${String(order.id).padStart(5, "0")}`,
            `ສະຖານະອໍເດີ: ${statusTranslations[order.status]?.label || order.status}`,
            `ລວມທັງໝົດ: ${formatPrice(order.totalPrice)}`,
        ].join("\n");

        if (channel === "whatsapp") {
            const cleanPhone = order.customerPhone.replace(/\D/g, "");
            const formattedPhone = cleanPhone.startsWith("0") ? "856" + cleanPhone.slice(1) : cleanPhone.startsWith("856") ? cleanPhone : "856" + cleanPhone;
            return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(orderMsg)}`;
        } else {
            return `https://m.me/?text=${encodeURIComponent(orderMsg)}`;
        }
    };

    // Mobile Swipe Handler
    const handleTouchStart = (e: React.TouchEvent, id: number) => {
        setTouchStartX(e.touches[0].clientX);
        setSwipingCardId(id);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (swipingCardId === null) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartX;
        setSwipeDistance(diff);
    };

    const handleTouchEnd = () => {
        if (swipingCardId === null) return;
        if (swipeDistance > 100) {
            // Swipe Right: Confirm
            handleUpdateStatus(swipingCardId, "CONFIRMED");
        } else if (swipeDistance < -100) {
            // Swipe Left: Cancel
            handleUpdateStatus(swipingCardId, "CANCELLED");
        }
        setSwipingCardId(null);
        setSwipeDistance(0);
    };

    return (
        <div className="space-y-4">
            {/* Status Tabs */}
            <div className="flex border-b border-gray-100 overflow-x-auto whitespace-nowrap no-scrollbar pb-0.5">
                {[
                    { key: "PENDING" as const, label: "ລໍຢືນຢັນ", count: statusCounts.PENDING },
                    { key: "CONFIRMED" as const, label: "ກຳລັງແພັກ", count: statusCounts.CONFIRMED },
                    { key: "SHIPPING" as const, label: "ຈັດສົ່ງແລ້ວ", count: statusCounts.SHIPPING },
                    { key: "CANCELLED" as const, label: "ຍົກເລີກ", count: statusCounts.CANCELLED },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setStatusFilter(tab.key)}
                        className={`relative h-11 px-4 min-w-24 transition flex items-center justify-center gap-1.5 cursor-pointer ${
                            statusFilter === tab.key ? "text-shop-primary font-black" : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <span>{tab.label}</span>
                        <span className={`inline-block rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                            statusFilter === tab.key ? "bg-red-50 text-shop-primary" : "bg-gray-100 text-gray-500"
                        }`}>
                            {tab.count}
                        </span>
                        {statusFilter === tab.key ? (
                            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-shop-primary" />
                        ) : null}
                    </button>
                ))}
            </div>

            {/* List Container */}
            <div className="space-y-3">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => {
                        const isThisSwiping = swipingCardId === order.id;
                        const statusInfo = statusTranslations[order.status] || { label: order.status, tone: "gray" };

                        return (
                            <article
                                key={order.id}
                                onTouchStart={(e) => handleTouchStart(e, order.id)}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:shadow-xs"
                            >
                                {/* Swipe Action backgrounds underneath */}
                                {isThisSwiping && swipeDistance > 20 && (
                                    <div className="absolute inset-0 z-0 bg-green-500 flex items-center pl-6 text-white text-xs font-black select-none">
                                        ປັດຂວາເພື່ອຢືນຢັນອໍເດີ
                                    </div>
                                )}
                                {isThisSwiping && swipeDistance < -20 && (
                                    <div className="absolute inset-0 z-0 bg-red-500 flex items-center justify-end pr-6 text-white text-xs font-black select-none">
                                        ປັດຊ້າຍເພື່ອຍົກເລີກອໍເດີ
                                    </div>
                                )}

                                {/* Card Body (slid when swiping) */}
                                <div
                                    style={{
                                        transform: isThisSwiping ? `translateX(${swipeDistance}px)` : "translateX(0px)",
                                        transition: isThisSwiping ? "none" : "transform 0.2s ease",
                                    }}
                                    className="relative z-10 bg-white p-4 flex flex-col justify-between gap-3"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="text-sm font-black text-shop-text">
                                                    #RB-{String(order.id).padStart(5, "0")}
                                                </h3>
                                                <span className="text-[10px] font-bold text-gray-400">
                                                    {formatOrderDate(order.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 mt-0.5 truncate">
                                                {order.store?.name || "Pet Shop"}
                                            </p>
                                        </div>

                                        <StatusBadge tone={statusInfo.tone}>
                                            {statusInfo.label}
                                        </StatusBadge>
                                    </div>

                                    {/* Mid details & Barcode Thumbnail */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="space-y-1">
                                            <div className="text-xs font-semibold text-gray-500">
                                                {(order.items || []).reduce((sum, item) => sum + item.quantity, 0)} ລາຍການສິນຄ້າ
                                            </div>
                                            <div className="text-sm font-black text-shop-primary">{formatPrice(order.totalPrice)}</div>
                                        </div>
                                        
                                        {(order.status === "CONFIRMED" || order.status === "SHIPPING" || order.status === "COMPLETED") && (
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setBarcodeModalOrder(order);
                                                }}
                                                className="relative group cursor-pointer shrink-0"
                                            >
                                                <img 
                                                    src="/shipping-label.png" 
                                                    alt="Barcode" 
                                                    className="w-16 h-12 object-contain bg-white rounded-lg border border-gray-150 p-0.5 hover:border-shop-primary transition" 
                                                />
                                                <span className="absolute -bottom-1 -right-1 bg-shop-primary text-white rounded-full p-0.5 shadow-xs border border-white">
                                                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3">
                                                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                                    </svg>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 border-t border-gray-50 pt-3 mt-1 overflow-x-auto no-scrollbar">
                                        {order.status === "PENDING" && (
                                            <button
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                                                className="h-8.5 px-3.5 rounded-lg bg-[#e6f7ed] text-[#0fa958] font-black text-xs hover:bg-[#d8f3e3] cursor-pointer shrink-0 transition"
                                            >
                                                ຢືນຢັນອໍເດີ
                                            </button>
                                        )}
                                        
                                        {(order.status === "CONFIRMED" || order.status === "SHIPPING" || order.status === "COMPLETED") && (
                                            <button
                                                onClick={() => setBarcodeModalOrder(order)}
                                                className="h-8.5 px-3 rounded-lg border border-gray-200 text-gray-700 font-black text-xs hover:bg-gray-50 cursor-pointer shrink-0 transition flex items-center gap-1.5"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                    <polyline points="6 9 6 2 18 2 18 9" />
                                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                                    <rect x="6" y="14" width="12" height="8" />
                                                </svg>
                                                <span>ພິມໃບປະໜ້າ</span>
                                            </button>
                                        )}
                                        
                                        {order.status === "CONFIRMED" && (
                                            <button
                                                onClick={() => {
                                                    setScanningOrder(order);
                                                    setScanningSuccess(false);
                                                }}
                                                className="h-8.5 px-3 rounded-lg bg-shop-primary text-white font-black text-xs hover:bg-red-600 cursor-pointer shrink-0 transition flex items-center gap-1.5"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                                                    <circle cx="12" cy="13" r="4"/>
                                                </svg>
                                                <span>ສະແກນສົ່ງ</span>
                                            </button>
                                        )}
                                        
                                        {(order.status === "CONFIRMED" || order.status === "SHIPPING" || order.status === "COMPLETED") && (
                                            <button
                                                onClick={() => handleShareProof(order)}
                                                className="h-8.5 px-3 rounded-lg bg-blue-50 text-blue-600 font-black text-xs hover:bg-blue-100 cursor-pointer shrink-0 transition flex items-center gap-1.5"
                                            >
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                                                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                                                </svg>
                                                <span>ສົ່ງຫຼັກຖານ</span>
                                            </button>
                                        )}

                                        {order.status === "CONFIRMED" && (
                                            <button
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(order.id, "SHIPPING")}
                                                className="h-8.5 px-3 rounded-lg border border-gray-200 text-gray-700 font-black text-xs hover:bg-gray-50 cursor-pointer shrink-0 transition"
                                            >
                                                ເລີ່ມສົ່ງເຄື່ອງ
                                            </button>
                                        )}
                                        
                                        {order.status === "SHIPPING" && (
                                            <button
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                                                className="h-8.5 px-3 rounded-lg bg-green-500 text-white font-black text-xs hover:bg-green-600 cursor-pointer shrink-0 transition"
                                            >
                                                ຈັດສົ່ງສຳເລັດ
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="h-8.5 px-3 rounded-lg border border-gray-200 text-gray-600 font-black text-xs hover:bg-gray-50 cursor-pointer shrink-0 transition"
                                        >
                                            ລາຍລະອຽດ
                                        </button>

                                        <a
                                            href={getChatLink(order, "whatsapp")}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="h-8.5 px-3 rounded-lg bg-green-500 text-white font-black text-xs hover:bg-green-600 cursor-pointer shrink-0 transition flex items-center justify-center gap-1.5"
                                        >
                                            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white" aria-hidden="true">
                                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.504-5.728-1.465L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.725 1.45 5.556 0 10.077-4.502 10.08-10.061.002-2.693-1.045-5.226-2.951-7.133C16.598 1.503 14.07 1.45 12.012 1.45c-5.561 0-10.082 4.502-10.085 10.062-.001 1.637.447 3.239 1.3 4.673l-.995 3.633 3.825-.964z" />
                                            </svg>
                                            <span>WhatsApp</span>
                                        </a>

                                        {order.status !== "CANCELLED" && order.status !== "COMPLETED" && (
                                            <button
                                                disabled={updating}
                                                onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                                                className="h-8.5 px-3 rounded-lg border border-red-100 text-red-500 font-black text-xs hover:bg-red-50 cursor-pointer shrink-0 transition"
                                            >
                                                ຍົກເລີກ
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <EmptyNotice text="ຍັງບໍ່ມີຄຳສັ່ງຊື້ໃນສະຖານະນີ້" />
                )}
            </div>

            {/* Toast message popup */}
            {toastMsg && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 backdrop-blur text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center gap-1.5 animate-fade-in border border-white/5">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-400" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{toastMsg}</span>
                </div>
            )}

            {/* Barcode / Shipping Label Printable Modal */}
            {barcodeModalOrder && (
                <Modal 
                    title={`ໃບຝາກສົ່ງພັດສະດຸ #RB-${String(barcodeModalOrder.id).padStart(5, "0")}`} 
                    onClose={() => setBarcodeModalOrder(null)}
                >
                    <div className="space-y-4 text-center">
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                            <img 
                                src="/shipping-label.png" 
                                alt="Shipping Label" 
                                className="max-w-full max-h-[300px] object-contain rounded-lg shadow-sm bg-white" 
                            />
                            <div className="mt-3 text-center space-y-1">
                                <p className="text-xs font-bold text-gray-500">ບໍລິສັດຂົນສົ່ງ: Anousith Express</p>
                                <p className="text-sm font-black text-shop-text font-mono tracking-wider">AN-{String(barcodeModalOrder.id).padStart(5, "0")}-LA</p>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    window.print();
                                }}
                                className="flex-1 h-11 rounded-xl bg-shop-primary text-white text-xs sm:text-sm font-black hover:bg-red-600 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                            >
                                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <polyline points="6 9 6 2 18 2 18 9" />
                                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                                    <rect x="6" y="14" width="12" height="8" />
                                </svg>
                                <span>ພິມໃບປະໜ້າ (Print)</span>
                            </button>
                            
                            <button
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = "/shipping-label.png";
                                    link.download = `shipping-label-RB-${barcodeModalOrder.id}.png`;
                                    link.click();
                                }}
                                className="h-11 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Simulated Barcode Camera Scanner Modal */}
            {scanningOrder && (
                <Modal 
                    title={`ສະແກນບາໂຄດອໍເດີ #RB-${String(scanningOrder.id).padStart(5, "0")}`} 
                    onClose={() => {
                        setScanningOrder(null);
                        setScanningSuccess(false);
                    }}
                >
                    <div className="space-y-4">
                        {!scanningSuccess ? (
                            <div className="relative h-64 w-full bg-black rounded-2xl overflow-hidden border border-gray-800 flex flex-col items-center justify-center">
                                <div className="absolute inset-8 border-2 border-dashed border-red-500 opacity-60 rounded-xl" />
                                <div className="absolute left-0 right-0 h-0.5 bg-red-500 animate-bounce shadow-md shadow-red-500/50" style={{ top: "40%", animationDuration: "2.5s" }} />
                                <span className="text-2xl animate-pulse">📷</span>
                                <p className="text-[11px] sm:text-xs font-bold text-gray-400 mt-3 animate-pulse">ກຳລັງສະແກນໃບປະໜ້າຂົນສົ່ງ...</p>
                                <div className="hidden">
                                    {setTimeout(() => {
                                        if (scanningOrder && !scanningSuccess) {
                                            setScanningSuccess(true);
                                            handleUpdateStatus(scanningOrder.id, "SHIPPING");
                                        }
                                    }, 2000)}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4">
                                <span className="grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-500 mx-auto text-2xl animate-scale-up font-black">
                                    ✓
                                </span>
                                <div>
                                    <h4 className="text-sm font-black text-shop-text">ສະແກນບາໂຄດສຳເລັດ!</h4>
                                    <p className="text-xs text-gray-500 font-semibold mt-1">ອໍເດີຖືກອັບເດດເປັນສະຖານະ "ຈັດສົ່ງແລ້ວ"</p>
                                    <p className="text-[10px] font-mono text-shop-primary font-bold mt-2 bg-red-50 px-3 py-1 rounded-lg inline-block">
                                        ເລກແທຣັກກິ້ງ: AN-{String(scanningOrder.id).padStart(5, "0")}-LA
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setScanningOrder(null);
                                        setScanningSuccess(false);
                                    }}
                                    className="w-full h-11 rounded-xl bg-shop-primary text-white text-xs sm:text-sm font-black hover:bg-red-600 transition cursor-pointer"
                                >
                                    ຕົກລົງ
                                </button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}

            {/* Order Detail Modal */}
            {selectedOrder && (
                <Modal title={`ລາຍລະອຽດອໍເດີ #RB-${String(selectedOrder.id).padStart(5, "0")}`} onClose={() => setSelectedOrder(null)}>
                    <div className="space-y-4 text-xs sm:text-sm font-semibold">
                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400">ສະຖານະ</p>
                                <div className="mt-0.5">
                                    <StatusBadge tone={statusTranslations[selectedOrder.status]?.tone || "gray"}>
                                        {statusTranslations[selectedOrder.status]?.label || selectedOrder.status}
                                    </StatusBadge>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase text-gray-400">ວັນທີເຮັດລາຍການ</p>
                                <p className="font-black text-shop-text mt-0.5">{formatOrderDate(selectedOrder.createdAt)}</p>
                            </div>
                        </div>

                        {/* Customer details */}
                        <div className="p-3.5 border border-gray-100 rounded-xl space-y-1.5 bg-gray-50/20">
                            <p className="text-[10px] font-black uppercase text-gray-400">ຂໍ້ມູນຜູ້ຊື້</p>
                            <p className="font-black text-shop-text">ຊື່: <span className="font-bold text-gray-700">{selectedOrder.customerName}</span></p>
                            <p className="font-black text-shop-text">ເບີໂທ: <span className="font-bold text-gray-700">{selectedOrder.customerPhone}</span></p>
                            <p className="font-black text-shop-text">ທີ່ຢູ່ຈັດສົ່ງ: <span className="font-bold text-gray-600">{selectedOrder.customerAddress}</span></p>
                            {selectedOrder.note && (
                                <p className="font-black text-shop-text">ໝາຍເຫດ: <span className="text-shop-primary italic font-semibold">"{selectedOrder.note}"</span></p>
                            )}
                        </div>

                        {/* Items list */}
                        <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 bg-white">
                            {(selectedOrder.items || []).map((item) => (
                                <div key={item.productId} className="p-3 flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-black text-shop-text truncate">{item.productName}</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 mt-0.5">
                                            {formatPrice(item.price)} x {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-black text-shop-text shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Total amount */}
                        <div className="flex justify-between items-center border-t border-dashed border-gray-100 pt-3 text-sm sm:text-base font-black">
                            <span>ຍອດເງິນລວມທັງໝົດ</span>
                            <span className="text-shop-primary">{formatPrice(selectedOrder.totalPrice)}</span>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}

function ImageUploadInput({
    value,
    onChange,
    placeholder,
    label,
    folder,
}: {
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label: string;
    folder?: string;
}) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res = await api.uploadImage(file, folder);
            if (res.success && res.data?.url) {
                onChange(res.data.url);
            } else {
                alert(res.message || "ອັບໂຫຼດຮູບພາບລົ້ມເຫຼວ");
            }
        } catch (err) {
            console.error("Upload failed:", err);
            alert(err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫຼດຮູບພາບ");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-1.5">
            <div className="flex justify-between items-center">
                <span className="text-xs font-black uppercase text-gray-500">{label}</span>
                {isUploading && (
                    <span className="text-xs font-bold text-shop-primary animate-pulse">ກຳລັງອັບໂຫຼດ...</span>
                )}
            </div>
            <div className="flex gap-2">
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-11 flex-1 min-w-0 rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                    placeholder={placeholder}
                />
                <label className="h-11 shrink-0 px-4 rounded-xl border border-dashed border-gray-300 hover:border-shop-primary hover:bg-shop-light/35 flex items-center justify-center gap-2 cursor-pointer transition text-gray-600 hover:text-shop-primary font-black text-xs">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span>ອັບໂຫຼດ</span>
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </label>
            </div>
            {value && (
                <div className="mt-2 relative inline-block">
                    <img src={value} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-100 shadow-sm" />
                    <button
                        type="button"
                        onClick={() => onChange("")}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow hover:bg-red-600 transition flex items-center justify-center h-5 w-5"
                        title="ລຶບຮູບພາບ"
                    >
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}

function ProductsView({
    categories,
    products,
    stores,
    onRefresh,
}: Pick<LoadState, "categories" | "products" | "stores"> & { onRefresh: () => void }) {
    const [query, setQuery] = useState("");
    const [filterState, setFilterState] = useState<"ALL" | "ACTIVE" | "INACTIVE" | "LOW_STOCK">("ALL");
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Auto trigger product creation if query param exists
    useEffect(() => {
        if (window.location.hash.includes("create=true")) {
            openCreateModal();
            window.history.replaceState(null, "", window.location.pathname + window.location.hash.split("?")[0]);
        }
    }, [products]);

    // Form states
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [storeId, setStoreId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase());
            if (!matchesQuery) return false;

            if (filterState === "ACTIVE") return product.isActive;
            if (filterState === "INACTIVE") return !product.isActive;
            if (filterState === "LOW_STOCK") return product.stock <= 5;
            return true;
        });
    }, [products, query, filterState]);

    const filteredCategories = useMemo(() => {
        if (!storeId) return [];
        return categories.filter((c) => c.storeId === Number(storeId));
    }, [storeId, categories]);

    const openCreateModal = () => {
        setEditingProduct(null);
        setName("");
        setPrice("");
        setStock("0");
        setStoreId(stores[0]?.id ? String(stores[0].id) : "");
        setCategoryId("");
        setImageUrl("");
        setDescription("");
        setIsActive(true);
        setIsFeatured(false);
        setIsOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(String(product.price));
        setStock(String(product.stock));
        setStoreId(String(product.storeId));
        setCategoryId(product.categoryId ? String(product.categoryId) : "");
        setImageUrl(product.imageUrl ?? "");
        setDescription(product.description ?? "");
        setIsActive(product.isActive);
        setIsFeatured(!!product.isFeatured);
        setIsOpen(true);
    };

    const handleToggleActive = async (product: Product, event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        try {
            const body = {
                name: product.name,
                price: Number(product.price),
                stock: Number(product.stock),
                storeId: product.storeId,
                categoryId: product.categoryId || null,
                imageUrl: product.imageUrl || null,
                description: product.description || null,
                isActive: event.target.checked,
                isFeatured: !!product.isFeatured,
            };
            const res = await api.updateProduct(product.id, body);
            if (res.success) {
                onRefresh();
            }
        } catch (err) {
            console.error("Toggle failed:", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price || !storeId) {
            alert("ກະລຸນາຕື່ມຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ");
            return;
        }

        setLoading(true);
        try {
            const body = {
                name,
                price: Number(price),
                stock: Number(stock) || 0,
                storeId: Number(storeId),
                categoryId: categoryId ? Number(categoryId) : null,
                imageUrl: imageUrl || null,
                description: description || null,
                isActive,
                isFeatured,
            };

            let res;
            if (editingProduct) {
                res = await api.updateProduct(editingProduct.id, body);
            } else {
                res = await api.createProduct(body);
            }

            if (res.success) {
                onRefresh();
                setIsOpen(false);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error saving product");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("ທ່ານຕ້ອງການລຶບສິນຄ້ານີ້ ແມ່ນ ຫຼື ບໍ່?")) return;
        try {
            const res = await api.deleteProduct(id);
            if (res.success) {
                onRefresh();
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error deleting product");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary"
                        placeholder="ຄົ້ນຫາຊື່ສິນຄ້າ..."
                    />
                    <svg viewBox="0 0 24 24" className="absolute left-3 top-3 h-4.5 w-4.5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                </div>
                
                <button
                    onClick={openCreateModal}
                    className="h-10 rounded-xl bg-shop-primary px-5 text-xs sm:text-sm font-black text-white hover:bg-red-600 cursor-pointer flex items-center justify-center gap-1.5 transition"
                >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>ເພີ່ມສິນຄ້າ</span>
                </button>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap no-scrollbar pb-1">
                {[
                    { key: "ALL" as const, label: "ທັງໝົດ" },
                    { key: "ACTIVE" as const, label: "ເປີດຂາຍ" },
                    { key: "INACTIVE" as const, label: "ປິດຂາຍ" },
                    { key: "LOW_STOCK" as const, label: "ໃກ້ໝົດ" },
                ].map((chip) => (
                    <button
                        key={chip.key}
                        onClick={() => setFilterState(chip.key)}
                        className={`h-8.5 px-4 rounded-full text-xs font-black transition cursor-pointer border ${
                            filterState === chip.key
                                ? "bg-shop-primary/10 border-shop-primary/20 text-shop-primary"
                                : "bg-white border-gray-150 text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        {chip.label}
                    </button>
                ))}
            </div>

            {/* Product Cards grid */}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => openEditModal(product)}
                            className="rounded-2xl border border-gray-100 bg-white p-3.5 hover:shadow-xs transition flex items-center justify-between gap-3 cursor-pointer"
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover border border-gray-100" />
                                ) : (
                                    <span className="grid h-12 w-12 place-items-center rounded-lg bg-shop-light text-shop-primary shrink-0">
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                                            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-xs sm:text-sm font-black text-shop-text">
                                        {product.name}
                                    </p>
                                    <p className="text-[10px] sm:text-xs font-black text-shop-primary mt-0.5">
                                        {formatPrice(product.price)}
                                    </p>
                                    <p className={`text-[9px] sm:text-[10px] font-bold mt-0.5 ${product.stock <= 5 ? "text-red-500 font-extrabold" : "text-gray-400"}`}>
                                        ສະຕັອກ {product.stock} ອັນ
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {/* Active Switch Toggle */}
                                <label className="relative inline-flex items-center cursor-pointer shrink-0" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={product.isActive}
                                        onChange={(e) => handleToggleActive(product, e)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                                
                                {/* Chevron Right Edit Arrow */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openEditModal(product);
                                    }}
                                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-shop-primary transition shrink-0 cursor-pointer"
                                    title="ແກ້ໄຂຂໍ້ມູນ"
                                >
                                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <EmptyNotice text="ບໍ່ພົບລາຍການສິນຄ້າທີ່ກົງກັບການຄົ້ນຫາ" />
                    </div>
                )}
            </div>

            {/* Bottom Edit Sheet for Mobile / Modal for Desktop */}
            {/* Mobile Floating Add Product Button */}
            <button
                onClick={openCreateModal}
                className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-shop-primary text-white shadow-lg shadow-red-500/30 hover:bg-red-600 active:scale-95 transition cursor-pointer lg:hidden"
                title="ເພີ່ມສິນຄ້າໃໝ່"
            >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center p-0 lg:p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-fade-in" onClick={() => setIsOpen(false)} />
                    <div className="relative z-10 w-full lg:max-w-lg rounded-t-[24px] lg:rounded-2xl bg-white p-5 shadow-2xl transition-all flex flex-col max-h-[85vh] animate-scale-up">
                        {/* Drag Handle on Mobile */}
                        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 lg:hidden" />

                        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                            <h3 className="text-base font-black text-shop-text">{editingProduct ? "ແກ້ໄຂສິນຄ້າ" : "ເພີ່ມສິນຄ້າໃໝ່"}</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1.5 bg-gray-50 text-gray-400 hover:text-shop-primary transition cursor-pointer"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 pb-4">
                            {editingProduct && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt="" className="h-12 w-12 rounded-lg object-cover border border-gray-200" />
                                    ) : (
                                        <span className="grid h-12 w-12 place-items-center rounded-lg bg-white text-shop-primary border border-gray-200">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                            </svg>
                                        </span>
                                    )}
                                    <p className="font-black text-xs sm:text-sm text-shop-text">{name}</p>
                                </div>
                            )}

                            {!editingProduct && (
                                <label className="block">
                                    <span className="text-xs font-black uppercase text-gray-400">ຊື່ສິນຄ້າ *</span>
                                    <input
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary"
                                        placeholder="ເຊັ່ນ Royal Canin Kitten 2kg"
                                    />
                                </label>
                            )}

                            <label className="block">
                                <span className="text-xs font-black uppercase text-gray-400">ລາຄາ (LAK) *</span>
                                <input
                                    required
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary"
                                    placeholder="ເຊັ່ນ 490000"
                                />
                            </label>

                            {/* Stock input with - and + helpers */}
                            <div className="block">
                                <span className="text-xs font-black uppercase text-gray-400">ສະຕັອກຄົງເຫຼືອ *</span>
                                <div className="flex gap-2 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setStock((prev) => String(Math.max(0, Number(prev) - 1)))}
                                        className="h-11 w-11 rounded-xl border border-gray-200 hover:border-shop-primary flex items-center justify-center text-gray-600 hover:text-shop-primary transition font-bold text-lg cursor-pointer"
                                    >
                                        -
                                    </button>
                                    <input
                                        required
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="h-11 flex-1 text-center rounded-xl border border-gray-200 px-3 text-xs sm:text-sm font-black outline-none focus:border-shop-primary"
                                        placeholder="0"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setStock((prev) => String(Number(prev) + 1))}
                                        className="h-11 w-11 rounded-xl border border-gray-200 hover:border-shop-primary flex items-center justify-center text-gray-600 hover:text-shop-primary transition font-bold text-lg cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {!editingProduct && (
                                <label className="block">
                                    <span className="text-xs font-black uppercase text-gray-400">ຮ້ານຄ້າ *</span>
                                    <select
                                        required
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
                                        className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary cursor-pointer"
                                    >
                                        {stores.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            {!editingProduct && (
                                <label className="block">
                                    <span className="text-xs font-black uppercase text-gray-400">ໝວດໝູ່ສິນຄ້າ</span>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="mt-1 h-11 w-full rounded-xl border border-gray-200 px-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary cursor-pointer"
                                    >
                                        <option value="">ບໍ່ມີໝວດໝູ່</option>
                                        {filteredCategories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            {!editingProduct && (
                                <ImageUploadInput
                                    value={imageUrl}
                                    onChange={setImageUrl}
                                    label="ລິ້ງຮູບພາບ (Image URL)"
                                    placeholder="https://example.com/product.jpg"
                                    folder="products"
                                />
                            )}

                            {!editingProduct && (
                                <label className="block">
                                    <span className="text-xs font-black uppercase text-gray-400">ຄຳອະທິບາຍລາຍລະອຽດ</span>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="mt-1 w-full rounded-xl border border-gray-200 p-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary resize-none"
                                        placeholder="ຕື່ມລາຍລະອຽດສິນຄ້າ..."
                                    />
                                </label>
                            )}

                            {/* Switches */}
                            <div className="flex flex-col gap-2 pt-2">
                                <label className="flex items-center justify-between py-1.5 cursor-pointer">
                                    <span className="text-xs sm:text-sm font-bold text-gray-700">ເປີດວາງຂາຍ (Active Status)</span>
                                    <input
                                        type="checkbox"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                </label>

                                <label className="flex items-center justify-between py-1.5 cursor-pointer">
                                    <span className="text-xs sm:text-sm font-bold text-gray-700">ສິນຄ້າແນະນຳ (Featured)</span>
                                    <input
                                        type="checkbox"
                                        checked={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
                                </label>
                            </div>

                            {/* Bottom actions */}
                            <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 w-full rounded-xl bg-shop-primary text-white font-black text-xs sm:text-sm hover:bg-red-600 transition disabled:opacity-50 cursor-pointer"
                                >
                                    ບັນທຶກຂໍ້ມູນ
                                </button>
                                {editingProduct && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            handleDelete(editingProduct.id);
                                            setIsOpen(false);
                                        }}
                                        className="h-11 w-full rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-black text-xs sm:text-sm transition cursor-pointer"
                                    >
                                        ລຶບສິນຄ້ານີ້
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StoresView({ stores, onRefresh }: { stores: Store[]; onRefresh: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingStore, setEditingStore] = useState<Store | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto trigger store creation if query param exists
    useEffect(() => {
        if (window.location.hash.includes("create=true")) {
            openCreateModal();
            window.history.replaceState(null, "", window.location.pathname + window.location.hash.split("?")[0]);
        }
    }, [stores]);

    // Form states
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [description, setDescription] = useState("");
    const [logoUrl, setLogoUrl] = useState("");
    const [bannerUrl, setBannerUrl] = useState("");
    const [isActive, setIsActive] = useState(true);

    const openCreateModal = () => {
        setEditingStore(null);
        setName("");
        setSlug("");
        setDescription("");
        setLogoUrl("");
        setBannerUrl("");
        setIsActive(true);
        setIsOpen(true);
    };

    const openEditModal = (store: Store) => {
        setEditingStore(store);
        setName(store.name);
        setSlug(store.slug);
        setDescription(store.description ?? "");
        setLogoUrl(store.logoUrl ?? "");
        setBannerUrl(store.bannerUrl ?? "");
        setIsActive(store.isActive);
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !slug) {
            alert("ກະລຸນາຕື່ມຊື່ຮ້ານຄ້າ ແລະ ສະລັກຫຍໍ້ (slug)");
            return;
        }

        setLoading(true);
        try {
            const body = {
                name,
                slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                description: description || null,
                logoUrl: logoUrl || null,
                bannerUrl: bannerUrl || null,
                isActive,
            };

            let res;
            if (editingStore) {
                res = await api.updateStore(editingStore.id, body);
            } else {
                res = await api.createStore(body);
            }

            if (res.success) {
                onRefresh();
                setIsOpen(false);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error saving store");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("ທ່ານຕ້ອງການລຶບຮ້ານຄ້ານີ້ ແມ່ນ ຫຼື ບໍ່? (ປະຫວັດອໍເດີ ແລະ ສິນຄ້າທັງໝົດທີ່ຢູ່ໃນຮ້ານຄ້າຈະຖືກລຶບໄປນຳ)")) return;
        try {
            const res = await api.deleteStore(id);
            if (res.success) {
                onRefresh();
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error deleting store");
        }
    };

    return (
        <div className="space-y-4">
            <Panel
                title="Store Management"
                action={
                    <button
                        onClick={openCreateModal}
                        className="h-10 rounded-xl bg-shop-primary px-4 text-xs sm:text-sm font-black text-white hover:bg-red-600 cursor-pointer transition"
                    >
                        ເພີ່ມຮ້ານຄ້າ
                    </button>
                }
            >
                <div className="p-4.5 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {stores.map((store) => (
                        <div key={store.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-3 min-w-0">
                                {store.logoUrl ? (
                                    <img src={store.logoUrl} alt="" className="h-12 w-12 rounded-full object-cover border border-gray-150 shadow-xs shrink-0" />
                                ) : (
                                    <span className="grid h-12 w-12 place-items-center rounded-full bg-shop-light text-shop-primary font-black shrink-0">
                                        {store.name.charAt(0)}
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-shop-text">{store.name}</p>
                                    <p className="text-xs font-semibold text-gray-400 mt-0.5 font-mono">/{store.slug}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(store)}
                                    className="h-8.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:border-shop-primary hover:text-shop-primary text-xs font-black transition cursor-pointer"
                                >
                                    ແກ້ໄຂ
                                </button>
                                <button
                                    onClick={() => handleDelete(store.id)}
                                    className="h-8.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-black transition cursor-pointer"
                                >
                                    ລຶບ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>

            {isOpen && (
                <Modal title={editingStore ? "ແກ້ໄຂໂປຣໄຟລ໌ຮ້ານຄ້າ" : "ສ້າງຮ້ານຄ້າໃໝ່"} onClose={() => setIsOpen(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="text-xs font-black uppercase text-gray-500">ຊື່ຮ້ານຄ້າ *</span>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                                placeholder="ເຊັ່ນ Pet Shop"
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase text-gray-500">ສະລັກຫຍໍ້ໜ້າຮ້ານ (Slug) *</span>
                            <input
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary font-mono"
                                placeholder="ເຊັ່ນ petshop"
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase text-gray-500">ຄຳອະທິບາຍຮ້ານຄ້າ</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={2}
                                className="mt-1.5 w-full rounded-xl border border-gray-200 p-3 text-sm font-semibold outline-none focus:border-shop-primary resize-none"
                                placeholder="ລາຍລະອຽດປະເພດສິນຄ້າທີ່ຈຳໜ່າຍ..."
                            />
                        </label>

                        <ImageUploadInput
                            value={logoUrl}
                            onChange={setLogoUrl}
                            label="ລິ້ງໂລໂກ້ຮ້ານຄ້າ (Logo URL)"
                            placeholder="https://example.com/logo.jpg"
                            folder="stores"
                        />

                        <ImageUploadInput
                            value={bannerUrl}
                            onChange={setBannerUrl}
                            label="ລິ້ງແບນເນີຮ້ານຄ້າ (Banner URL)"
                            placeholder="https://example.com/banner.jpg"
                            folder="stores"
                        />

                        <label className="flex items-center gap-2 cursor-pointer py-2">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded-sm border-gray-300 text-shop-primary focus:ring-shop-primary"
                            />
                            <span className="text-sm font-bold text-gray-700">ເປີດໃຊ້ງານສາທາລະນະ (Active)</span>
                        </label>

                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-black text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                ຍົກເລີກ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 rounded-xl bg-shop-primary px-6 text-sm font-black text-white hover:bg-red-600 cursor-pointer disabled:opacity-50"
                            >
                                ບັນທຶກ
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

function CategoriesView({
    categories,
    stores,
    onRefresh,
}: {
    categories: Category[];
    stores: Store[];
    onRefresh: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(false);

    // Auto trigger category creation if query param exists
    useEffect(() => {
        if (window.location.hash.includes("create=true")) {
            openCreateModal();
            window.history.replaceState(null, "", window.location.pathname + window.location.hash.split("?")[0]);
        }
    }, [categories]);

    // Form states
    const [name, setName] = useState("");
    const [storeId, setStoreId] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [isActive, setIsActive] = useState(true);

    const openCreateModal = () => {
        setEditingCategory(null);
        setName("");
        setStoreId(stores[0]?.id ? String(stores[0].id) : "");
        setIconUrl("");
        setIsActive(true);
        setIsOpen(true);
    };

    const openEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setStoreId(String(cat.storeId));
        setIconUrl(cat.iconUrl ?? "");
        setIsActive(cat.isActive);
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !storeId) {
            alert("ກະລຸນາຕື່ມຊື່ໝວດໝູ່ ແລະ ເລືອກຮ້ານຄ້າ");
            return;
        }

        setLoading(true);
        try {
            const body = {
                name,
                storeId: Number(storeId),
                iconUrl: iconUrl || null,
                isActive,
            };

            let res;
            if (editingCategory) {
                res = await api.updateCategory(editingCategory.id, body);
            } else {
                res = await api.createCategory(body);
            }

            if (res.success) {
                onRefresh();
                setIsOpen(false);
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error saving category");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("ທ່ານຕ້ອງການລຶບໝວດໝູ່ນີ້ ແມ່ນ ຫຼື ບໍ່? (ສິນຄ້າທີ່ຢູ່ໃນໝວດໝູ່ນີ້ຈະບໍ່ຖືກລຶບ ແຕ່ຈະບໍ່ມີໝວດໝູ່ເຊື່ອມໂຍງ)")) return;
        try {
            const res = await api.deleteCategory(id);
            if (res.success) {
                onRefresh();
            }
        } catch (err) {
            alert(err instanceof Error ? err.message : "Error deleting category");
        }
    };

    const storeName = (id: number) => stores.find((s) => s.id === id)?.name ?? "-";

    return (
        <div className="space-y-4">
            <Panel
                title="Category Catalog"
                action={
                    <button
                        onClick={openCreateModal}
                        className="h-10 rounded-xl bg-shop-primary px-4 text-xs sm:text-sm font-black text-white hover:bg-red-600 cursor-pointer transition"
                    >
                        ເພີ່ມໝວດໝູ່
                    </button>
                }
            >
                <div className="p-4.5 grid gap-4 grid-cols-1 md:grid-cols-2">
                    {categories.map((cat) => (
                        <div key={cat.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-3 shadow-xs">
                            <div className="flex items-center gap-3 min-w-0">
                                {cat.iconUrl ? (
                                    <img src={cat.iconUrl} alt="" className="h-10 w-10 object-contain shrink-0" />
                                ) : (
                                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-shop-light text-shop-primary font-black shrink-0">
                                        📁
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-shop-text">{cat.name}</p>
                                    <p className="text-xs font-semibold text-gray-400 mt-0.5">{storeName(cat.storeId)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(cat)}
                                    className="h-8.5 px-3 rounded-lg border border-gray-200 text-gray-600 hover:border-shop-primary hover:text-shop-primary text-xs font-black transition cursor-pointer"
                                >
                                    ແກ້ໄຂ
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="h-8.5 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-black transition cursor-pointer"
                                >
                                    ລຶບ
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Panel>

            {isOpen && (
                <Modal title={editingCategory ? "ແກ້ໄຂໝວດໝູ່ສິນຄ້າ" : "ເພີ່ມໝວດໝູ່ສິນຄ້າໃໝ່"} onClose={() => setIsOpen(false)}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="block">
                            <span className="text-xs font-black uppercase text-gray-500">ຊື່ໝວດໝູ່ *</span>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                                placeholder="ເຊັ່ນ ອາຫານໝາ"
                            />
                        </label>

                        <label className="block">
                            <span className="text-xs font-black uppercase text-gray-500">ຮ້ານຄ້າທີ່ຜູກໝວດໝູ່ *</span>
                            <select
                                required
                                value={storeId}
                                onChange={(e) => setStoreId(e.target.value)}
                                className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary cursor-pointer"
                            >
                                <option value="">ເລືອກຮ້ານຄ້າ</option>
                                {stores.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </label>

                        <ImageUploadInput
                            value={iconUrl}
                            onChange={setIconUrl}
                            label="ໄອຄອນໝວດໝູ່ (Icon URL)"
                            placeholder="https://example.com/icon.svg"
                            folder="categories"
                        />

                        <label className="flex items-center gap-2 cursor-pointer py-2">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="h-4 w-4 rounded-sm border-gray-300 text-shop-primary focus:ring-shop-primary"
                            />
                            <span className="text-sm font-bold text-gray-700">ເປີດໃຊ້ງານ (Active)</span>
                        </label>

                        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 mt-6">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="h-11 rounded-xl border border-gray-200 px-5 text-sm font-black text-gray-600 hover:bg-gray-50 cursor-pointer"
                            >
                                ຍົກເລີກ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="h-11 rounded-xl bg-shop-primary px-6 text-sm font-black text-white hover:bg-red-600 cursor-pointer disabled:opacity-50"
                            >
                                ບັນທຶກ
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
}

function UsersView() {
    return (
        <Panel title="User Management">
            <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                {sampleUsers.map((user) => (
                    <div key={user.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex items-center justify-between gap-3 shadow-xs">
                        <div className="min-w-0">
                            <p className="truncate text-sm font-black text-shop-text">{user.name}</p>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">{user.email}</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">ບົດບາດ: {user.role}</p>
                        </div>
                        <div className="text-right shrink-0">
                            <StatusBadge tone={user.status === "Active" ? "green" : "amber"}>
                                {user.status}
                            </StatusBadge>
                            <p className="text-xs font-bold text-gray-400 mt-1">{user.orders} ຄຳສັ່ງຊື້</p>
                        </div>
                    </div>
                ))}
            </div>
        </Panel>
    );
}

function SettingsView() {
    return (
        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Panel title="Order Channels & Defaults">
                <div className="space-y-4 p-5 text-xs sm:text-sm font-semibold text-gray-700">
                    {[
                        ["Default WhatsApp Link", "+856 20 9131 9983"],
                        ["Messenger Link", "https://m.me/rubystores"],
                        ["Default Delivery Fee", "0 LAK"],
                    ].map(([label, value]) => (
                        <label key={label} className="block">
                            <span className="text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                                {label}
                            </span>
                            <input
                                defaultValue={value}
                                className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-3 text-xs sm:text-sm font-semibold outline-none focus:border-shop-primary"
                            />
                        </label>
                    ))}
                    <button className="h-11 rounded-xl bg-shop-primary px-5 text-xs sm:text-sm font-black text-white cursor-pointer hover:bg-red-600 transition">
                        Save Settings
                    </button>
                </div>
            </Panel>

            <Panel title="Admin Engine Info">
                <div className="space-y-3 p-5">
                    {[
                        "All Stores CRUD are now connected to the PostgreSQL database.",
                        "All Products CRUD are now fully functional with dynamic Category filters.",
                        "All Categories CRUD are connected to respective Stores.",
                        "All Orders are fetched live from database, status changes update product stock in real time.",
                    ].map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 border border-gray-100/30">
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-shop-light text-shop-primary shrink-0">
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </span>
                            <p className="text-xs font-bold text-gray-600">{item}</p>
                        </div>
                    ))}
                </div>
            </Panel>
        </div>
    );
}

function MoreView() {
    const handleLogout = () => {
        logout();
        window.location.assign("#home");
    };

    const moreNavItems = [
        { label: "ໂປຣໄຟລ໌ຮ້ານຄ້າ (Stores)", href: "#/admin/stores", icon: "🏢" },
        { label: "ໝວດໝູ່ສິນຄ້າ (Categories)", href: "#/admin/categories", icon: "📁" },
        { label: "ລາຍຊື່ລູກຄ້າ (Customers)", href: "#/admin/users", icon: "👥" },
        { label: "ແຄມເປນໂປຣໂມຊັນ (Promotions)", href: "#/admin/settings", icon: "🎁" },
        { label: "ລາຍງານຍອດຂາຍ (Reports)", href: "#/admin", icon: "📈" },
        { label: "ປ່ຽນພາສາ (Language)", href: "#/admin/settings", icon: "🌐" },
        { label: "ສູນຊ່ວຍເຫຼືອ (Help Center)", href: "https://wa.me/8562091319983", icon: "💬" },
    ];

    return (
        <Panel title="ເມນູ ແລະ ການຈັດການເພີ່ມເຕີມ">
            <div className="divide-y divide-gray-50 px-3 pb-4">
                {moreNavItems.map((item) => (
                    <a
                        key={item.label}
                        href={item.href}
                        className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-xl transition group"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xl shrink-0">{item.icon}</span>
                            <span className="text-xs sm:text-sm font-black text-shop-text">{item.label}</span>
                        </div>
                        <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-gray-400 group-hover:text-shop-primary transition" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </a>
                ))}

                <div className="pt-5 px-2">
                    <button
                        onClick={handleLogout}
                        className="w-full h-12 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                        </svg>
                        <span>ອອກຈາກລະບົບ</span>
                    </button>
                </div>
            </div>
        </Panel>
    );
}

export function AdminPage({ section }: AdminPageProps) {
    const [state, setState] = useState<LoadState>({
        categories: [],
        products: [],
        stores: [],
        orders: [],
        error: "",
        isLoading: true,
        isDemo: false,
    });
    const [refreshKey, setRefreshKey] = useState(0);

    const handleRefresh = () => setRefreshKey((prev) => prev + 1);

    useEffect(() => {
        let isMounted = true;

        Promise.all([api.products(), api.stores(), api.categories(), api.orders()])
            .then(([productsResponse, storesResponse, categoriesResponse, ordersResponse]) => {
                if (!isMounted) return;

                const products = productsResponse.data ?? [];
                const stores = storesResponse.data ?? [];
                const categories = categoriesResponse.data ?? [];
                const orders = ordersResponse.data ?? [];

                // If the backend is reachable but returns no data at all, still
                // fall back to demo data so the dashboard is presentable.
                const isEmpty =
                    products.length === 0 &&
                    stores.length === 0 &&
                    categories.length === 0 &&
                    orders.length === 0;

                if (isEmpty) {
                    setState({ ...adminDemoData, error: "", isLoading: false, isDemo: true });
                    return;
                }

                setState({
                    products,
                    stores,
                    categories,
                    orders,
                    error: "",
                    isLoading: false,
                    isDemo: false,
                });
            })
            .catch(() => {
                if (!isMounted) return;

                // Backend / database unreachable → run the admin UI on demo data
                // so it can still be shown end-to-end.
                setState({ ...adminDemoData, error: "", isLoading: false, isDemo: true });
            });

        return () => {
            isMounted = false;
        };
    }, [refreshKey]);

    const content = useMemo(() => {
        if (state.isLoading) {
            return (
                <div className="grid min-h-[360px] place-items-center rounded-2xl border border-gray-100 bg-white text-xs sm:text-sm font-black text-gray-400">
                    ກຳລັງດາວໂຫຼດຂໍ້ມູນຫຼັງບ້ານ...
                </div>
            );
        }

        if (state.error) {
            return (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-xs sm:text-sm font-black text-shop-primary">
                    {state.error}
                </div>
            );
        }

        if (section === "orders") {
            return <OrdersView orders={state.orders} onRefresh={handleRefresh} />;
        }

        if (section === "products") {
            return (
                <ProductsView
                    categories={state.categories}
                    products={state.products}
                    stores={state.stores}
                    onRefresh={handleRefresh}
                />
            );
        }

        if (section === "stores") {
            return <StoresView stores={state.stores} onRefresh={handleRefresh} />;
        }

        if (section === "categories") {
            return (
                <CategoriesView
                    categories={state.categories}
                    stores={state.stores}
                    onRefresh={handleRefresh}
                />
            );
        }

        if (section === "users") {
            return <UsersView />;
        }

        if (section === "settings") {
            return <SettingsView />;
        }

        if (section === "more") {
            return <MoreView />;
        }

        return (
            <DashboardView
                products={state.products}
                orders={state.orders}
            />
        );
    }, [section, state]);

    return (
        <AdminShell section={section}>
            {state.isDemo && !state.isLoading && (
                <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs sm:text-sm font-black text-amber-700">
                    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <span>ໂໝດສາທິດ (Demo) — ຕໍ່ຖານຂໍ້ມູນບໍ່ໄດ້ ກຳລັງສະແດງຂໍ້ມູນຕົວຢ່າງ ການບັນທຶກ/ແກ້ໄຂຈະຍັງບໍ່ຖືກຈັດເກັບຈິງ</span>
                </div>
            )}
            {content}
        </AdminShell>
    );
}
