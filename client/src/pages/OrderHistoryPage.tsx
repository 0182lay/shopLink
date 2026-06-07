import { HomeHeader } from "../components/home/HomeHeader";
import { MobileBottomNav } from "../components/home/MobileBottomNav";

type OrderItem = {
    name: string;
    detail: string;
    quantity: number;
    imageUrl: string;
};

type Order = {
    id: string;
    store: string;
    storeImage: string;
    status: "delivered" | "cancelled";
    date: string;
    total: number;
    items: OrderItem[];
};

const orders: Order[] = [
    {
        id: "RB1024",
        store: "Ruby Pet Shop",
        storeImage:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=120&q=80",
        status: "delivered",
        date: "25 ພ.ค. 2567 15:20",
        total: 1058000,
        items: [
            {
                name: "Royal Canin Fit 32",
                detail: "ອາຫານແມວໂຕ 2kg",
                quantity: 1,
                imageUrl:
                    "https://images.unsplash.com/photo-1582397502212-1a6b5721afe4?auto=format&fit=crop&w=180&q=80",
            },
            {
                name: "Me-O Cat Food",
                detail: "ອາຫານແມວ 1.2kg",
                quantity: 2,
                imageUrl:
                    "https://images.unsplash.com/photo-1588528770781-00af5b541e8b?auto=format&fit=crop&w=180&q=80",
            },
        ],
    },
    {
        id: "RB1023",
        store: "Fish Shop",
        storeImage:
            "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=120&q=80",
        status: "delivered",
        date: "20 ພ.ค. 2567 10:15",
        total: 120000,
        items: [
            {
                name: "ປາທອງສວຍງາມ",
                detail: "ຂະໜາດກາງ",
                quantity: 1,
                imageUrl:
                    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=180&q=80",
            },
        ],
    },
    {
        id: "RB1018",
        store: "Ruby Pet Shop",
        storeImage:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=120&q=80",
        status: "cancelled",
        date: "15 ພ.ค. 2567 09:45",
        total: 189000,
        items: [
            {
                name: "Whiskas Adult",
                detail: "ອາຫານແມວ 1.2kg",
                quantity: 1,
                imageUrl:
                    "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=180&q=80",
            },
        ],
    },
];

const formatPrice = (price: number) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(price);

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function OrderStatus({ status }: { status: Order["status"] }) {
    const isDelivered = status === "delivered";
    return (
        <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
                isDelivered
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-shop-primary"
            }`}
        >
            {isDelivered ? "ສົ່ງແລ້ວ" : "ຍົກເລີກ"}
        </span>
    );
}

function OrderCard({ order }: { order: Order }) {
    return (
        <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_24px_rgba(51,51,51,0.04)]">
            <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                    <img
                        src={order.storeImage}
                        alt=""
                        className="h-11 w-11 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                        <h2 className="truncate text-base font-black text-shop-text">
                            {order.store}
                        </h2>
                        <p className="mt-1 text-xs font-bold text-gray-600">
                            ຄຳສັ່ງຊື້ #{order.id}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-gray-500">
                            ສັ່ງເມື່ອ {order.date}
                        </p>
                    </div>
                </div>
                <div className="shrink-0 text-right">
                    <OrderStatus status={order.status} />
                    <p className="mt-3 text-sm font-black text-shop-primary">
                        {formatPrice(order.total)}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex gap-4 overflow-x-auto pb-1 md:gap-8">
                {order.items.map((item) => (
                    <div
                        key={`${order.id}-${item.name}`}
                        className="flex min-w-[170px] items-center gap-3"
                    >
                        <img
                            src={item.imageUrl}
                            alt=""
                            className="h-14 w-14 rounded-lg object-cover md:h-16 md:w-16"
                        />
                        <div className="min-w-0">
                            <p className="line-clamp-1 text-sm font-black text-shop-text">
                                {item.name}
                            </p>
                            <p className="line-clamp-1 text-xs font-semibold text-gray-500">
                                {item.detail}
                            </p>
                            <p className="mt-1 text-xs font-black text-shop-text">
                                x{item.quantity}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-gray-500">
                <span>ສິນຄ້າທັງໝົດ {order.items.length} ລາຍການ</span>
                <span className="text-xl text-gray-400">›</span>
            </div>
        </article>
    );
}

export function OrderHistoryPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-28 text-shop-text md:pb-12 md:pt-28">
            <div className="hidden md:block">
                <HomeHeader activePage="orders" />
            </div>

            <header className="sticky top-0 z-40 border-b border-red-100 bg-white/95 px-4 py-4 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur md:hidden">
                <div className="flex h-12 items-center justify-between">
                    <button type="button" className="grid h-10 w-10 place-items-center">
                        <MenuIcon />
                    </button>
                    <a href="#home" className="text-base font-black text-shop-text">
                        <span className="text-shop-primary">Ruby</span>Stores
                    </a>
                    <span className="h-10 w-10" />
                </div>
            </header>

            <section className="mx-auto max-w-5xl px-4 pt-6 md:px-6 lg:px-8">
                <h1 className="text-2xl font-black text-shop-text md:text-3xl">
                    ປະຫວັດການສັ່ງຊື້
                </h1>
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50/70 px-4 py-3 text-sm font-bold text-shop-primary">
                    ສະແດງຄຳສັ່ງຊື້ຕົວຢ່າງກ່ອນ ຂັ້ນຕໍ່ໄປຄ່ອຍຕໍ່ API ອໍເດີ້ຈິງ
                </div>
                <div className="mt-5 flex border-b border-gray-200 text-sm font-black">
                    {["ທັງໝົດ", "ສົ່ງແລ້ວ", "ຍົກເລີກ"].map((tab, index) => (
                        <button
                            key={tab}
                            type="button"
                            className={`relative h-11 min-w-28 ${
                                index === 0 ? "text-shop-primary" : "text-gray-500"
                            }`}
                        >
                            {tab}
                            {index === 0 ? (
                                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-shop-primary" />
                            ) : null}
                        </button>
                    ))}
                </div>
                <div className="mt-5 space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </section>

            <MobileBottomNav activePage="orders" />
        </main>
    );
}
