import {
    getCartSubtotal,
    removeCartItem,
    updateCartItemQuantity,
    useCartItems,
    type CartItem,
} from "../lib/cart";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(price);

function BackIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
                d="m15 18-6-6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.3"
            />
        </svg>
    );
}

function SimpleIcon({
    type,
    className = "h-5 w-5",
}: {
    type: "trash" | "heart" | "truck" | "bag" | "shield" | "return";
    className?: string;
}) {
    const paths = {
        trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
        heart: "M20.8 8.8c0 5.3-8.8 10-8.8 10s-8.8-4.7-8.8-10A4.7 4.7 0 0 1 12 5.7a4.7 4.7 0 0 1 8.8 3.1Z",
        truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19h.1M18 19h.1",
        bag: "M5 8h14l-1 12H6zM8 8a4 4 0 0 1 8 0",
        shield: "M12 3 5 6v5c0 4.5 3 8.2 7 10 4-1.8 7-5.5 7-10V6zM9 12l2 2 4-4",
        return: "M9 7H5v4M5 11a7 7 0 1 0 2-5",
    };

    return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
            <path
                d={paths[type]}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

function CheckBox({ checked = true }: { checked?: boolean }) {
    return (
        <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded border text-xs font-black ${
                checked
                    ? "border-shop-primary bg-shop-primary text-white"
                    : "border-gray-300 bg-white text-transparent"
            }`}
        >
            ✓
        </span>
    );
}

function QuantitySelector({ item, small = false }: { item: CartItem; small?: boolean }) {
    const containerClass = small
        ? "inline-grid h-6 grid-cols-3 overflow-hidden rounded-md border border-gray-200 bg-white text-[11px] font-black text-shop-text"
        : "inline-grid h-9 grid-cols-3 overflow-hidden rounded-lg border border-gray-200 bg-white text-sm font-black text-shop-text";
        
    const btnClass = small ? "grid w-6 place-items-center transition hover:bg-red-50" : "grid w-9 place-items-center transition hover:bg-red-50";
    const spanClass = small ? "grid w-6 place-items-center border-x border-gray-200" : "grid w-10 place-items-center border-x border-gray-200";

    return (
        <div className={containerClass}>
            <button
                type="button"
                onClick={() => updateCartItemQuantity(item.productId, item.quantity - 1)}
                className={`${btnClass} text-gray-500 hover:text-shop-primary`}
            >
                -
            </button>
            <span className={spanClass}>
                {item.quantity}
            </span>
            <button
                type="button"
                onClick={() => updateCartItemQuantity(item.productId, item.quantity + 1)}
                className={`${btnClass} text-shop-text hover:text-shop-primary`}
            >
                +
            </button>
        </div>
    );
}

function CartItemRow({ item }: { item: CartItem }) {
    return (
        <div className="border-t border-gray-100 px-3 py-4 md:grid md:grid-cols-[28px_120px_1fr_140px_150px] md:items-center md:gap-5 md:px-5">
            <div className="hidden md:flex">
                <CheckBox />
            </div>

            <div className="grid grid-cols-[22px_96px_minmax(0,1fr)] gap-3 md:contents">
                <div className="flex items-center justify-center md:hidden">
                    <CheckBox />
                </div>

                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt=""
                        className="h-24 w-24 rounded-xl object-cover md:h-[130px] md:w-[120px]"
                    />
                ) : (
                    <div className="grid h-24 w-24 place-items-center rounded-xl bg-shop-light text-shop-primary md:h-[130px] md:w-[120px]">
                        <SimpleIcon type="bag" />
                    </div>
                )}

                <div className="min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="line-clamp-1 text-sm font-black leading-snug text-shop-text md:text-lg">
                                {item.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => removeCartItem(item.productId)}
                                className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-gray-400 hover:bg-red-50 hover:text-shop-primary transition md:hidden"
                                aria-label="Remove"
                            >
                                <SimpleIcon type="trash" className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-[11px] font-semibold text-gray-500 md:text-sm">
                            {item.detail}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 md:hidden">
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-600">
                                {item.variant ?? "1 ຊິ້ນ"}
                            </span>
                            <span className="text-[10px] font-black text-green-600 flex items-center gap-0.5">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                ພ້ອມສົ່ງ
                            </span>
                        </div>
                        <div className="mt-1 hidden md:flex">
                            <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-bold text-gray-600">
                                {item.variant ?? "1 ຊິ້ນ"}
                            </span>
                        </div>
                        {/* Desktop Price */}
                        <p className="mt-1.5 hidden text-base font-black text-shop-primary md:block">
                            {formatPrice(item.price)}
                        </p>
                        {/* Mobile Price & Quantity Selector */}
                        <div className="mt-2 flex items-center justify-between gap-2 md:hidden">
                            <span className="text-xs font-black text-shop-primary sm:text-sm">
                                {formatPrice(item.price)}
                            </span>
                            <QuantitySelector item={item} small />
                        </div>
                        <p className="mt-1.5 hidden items-center gap-1 text-xs font-black text-green-600 md:flex">
                            <span className="grid h-4 w-4 place-items-center rounded-full bg-green-100">
                                ✓
                            </span>
                            ພ້ອມສົ່ງ
                        </p>
                    </div>
                </div>
            </div>

            <div className="hidden justify-self-center md:block">
                <QuantitySelector item={item} />
            </div>
            <div className="hidden items-center justify-end gap-4 md:flex">
                <span className="text-right text-lg font-black text-shop-primary">
                    {formatPrice(item.price * item.quantity)}
                </span>
                <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-red-50 hover:text-shop-primary"
                    aria-label="Favorite"
                >
                    <SimpleIcon type="heart" />
                </button>
                <button
                    type="button"
                    onClick={() => removeCartItem(item.productId)}
                    className="grid h-10 w-10 place-items-center rounded-full text-gray-600 hover:bg-red-50 hover:text-shop-primary"
                    aria-label="Remove"
                >
                    <SimpleIcon type="trash" />
                </button>
            </div>
        </div>
    );
}

function StoreGroup({ store, items }: { store: string; items: CartItem[] }) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const first = items[0];

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(51,51,51,0.04)]">
            <div className="flex items-center justify-between gap-2 px-3 py-3 md:gap-3 md:px-5 md:py-4">
                <div className="flex min-w-0 items-center gap-2 md:gap-3">
                    {first.storeImage ? (
                        <img
                            src={first.storeImage}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                        />
                    ) : (
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-shop-light text-shop-primary">
                            <SimpleIcon type="bag" />
                        </span>
                    )}
                    <h2 className="min-w-0 truncate text-base font-black text-shop-text md:text-xl">
                        {store}
                    </h2>
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-xs font-bold text-gray-600 md:gap-2 md:text-sm">
                    <SimpleIcon type="truck" />
                    <span>{first.delivery ?? "ຈັດສົ່ງໃນ 1-2 ວັນ"}</span>
                </div>
            </div>

            {items.map((item) => (
                <CartItemRow key={item.productId} item={item} />
            ))}

            <div className="m-3 flex items-center justify-between rounded-xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm font-black md:m-4 md:text-base">
                <span className="flex items-center gap-2 text-shop-text">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-shop-primary">
                        <SimpleIcon type="truck" />
                    </span>
                    ຍອດລວມຂອງຮ້ານນີ້ ({items.length} ຊິ້ນ)
                </span>
                <span className="text-shop-primary">{formatPrice(total)}</span>
            </div>
        </section>
    );
}

function ServicePanel() {
    const services = [
        { title: "ຂອງແທ້ 100%", text: "ຮັບປະກັນສິນຄ້າທຸກຊິ້ນ", icon: "shield" },
        { title: "ຈັດສົ່ງໄວ", text: "ສົ່ງໃນ 1-2 ວັນ", icon: "truck" },
        { title: "ຄືນສິນຄ້າໄດ້", text: "ພາຍໃນ 7 ວັນ", icon: "return" },
    ] as const;

    return (
        <div className="grid grid-cols-3 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_10px_28px_rgba(51,51,51,0.04)] lg:grid-cols-1">
            {services.map((service) => (
                <div key={service.title} className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-shop-light text-shop-primary">
                        <SimpleIcon type={service.icon} />
                    </span>
                    <div>
                        <p className="text-sm font-black text-shop-text">{service.title}</p>
                        <p className="text-xs font-semibold text-gray-500">{service.text}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function CartSummaryCard({
    subtotal,
    count,
    onCheckout,
}: {
    subtotal: number;
    count: number;
    onCheckout: () => void;
}) {
    return (
        <aside className="hidden space-y-4 lg:block">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_10px_30px_rgba(51,51,51,0.05)]">
                <h2 className="text-2xl font-black text-shop-text">ສະຫຼຸບການສັ່ງຊື້</h2>
                <div className="mt-6 space-y-4 text-sm font-bold text-gray-600">
                    <div className="flex justify-between">
                        <span>ລວມສິນຄ້າ ({count} ຊິ້ນ)</span>
                        <span className="text-shop-text">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>ສ່ວນຫຼຸດ</span>
                        <span className="text-shop-primary">- {formatPrice(0)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>ຄູປອງສ່ວນຫຼຸດ</span>
                        <button type="button" className="font-black text-shop-primary">
                            ໃຊ້ຄູປອງ
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
                    <span className="font-black text-shop-text">ຍອດລວມທັງໝົດ</span>
                    <span className="text-3xl font-black text-shop-primary">
                        {formatPrice(subtotal)}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onCheckout}
                    className="mt-6 h-14 w-full rounded-xl bg-shop-primary text-base font-black text-white shadow-[0_14px_28px_rgba(229,57,53,0.18)] hover:bg-shop-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={count === 0}
                >
                    ສັ່ງຊື້ທັງໝົດ ({count})
                </button>
            </div>

            <ServicePanel />
        </aside>
    );
}

function MobileCartHeader({ count }: { count: number }) {
    const handleBack = () => {
        const prevPath = sessionStorage.getItem("prevPath");
        if (prevPath) {
            window.location.hash = prevPath;
        } else {
            window.location.hash = "#/";
        }
    };

    return (
        <header className="sticky top-0 z-40 border-b border-red-100 bg-white/95 px-4 py-4 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur md:hidden">
            <div className="mx-auto flex max-w-3xl items-center gap-3">
                <button
                    type="button"
                    onClick={handleBack}
                    className="grid h-10 w-10 place-items-center rounded-full text-shop-text hover:bg-shop-light"
                    aria-label="Back"
                >
                    <BackIcon />
                </button>
                <div>
                    <h1 className="text-lg font-black md:text-2xl">
                        ກະຕ່າຂອງຂ້ອຍ ({count})
                    </h1>
                    <p className="text-xs font-semibold text-gray-500 md:text-sm">
                        ກວດສອບລາຍການກ່ອນສັ່ງຊື້
                    </p>
                </div>
            </div>
        </header>
    );
}

function CheckoutBar({
    subtotal,
    count,
    onCheckout,
}: {
    subtotal: number;
    count: number;
    onCheckout: () => void;
}) {
    return (
        <div className="fixed inset-x-4 bottom-4 z-[130] rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_14px_40px_rgba(51,51,51,0.16)] md:inset-x-8">
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                <label className="flex items-center gap-3 text-sm font-black text-shop-text">
                    <CheckBox checked={false} />
                    <span className="hidden sm:inline">ເລືອກທັງໝົດ ({count})</span>
                </label>
                <div className="text-right">
                    <span className="mr-2 text-sm font-black text-shop-text">ລວມ</span>
                    <span className="text-2xl font-black text-shop-primary">
                        {formatPrice(subtotal)}
                    </span>
                </div>
                <button
                    type="button"
                    onClick={onCheckout}
                    className="h-14 rounded-xl bg-shop-primary px-5 text-sm font-black text-white shadow-[0_14px_28px_rgba(229,57,53,0.18)] sm:min-w-64 sm:text-base"
                >
                    ສັ່ງຊື້ທັງໝົດ ({count})
                </button>
            </div>
        </div>
    );
}

export function CartPage() {
    const cartItems = useCartItems();
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = getCartSubtotal(cartItems);
    const groupedStores = Array.from(new Set(cartItems.map((item) => item.storeName))).map((store) => ({
        store,
        items: cartItems.filter((item) => item.storeName === store),
    }));

    const handleCheckout = () => {
        if (cartItems.length === 0) {
            return;
        }

        window.location.hash = "#/checkout";
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-32 text-shop-text">
            <MobileCartHeader count={count} />

            <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-10 lg:px-8">
                <div className="mb-6 hidden items-end justify-between gap-4 md:flex">
                    <div>
                        <h1 className="text-3xl font-black text-shop-text">
                            ກະຕ່າຂອງຂ້ອຍ ({count})
                        </h1>
                        <p className="mt-2 text-sm font-semibold text-gray-500">
                            ກວດສອບລາຍການສິນຄ້າ ແລະ ດຳເນີນການສັ່ງຊື້ໄດ້ເລີຍ
                        </p>
                    </div>
                </div>

                {count > 0 ? (
                    <div className="mb-4 flex items-center gap-3 md:hidden">
                        <CheckBox />
                        <span className="text-base font-black text-gray-600">
                            ເລືອກສິນຄ້າທັງໝົດ
                        </span>
                    </div>
                ) : null}

                <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-5">
                        {groupedStores.length > 0 ? (
                            groupedStores.map((group) => (
                                <StoreGroup key={group.store} store={group.store} items={group.items} />
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed border-red-100 bg-white px-6 py-12 text-center shadow-[0_10px_30px_rgba(51,51,51,0.04)]">
                                <p className="text-xl font-black text-shop-text">ກະຕ່າຍັງວ່າງຢູ່</p>
                                <p className="mt-2 text-sm font-semibold text-gray-500">
                                    ໄປເລືອກສິນຄ້າທີ່ມັກ ແລ້ວເພີ່ມລົງກະຕ່າໄດ້ເລີຍ
                                </p>
                                <a
                                    href="#/products"
                                    className="mt-5 inline-flex h-12 items-center justify-center rounded-xl bg-shop-primary px-6 text-sm font-black text-white"
                                >
                                    ໄປໜ້າສິນຄ້າ
                                </a>
                            </div>
                        )}
                        {count > 0 ? (
                            <div className="lg:hidden">
                                <ServicePanel />
                            </div>
                        ) : null}
                    </div>
                    <CartSummaryCard subtotal={subtotal} count={count} onCheckout={handleCheckout} />
                </div>
            </div>

            {count > 0 ? (
                <CheckoutBar subtotal={subtotal} count={count} onCheckout={handleCheckout} />
            ) : null}
        </main>
    );
}
