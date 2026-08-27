import { useSyncExternalStore } from "react";
import type { CartItem } from "./cart";

const ORDERS_KEY = "rubystores_orders";
const ORDERS_CHANGED_EVENT = "orders:changed";
const EMPTY_ORDERS: Order[] = [];

let cachedRaw: string | null | undefined;
let cachedOrders: Order[] = EMPTY_ORDERS;

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export type OrderItem = {
    productId: number;
    name: string;
    detail?: string | null;
    variant?: string;
    quantity: number;
    price: number;
    imageUrl?: string | null;
};

export type CheckoutCustomer = {
    name: string;
    phone: string;
    province: string;
    district: string;
    village: string;
    address: string;
    note?: string;
    shipping: string;
};

export type Order = {
    id: string;
    storeId: number;
    storeName: string;
    storeImage?: string | null;
    status: OrderStatus;
    createdAt: string;
    total: number;
    items: OrderItem[];
    customer?: CheckoutCustomer;
};

function notifyOrdersChanged() {
    window.dispatchEvent(new Event(ORDERS_CHANGED_EVENT));
}

function safeReadOrders(): Order[] {
    if (typeof window === "undefined") {
        return EMPTY_ORDERS;
    }

    try {
        const raw = window.localStorage.getItem(ORDERS_KEY);
        if (raw === cachedRaw) {
            return cachedOrders;
        }

        cachedRaw = raw;
        cachedOrders = raw ? (JSON.parse(raw) as Order[]) : EMPTY_ORDERS;
        return cachedOrders;
    } catch {
        cachedRaw = null;
        cachedOrders = EMPTY_ORDERS;
        return cachedOrders;
    }
}

function writeOrders(orders: Order[]) {
    const nextRaw = JSON.stringify(orders);
    cachedRaw = nextRaw;
    cachedOrders = orders;
    window.localStorage.setItem(ORDERS_KEY, nextRaw);
    notifyOrdersChanged();
}

function subscribe(callback: () => void) {
    window.addEventListener(ORDERS_CHANGED_EVENT, callback);
    window.addEventListener("storage", callback);

    return () => {
        window.removeEventListener(ORDERS_CHANGED_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}

function createOrderId(index: number) {
    const timestamp = Date.now().toString().slice(-6);
    return `RB${timestamp}${index + 1}`;
}

export function createOrdersFromCart(cartItems: CartItem[], customer?: CheckoutCustomer) {
    const groupedStoreIds = Array.from(new Set(cartItems.map((item) => item.storeId)));
    const createdAt = new Date().toISOString();

    const nextOrders = groupedStoreIds.map((storeId, index) => {
        const items = cartItems.filter((item) => item.storeId === storeId);
        const first = items[0];

        return {
            id: createOrderId(index),
            storeId,
            storeName: first.storeName,
            storeImage: first.storeImage,
            status: "pending" as const,
            createdAt,
            total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
            customer,
            items: items.map((item) => ({
                productId: item.productId,
                name: item.name,
                detail: item.detail,
                variant: item.variant,
                quantity: item.quantity,
                price: item.price,
                imageUrl: item.imageUrl,
            })),
        };
    });

    writeOrders([...nextOrders, ...safeReadOrders()]);
    return nextOrders;
}

export function getOrders() {
    return safeReadOrders();
}

export function useOrders() {
    return useSyncExternalStore(subscribe, safeReadOrders, () => EMPTY_ORDERS);
}
