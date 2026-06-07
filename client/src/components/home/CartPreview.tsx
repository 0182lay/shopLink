import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    getCartCount,
    getCartSubtotal,
    removeCartItem,
    updateCartItemQuantity,
    useCartItems,
    type CartItem,
} from "../../lib/cart";
import { CircleIcon } from "./header/icons";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("lo-LA", {
        style: "currency",
        currency: "LAK",
        maximumFractionDigits: 0,
    }).format(price);

function CloseIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
            <path
                d="m6 6 12 12M18 6 6 18"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function TrashIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.9"
            />
        </svg>
    );
}

function QuantityControl({ item }: { item: CartItem }) {
    return (
        <div className="inline-grid h-9 grid-cols-3 overflow-hidden rounded-lg border border-gray-200 bg-white text-sm font-black text-shop-text">
            <button
                type="button"
                onClick={() =>
                    updateCartItemQuantity(item.productId, item.quantity - 1)
                }
                className="grid w-9 place-items-center text-gray-500"
            >
                -
            </button>
            <span className="grid w-10 place-items-center border-x border-gray-200">
                {item.quantity}
            </span>
            <button
                type="button"
                onClick={() =>
                    updateCartItemQuantity(item.productId, item.quantity + 1)
                }
                className="grid w-9 place-items-center text-shop-text"
            >
                +
            </button>
        </div>
    );
}

function EmptyCart() {
    return (
        <div className="rounded-2xl border border-dashed border-red-100 bg-red-50/40 px-4 py-8 text-center">
            <p className="text-sm font-black text-shop-text">ກະຕ່າຍັງວ່າງຢູ່</p>
            <p className="mt-1 text-xs font-semibold text-gray-500">
                ເພີ່ມສິນຄ້າຈາກໜ້າສິນຄ້າໄດ້ເລີຍ
            </p>
        </div>
    );
}

function CartRows({
    items,
    compact = false,
}: {
    items: CartItem[];
    compact?: boolean;
}) {
    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className={compact ? "divide-y divide-gray-100" : "space-y-3"}>
            {items.slice(0, 3).map((item) => (
                <div
                    key={item.productId}
                    className={
                        compact
                            ? "grid grid-cols-[58px_1fr_auto] gap-3 py-3"
                            : "grid grid-cols-[72px_1fr_auto] gap-3 rounded-xl border border-gray-100 bg-white p-3"
                    }
                >
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt=""
                            className={
                                compact
                                    ? "h-14 w-14 rounded-lg object-cover"
                                    : "h-[72px] w-[72px] rounded-xl object-cover"
                            }
                        />
                    ) : (
                        <div
                            className={
                                compact
                                    ? "grid h-14 w-14 place-items-center rounded-lg bg-shop-light text-shop-primary"
                                    : "grid h-[72px] w-[72px] place-items-center rounded-xl bg-shop-light text-shop-primary"
                            }
                        >
                            <CircleIcon type="cart" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <h3 className="line-clamp-1 text-sm font-black text-shop-text">
                            {item.name}
                        </h3>
                        <p className="mt-0.5 line-clamp-1 text-xs font-semibold text-gray-500">
                            {item.detail}
                        </p>
                        <p className="mt-1 text-sm font-black text-shop-primary">
                            {formatPrice(item.price)}
                        </p>
                    </div>
                    {compact ? (
                        <div className="self-center text-right text-xs font-bold text-gray-500">
                            ຈຳນວນ {item.quantity}
                        </div>
                    ) : (
                        <div className="flex flex-col items-end justify-between gap-2">
                            <button
                                type="button"
                                onClick={() => removeCartItem(item.productId)}
                                className="grid h-8 w-8 place-items-center rounded-full text-gray-500 transition hover:bg-red-50 hover:text-shop-primary"
                                aria-label="Remove item"
                            >
                                <TrashIcon />
                            </button>
                            <QuantityControl item={item} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export function CartPreview() {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const sheetRef = useRef<HTMLDivElement>(null);
    const cartItems = useCartItems();
    const count = getCartCount(cartItems);
    const subtotal = getCartSubtotal(cartItems);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            const target = event.target as Node;

            if (
                rootRef.current?.contains(target) ||
                sheetRef.current?.contains(target)
            ) {
                return;
            }

            setIsOpen(false);
        };

        window.addEventListener("mousedown", handlePointerDown);
        return () => window.removeEventListener("mousedown", handlePointerDown);
    }, []);

    const mobileSheet =
        isOpen && typeof document !== "undefined"
            ? createPortal(
                  <>
                      <div
                          className="fixed inset-0 z-[130] bg-black/45 backdrop-blur-[1px] md:hidden"
                          onClick={() => setIsOpen(false)}
                      />
                      <section
                          ref={sheetRef}
                          className="fixed inset-x-2 bottom-2 z-[140] rounded-[24px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+18px)] pt-3 shadow-[0_-18px_45px_rgba(0,0,0,0.18)] md:hidden"
                      >
                          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-200" />
                          <div className="mb-4 flex items-center justify-between gap-4">
                              <h2 className="text-lg font-black text-shop-text">
                                  ກະຕ່າຂອງຂ້ອຍ ({count})
                              </h2>
                              <button
                                  type="button"
                                  onClick={() => setIsOpen(false)}
                                  className="grid h-9 w-9 place-items-center rounded-full text-shop-text transition hover:bg-red-50"
                              >
                                  <CloseIcon />
                              </button>
                          </div>
                          <div className="max-h-[52vh] overflow-y-auto pr-1">
                              <CartRows items={cartItems} />
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                              <span className="text-sm font-black text-shop-text">
                                  ລວມທັງໝົດ
                              </span>
                              <span className="text-lg font-black text-shop-primary">
                                  {formatPrice(subtotal)}
                              </span>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-3">
                              <a
                                  href="#/cart"
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex h-12 items-center justify-center rounded-2xl border border-shop-primary bg-white px-4 text-sm font-black text-shop-primary transition hover:bg-red-50"
                              >
                                  ເບິ່ງກະຕ່າ
                              </a>
                              <a
                                  href="#/cart"
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex h-12 items-center justify-center rounded-2xl bg-shop-primary px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(229,57,53,0.20)] transition hover:bg-shop-secondary"
                              >
                                  ສົ່ງອໍເດີ້
                              </a>
                          </div>
                      </section>
                  </>,
                  document.body,
              )
            : null;

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen((value) => !value)}
                className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-shop-light"
                aria-label="Cart preview"
                aria-expanded={isOpen}
            >
                <CircleIcon type="cart" />
                {count > 0 ? (
                    <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-shop-primary px-1 text-[10px] font-bold leading-none text-white">
                        {count}
                    </span>
                ) : null}
            </button>

            {isOpen ? (
                <section className="absolute right-0 top-12 z-[150] hidden w-[380px] rounded-2xl border border-red-100 bg-white px-4 pb-4 pt-4 shadow-[0_20px_55px_rgba(51,51,51,0.18)] md:block">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h2 className="text-base font-black text-shop-text">
                            ກະຕ່າຂອງຂ້ອຍ ({count})
                        </h2>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="grid h-9 w-9 place-items-center rounded-full text-shop-text transition hover:bg-red-50"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto pr-1">
                        <CartRows items={cartItems} compact />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                        <span className="text-sm font-black text-shop-text">
                            ລວມທັງໝົດ
                        </span>
                        <span className="text-lg font-black text-shop-primary">
                            {formatPrice(subtotal)}
                        </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <a
                            href="#/cart"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-shop-primary bg-white px-4 text-sm font-black text-shop-primary transition hover:bg-red-50"
                        >
                            ເບິ່ງກະຕ່າ
                        </a>
                        <a
                            href="#/cart"
                            onClick={() => setIsOpen(false)}
                            className="inline-flex h-11 items-center justify-center rounded-2xl bg-shop-primary px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(229,57,53,0.20)] transition hover:bg-shop-secondary"
                        >
                            ສົ່ງອໍເດີ້
                        </a>
                    </div>
                </section>
            ) : null}
            {mobileSheet}
        </div>
    );
}
