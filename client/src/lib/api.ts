import { getAuthToken } from "./auth";
import type { Store } from "../types/store";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ??
  (import.meta.env.DEV
    ? "http://localhost:10000"
    : "https://shoplink-api-4wwu.onrender.com");

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  service?: string;
  status?: string;
};

type CacheEntry<T> = {
  expiresAt: number;
  value: ApiResponse<T>;
};

const DEFAULT_CACHE_TTL_MS = 60_000;
const responseCache = new Map<string, CacheEntry<unknown>>();
const pendingRequests = new Map<string, Promise<ApiResponse<unknown>>>();

export type Product = {
  id: number;
  storeId: number;
  categoryId?: number | null;
  name: string;
  description?: string | null;
  price: string | number;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  isFeatured?: boolean;
};

export type Category = {
  id: number;
  storeId: number;
  name: string;
  slug: string;
  iconUrl?: string | null;
  isActive: boolean;
  createdAt?: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

export type AuthResponse = ApiResponse<AuthUser> & {
  token?: string;
};

export type UploadedImage = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

export type BackendOrderItem = {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImageUrl?: string | null;
  price: string | number;
  quantity: number;
  subtotal: string | number;
};

export type BackendOrder = {
  id: number;
  storeId: number;
  userId?: number | null;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  note?: string | null;
  totalPrice: string | number;
  deliveryFee: string | number;
  status: "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  orderChannel: "WHATSAPP" | "MESSENGER" | "MANUAL";
  createdAt: string;
  store?: Store;
  items?: BackendOrderItem[];
};

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? `Request failed: ${response.status}`);
  }

  if (payload.data === undefined) {
    throw new Error("API response has no data");
  }

  return payload.data;
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};

  if (!(init?.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (init?.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(init.headers)) {
      init.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, init.headers);
    }
  }

  if (token) {
    headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    ...init,
    headers,
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? `Request failed: ${response.status}`);
  }

  return payload;
}

async function cachedRequest<T>(
  path: string,
  ttlMs = DEFAULT_CACHE_TTL_MS,
): Promise<ApiResponse<T>> {
  const cacheKey = `GET:${path}`;
  const cached = responseCache.get(cacheKey) as CacheEntry<T> | undefined;

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value;
  }

  const pending = pendingRequests.get(cacheKey) as
    | Promise<ApiResponse<T>>
    | undefined;

  if (pending) {
    return pending;
  }

  const promise = request<T>(path)
    .then((value) => {
      responseCache.set(cacheKey, {
        expiresAt: Date.now() + ttlMs,
        value,
      });

      return value;
    })
    .finally(() => {
      pendingRequests.delete(cacheKey);
    });

  pendingRequests.set(cacheKey, promise as Promise<ApiResponse<unknown>>);

  return promise;
}

export const api = {
  baseUrl: API_BASE_URL,
  health: () => request<never>("/health"),
  categories: () => cachedRequest<Category[]>("/categories"),
  products: () => cachedRequest<Product[]>("/products"),
  product: (id: number | string) => cachedRequest<Product>(`/products/${id}`),
  featuredProducts: () => cachedRequest<Product[]>("/products/featured"),
  stores: () => cachedRequest<Store[]>("/stores"),
  register: (payload: Required<AuthPayload>) =>
    request<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<AuthResponse>,
  login: (payload: AuthPayload) =>
    request<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }) as Promise<AuthResponse>,

  // Admin CRUD for Stores
  createStore: (data: Partial<Store>) =>
    request<Store>("/stores", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateStore: (id: number, data: Partial<Store>) =>
    request<Store>(`/stores/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteStore: (id: number) =>
    request<never>(`/stores/${id}`, {
      method: "DELETE",
    }),

  // Admin CRUD for Categories
  createCategory: (data: Partial<Category>) =>
    request<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateCategory: (id: number, data: Partial<Category>) =>
    request<Category>(`/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: number) =>
    request<never>(`/categories/${id}`, {
      method: "DELETE",
    }),

  // Admin CRUD for Products
  createProduct: (data: Partial<Product>) =>
    request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProduct: (id: number, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteProduct: (id: number) =>
    request<never>(`/products/${id}`, {
      method: "DELETE",
    }),

  // Admin CRUD for Orders
  orders: () => request<BackendOrder[]>("/orders"),
  updateOrderStatus: (id: number, status: string) =>
    request<BackendOrder>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  createOrder: (data: {
    storeId: number;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    note?: string | null;
    deliveryFee?: number;
    orderChannel?: "WHATSAPP" | "MESSENGER" | "MANUAL";
    items: { productId: number; quantity: number }[];
  }) =>
    request<any>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }) as Promise<ApiResponse<any> & {
      orderSummary?: string;
      messageLinks?: { whatsapp: string | null; messenger: string | null };
    }>,
  myOrders: () => request<BackendOrder[]>("/me/orders"),
  uploadImage: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append("image", file);
    if (folder) {
      formData.append("folder", folder);
    }
    return request<UploadedImage>("/uploads/image", {
      method: "POST",
      body: formData,
    });
  },
};
