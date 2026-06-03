import type { AuthUser } from "./api";

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export function saveAuthSession(
    token: string,
    user: AuthUser | undefined,
    remember: boolean,
) {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    storage.setItem(TOKEN_KEY, token);

    if (user) {
        storage.setItem(USER_KEY, JSON.stringify(user));
    }

    otherStorage.removeItem(TOKEN_KEY);
    otherStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth:changed"));
}

export function getAuthUser(): AuthUser | null {
    const rawUser =
        localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser) as AuthUser;
    } catch {
        return null;
    }
}

export function getAuthToken() {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

export function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth:changed"));
}
