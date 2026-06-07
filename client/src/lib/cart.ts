import { useSyncExternalStore } from "react";
import type { Product } from "./api";
import type { Store } from "../types/store";

const CART_KEY = "rubystores_cart";
const CART_CHANGED_EVENT = "cart:changed";
const EMPTY_CART: CartItem[] = [];

let cachedRaw: string | null | undefined;
let cachedItems: CartItem[] = EMPTY_CART;

export type CartItem = {
    productId: number;
    storeId: number;
    storeName: string;
    storeImage?: string | null;
    delivery?: string;
    name: string;
    detail?: string | null;
    variant?: string;
    price: number;
    oldPrice?: number;
    quantity: number;
    imageUrl?: string | null;
};

type AddCartItemInput = {
    product: Product;
    store?: Store;
    quantity?: number;
};

function notifyCartChanged() {
    window.dispatchEvent(new Event(CART_CHANGED_EVENT));
}

function safeReadCart(): CartItem[] {
    if (typeof window === "undefined") {
        return EMPTY_CART;
    }

    try {
        const raw = window.localStorage.getItem(CART_KEY);
        if (raw === cachedRaw) {
            return cachedItems;
        }

        cachedRaw = raw;
        cachedItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_CART;
        return cachedItems;
    } catch {
        cachedRaw = null;
        cachedItems = EMPTY_CART;
        return cachedItems;
    }
}

function writeCart(items: CartItem[]) {
    const nextRaw = JSON.stringify(items);
    cachedRaw = nextRaw;
    cachedItems = items;
    window.localStorage.setItem(CART_KEY, nextRaw);
    notifyCartChanged();
}

function subscribe(callback: () => void) {
    window.addEventListener(CART_CHANGED_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(CART_CHANGED_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

export function getCartItems() {
    return safeReadCart();
}

export function addCartItem({ product, store, quantity = 1 }: AddCartItemInput) {
    const items = safeReadCart();
    const existing = items.find((item) => item.productId === product.id);
    const safeQuantity = Math.max(1, quantity);

    if (existing) {
        writeCart(
            items.map((item) =>
                item.productId === product.id
                    ? { ...item, quantity: item.quantity + safeQuantity }
                    : item,
            ),
        );
        return;
    }

    writeCart([
        ...items,
        {
            productId: product.id,
            storeId: product.storeId,
            storeName: store?.name ?? "RubyStores",
            storeImage: store?.logoUrl,
            delivery: "ຈັດສົ່ງໃນ 1-2 ວັນ",
            name: product.name,
            detail: product.description ?? "ສິນຄ້າຄຸນນະພາບຈາກ RubyStores",
            variant: "1 ຊິ້ນ",
            price: Number(product.price),
            oldPrice: Math.round(Number(product.price) * 1.15),
            quantity: safeQuantity,
            imageUrl: product.imageUrl,
        },
    ]);
}

export function updateCartItemQuantity(productId: number, quantity: number) {
    const nextQuantity = Math.max(1, quantity);
    writeCart(
        safeReadCart().map((item) =>
            item.productId === productId
                ? { ...item, quantity: nextQuantity }
                : item,
        ),
    );
}

export function removeCartItem(productId: number) {
    writeCart(safeReadCart().filter((item) => item.productId !== productId));
}

export function useCartItems() {
    return useSyncExternalStore(subscribe, safeReadCart, () => EMPTY_CART);
}

export function getCartSubtotal(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.quantity, 0);
}
