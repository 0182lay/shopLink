import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { clearCart, getCartSubtotal, useCartItems } from "../lib/cart";
import { createOrdersFromCart } from "../lib/orders";
import { api } from "../lib/api";

const WHATSAPP_PHONE =
    import.meta.env.VITE_WHATSAPP_PHONE?.replace(/\D/g, "") ?? "8562091319983";
const MESSENGER_URL = import.meta.env.VITE_MESSENGER_URL ?? "https://m.me/";

type SendChannel = "whatsapp" | "messenger";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(price);

function navigateTo(hash: string) {
    window.location.assign(hash);
}

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

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
        >
            <path
                d="m6 9 6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
            />
        </svg>
    );
}

function LineIcon({ type }: { type: "user" | "pin" | "truck" | "note" | "cart" | "lock" }) {
    const paths = {
        user: "M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10",
        pin: "M12 21s7-5.2 7-11a7 7 0 0 0-14 0c0 5.8 7 11 7 11zM12 10h.1",
        truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19h.1M18 19h.1",
        note: "M6 4h12v16H6zM9 8h6M9 12h6M9 16h4",
        cart: "M4 5h2l2 11h9l2-8H7M10 20h.1M17 20h.1",
        lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
    };

    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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

function WhatsAppIcon() {
    return (
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                    d="M12 3.5A8.5 8.5 0 0 0 4.7 16.4L4 20l3.7-.7A8.5 8.5 0 1 0 12 3.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                />
                <path
                    d="M9 8.8c.2 3 2.5 5.3 5.2 6 .8.2 1.6-.7 1.8-1.4l-1.7-.9-.9.7c-1.2-.6-2-1.4-2.5-2.5l.6-.9-.9-1.6c-.8.1-1.5.3-1.6.6Z"
                    fill="currentColor"
                />
            </svg>
        </span>
    );
}

function MessengerIcon() {
    return (
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#168AFF] text-white">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                    d="M12 4C7 4 3 7.7 3 12.2c0 2.6 1.4 4.9 3.5 6.4V22l3.2-1.8c.7.2 1.5.3 2.3.3 5 0 9-3.7 9-8.2S17 4 12 4Z"
                    fill="currentColor"
                />
                <path
                    d="m7.5 14 3-3 2.2 2.2 3.8-3.2-3 4-2.3-2.1L7.5 14Z"
                    fill="white"
                />
            </svg>
        </span>
    );
}

function StepIndicator() {
    const steps = ["ຂໍ້ມູນຜູ້ຮັບ", "ກວດລາຍການ", "ສົ່ງອໍເດີ້"];

    return (
        <div className="grid grid-cols-3 gap-2">
            {steps.map((step, index) => (
                <div key={step} className="flex items-center gap-2">
                    <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-black ${
                            index === 0
                                ? "bg-shop-primary text-white"
                                : "bg-gray-100 text-gray-500"
                        }`}
                    >
                        {index + 1}
                    </span>
                    <span
                        className={`hidden text-xs font-black sm:inline ${
                            index === 0 ? "text-shop-primary" : "text-gray-500"
                        }`}
                    >
                        {step}
                    </span>
                </div>
            ))}
        </div>
    );
}

function FieldLabel({ children }: { children: ReactNode }) {
    return <label className="text-xs font-black text-shop-text">{children}</label>;
}

function Section({
    icon,
    title,
    children,
}: {
    icon: ReactNode;
    title: string;
    children: ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_8px_24px_rgba(51,51,51,0.04)]">
            <div className="mb-4 flex items-center gap-2 text-shop-text">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-shop-light text-shop-primary">
                    {icon}
                </span>
                <h2 className="text-base font-black">{title}</h2>
            </div>
            {children}
        </section>
    );
}

export function CheckoutPage() {
    const cartItems = useCartItems();
    const subtotal = getCartSubtotal(cartItems);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const [sendChannel, setSendChannel] = useState<SendChannel>("whatsapp");
    const [isSummaryOpen, setIsSummaryOpen] = useState(true);
    const [form, setForm] = useState({
        name: "",
        phone: "",
        province: "",
        district: "",
        village: "",
        address: "",
        note: "",
        shipping: "",
    });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const groupedStores = useMemo(
        () =>
            Array.from(new Set(cartItems.map((item) => item.storeName))).map((store) => ({
                store,
                items: cartItems.filter((item) => item.storeName === store),
            })),
        [cartItems],
    );

    const updateForm = (field: keyof typeof form, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setError("");
    };

    const buildOrderMessage = () => {
        const lines = [
            "RubyStores - ຄຳສັ່ງຊື້ໃໝ່",
            "",
            `ຊື່: ${form.name}`,
            `ເບີໂທ: ${form.phone}`,
            `ແຂວງ: ${form.province}`,
            `ເມືອງ: ${form.district}`,
            `ບ້ານ: ${form.village}`,
            `ທີ່ຢູ່ລະອຽດ: ${form.address}`,
            `ການຈັດສົ່ງ: ${form.shipping}`,
            form.note ? `ໝາຍເຫດ: ${form.note}` : "",
            "",
            "ລາຍການສິນຄ້າ:",
            ...cartItems.map(
                (item) =>
                    `- ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`,
            ),
            "",
            `ລວມທັງໝົດ: ${formatPrice(subtotal)}`,
        ].filter(Boolean);

        return lines.join("\n");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (cartItems.length === 0) {
            navigateTo("#/cart");
            return;
        }

        if (
            !form.name.trim() ||
            !form.phone.trim() ||
            !form.province.trim() ||
            !form.district.trim() ||
            !form.village.trim() ||
            !form.address.trim() ||
            !form.shipping.trim()
        ) {
            setError("ກະລຸນາກອກຂໍ້ມູນຜູ້ຮັບ, ທີ່ຢູ່ ແລະ ການຈັດສົ່ງໃຫ້ຄົບ");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // Group cart items by store to create separate orders on the backend
            const storeIds = Array.from(new Set(cartItems.map((item) => item.storeId)));
            
            const orderPromises = storeIds.map((storeId) => {
                const storeItems = cartItems.filter((item) => item.storeId === storeId);
                const addressString = `${form.province}, ${form.district}, ${form.village}, ${form.address} (${form.shipping})`;
                
                return api.createOrder({
                    storeId,
                    customerName: form.name.trim(),
                    customerPhone: form.phone.trim(),
                    customerAddress: addressString,
                    note: form.note.trim() || null,
                    deliveryFee: 0,
                    orderChannel: sendChannel === "whatsapp" ? "WHATSAPP" : "MESSENGER",
                    items: storeItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                });
            });

            // Create orders on backend
            const orderResponses = await Promise.all(orderPromises);
            
            // Also write to local storage as fallback/history
            createOrdersFromCart(cartItems, {
                name: form.name,
                phone: form.phone,
                province: form.province,
                district: form.district,
                village: form.village,
                address: form.address,
                note: form.note,
                shipping: form.shipping,
            });
            
            clearCart();

            // Open the WhatsApp/Messenger link returned by the backend (for the first order)
            const firstLinks = orderResponses[0]?.messageLinks;
            
            let targetUrl = sendChannel === "whatsapp" 
                ? firstLinks?.whatsapp 
                : firstLinks?.messenger;

            // Fallback to client-generated URL if backend doesn't provide one
            if (!targetUrl) {
                const message = encodeURIComponent(buildOrderMessage());
                targetUrl = sendChannel === "whatsapp"
                    ? `https://wa.me/${WHATSAPP_PHONE}?text=${message}`
                    : `${MESSENGER_URL}${MESSENGER_URL.includes("?") ? "&" : "?"}text=${message}`;
            }

            if (targetUrl) {
                window.open(targetUrl, "_blank");
            }
            navigateTo("#/orders");
        } catch (err) {
            console.error("Order creation failed:", err);
            setError(err instanceof Error ? err.message : "ເກີດຂໍ້ຜິດພາດໃນການສ້າງຄຳສັ່ງຊື້ ກະລຸນາລອງໃໝ່");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-[#fffafa] to-[#fff4f1] pb-10 text-shop-text">
            <header className="sticky top-0 z-40 border-b border-red-100 bg-white/95 px-4 py-4 shadow-[0_8px_24px_rgba(51,51,51,0.04)] backdrop-blur">
                <div className="mx-auto flex max-w-3xl items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigateTo("#/cart")}
                        className="grid h-10 w-10 place-items-center rounded-full text-shop-text hover:bg-shop-light"
                        aria-label="Back to cart"
                    >
                        <BackIcon />
                    </button>
                    <div>
                        <h1 className="text-lg font-black md:text-2xl">
                            ກອກຂໍ້ມູນສຳລັບການສັ່ງຊື້
                        </h1>
                        <p className="text-xs font-semibold text-gray-500 md:text-sm">
                            ເລືອກຊ່ອງທາງສົ່ງອໍເດີ້ໄປຫາຮ້ານ
                        </p>
                    </div>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="mx-auto mt-5 max-w-3xl space-y-4 px-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <StepIndicator />
                </div>

                {error ? (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-black text-shop-primary">
                        {error}
                    </div>
                ) : null}

                <Section icon={<LineIcon type="user" />} title="ຂໍ້ມູນຜູ້ຮັບ">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <FieldLabel>ຊື່-ນາມສະກຸນ *</FieldLabel>
                            <input
                                value={form.name}
                                onChange={(event) => updateForm("name", event.target.value)}
                                className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                                placeholder="ເຊັ່ນ ນາງ ແກ້ວ"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>ເບີໂທລະສັບ *</FieldLabel>
                            <input
                                value={form.phone}
                                onChange={(event) => updateForm("phone", event.target.value)}
                                className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                                placeholder="020xxxxxxxx"
                            />
                        </div>
                    </div>
                </Section>

                <Section icon={<LineIcon type="pin" />} title="ທີ່ຢູ່ສຳລັບຈັດສົ່ງ">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <FieldLabel>ແຂວງ *</FieldLabel>
                            <input
                                value={form.province}
                                onChange={(event) => updateForm("province", event.target.value)}
                                className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                                placeholder="ເຊັ່ນ ຈຳປາສັກ"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <FieldLabel>ເມືອງ *</FieldLabel>
                            <input
                                value={form.district}
                                onChange={(event) => updateForm("district", event.target.value)}
                                className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                                placeholder="ເຊັ່ນ ເມືອງປາກເຊ"
                            />
                        </div>
                    </div>
                    <div className="mt-3 space-y-1.5">
                        <FieldLabel>ບ້ານ *</FieldLabel>
                        <input
                            value={form.village}
                            onChange={(event) => updateForm("village", event.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                            placeholder="ເຊັ່ນ ບ້ານໂພນສະອາດ"
                        />
                    </div>
                    <div className="mt-3 space-y-1.5">
                        <FieldLabel>ທີ່ຢູ່ລະອຽດ *</FieldLabel>
                        <input
                            value={form.address}
                            onChange={(event) => updateForm("address", event.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                            placeholder="ເຮືອນເລກທີ, ຖະໜົນ, ຈຸດສັງເກດ"
                        />
                    </div>
                </Section>

                <Section icon={<LineIcon type="truck" />} title="ການຈັດສົ່ງ">
                    <div className="space-y-1.5">
                        <FieldLabel>ວິທີຈັດສົ່ງ *</FieldLabel>
                        <input
                            value={form.shipping}
                            onChange={(event) => updateForm("shipping", event.target.value)}
                            className="h-12 w-full rounded-xl border border-gray-200 px-3 text-sm font-semibold outline-none focus:border-shop-primary"
                            placeholder="ເຊັ່ນ ຈັດສົ່ງດ່ວນ, ຂົນສົ່ງທົ່ວໄປ, ຮັບເອງທີ່ຮ້ານ"
                        />
                    </div>
                </Section>

                <Section icon={<LineIcon type="note" />} title="ໝາຍເຫດສຳລັບຮ້ານຄ້າ">
                    <textarea
                        value={form.note}
                        onChange={(event) => updateForm("note", event.target.value)}
                        className="min-h-24 w-full resize-none rounded-xl border border-gray-200 px-3 py-3 text-sm font-semibold outline-none focus:border-shop-primary"
                        placeholder="ເຊັ່ນ ຝາກວາງໄວ້ໜ້າບ້ານ..."
                        maxLength={150}
                    />
                    <p className="mt-1 text-right text-xs font-semibold text-gray-400">
                        {form.note.length}/150
                    </p>
                </Section>

                <section className="sticky bottom-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-[0_14px_40px_rgba(51,51,51,0.16)]">
                    <button
                        type="button"
                        onClick={() => setIsSummaryOpen((value) => !value)}
                        className="flex w-full items-center justify-between gap-3 text-left"
                        aria-expanded={isSummaryOpen}
                    >
                        <span className="flex min-w-0 items-center gap-2 text-sm font-black text-shop-text">
                            <span className="text-shop-primary">
                                <LineIcon type="cart" />
                            </span>
                            <span className="truncate">ສະຫຼຸບຄຳສັ່ງຊື້</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2 text-xs font-bold text-gray-500">
                            {!isSummaryOpen && (
                                <span className="text-shop-primary font-black mr-1">
                                    {formatPrice(subtotal)}
                                </span>
                            )}
                            {groupedStores.length} ຮ້ານ / {count} ຊິ້ນ
                            <ChevronIcon open={isSummaryOpen} />
                        </span>
                    </button>

                    {isSummaryOpen && (
                        <>
                            <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
                                {groupedStores.map((group) => (
                                    <div
                                        key={group.store}
                                        className="flex justify-between gap-3 text-xs font-bold text-gray-600"
                                    >
                                        <span className="truncate">
                                            {group.store} ({group.items.length} ລາຍການ)
                                        </span>
                                        <span className="shrink-0">
                                            {formatPrice(
                                                group.items.reduce(
                                                    (sum, item) => sum + item.price * item.quantity,
                                                    0,
                                                ),
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-sm font-black text-shop-text">ລວມທັງໝົດ</span>
                                <span className="text-lg font-black text-shop-primary">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setSendChannel("whatsapp")}
                                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                                        sendChannel === "whatsapp"
                                            ? "border-shop-primary bg-red-50/40"
                                            : "border-gray-200 bg-white hover:border-red-200"
                                    }`}
                                >
                                    <WhatsAppIcon />
                                    <span>
                                        <span className="block text-sm font-black text-shop-text">WhatsApp</span>
                                        <span className="text-xs font-semibold text-gray-500">
                                            ສົ່ງຜ່ານ WhatsApp
                                        </span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSendChannel("messenger")}
                                    className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                                        sendChannel === "messenger"
                                            ? "border-shop-primary bg-red-50/40"
                                            : "border-gray-200 bg-white hover:border-red-200"
                                    }`}
                                >
                                    <MessengerIcon />
                                    <span>
                                        <span className="block text-sm font-black text-shop-text">Messenger</span>
                                        <span className="text-xs font-semibold text-gray-500">
                                            ສົ່ງຜ່ານ Messenger
                                        </span>
                                    </span>
                                </button>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="mt-3 h-12 w-full rounded-xl bg-shop-primary text-sm font-black text-white shadow-[0_14px_28px_rgba(229,57,53,0.18)] hover:bg-shop-secondary disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={cartItems.length === 0 || isSubmitting}
                    >
                        {isSubmitting
                            ? "ກຳລັງສົ່ງຄຳສັ່ງຊື້..."
                            : `ສົ່ງຄຳສັ່ງຊື້ຜ່ານ ${sendChannel === "whatsapp" ? "WhatsApp" : "Messenger"}`}
                    </button>
                    {isSummaryOpen ? (
                        <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-400">
                            <LineIcon type="lock" />
                            ຂໍ້ມູນຂອງທ່ານຈະສົ່ງໄປຫາຮ້านເທົ່ານັ້ນ
                        </p>
                    ) : null}
                </section>
            </form>
        </main>
    );
}
