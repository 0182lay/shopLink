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
  const response = await fetch(`${API_BASE_URL}/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });
  const payload = (await response.json()) as ApiResponse<T>;

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message ?? `Request failed: ${response.status}`);
  }

  return payload;
}

export const api = {
  baseUrl: API_BASE_URL,
  health: () => request<never>("/health"),
  categories: () => request<Category[]>("/categories"),
  products: () => request<Product[]>("/products"),
  product: (id: number | string) => request<Product>(`/products/${id}`),
  featuredProducts: () => request<Product[]>("/products/featured"),
  stores: () => request<import("../types/store").Store[]>("/stores"),
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
};
