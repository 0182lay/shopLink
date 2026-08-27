import { useEffect, useRef, useState } from "react";
import { getAuthUser, logout } from "../../../lib/auth";
import { CartPreview } from "../CartPreview";
import { CircleIcon } from "./icons";

const text = {
    login: "\u0ec0\u0e82\u0ebb\u0ec9\u0eb2\u0ea5\u0eb0\u0e9a\u0ebb\u0e9a",
    profile: "\u0ec2\u0e9b\u0ea3\u0ec4\u0e9f\u0ea5\u0ecc\u0e82\u0ead\u0e87\u0e82\u0ec9\u0ead\u0e8d",
    myOrders: "\u0e84\u0eb3\u0eaa\u0eb1\u0ec8\u0e87\u0e8a\u0eb7\u0ec9\u0e82\u0ead\u0e87\u0e82\u0ec9\u0ead\u0e8d",
    logout: "\u0ead\u0ead\u0e81\u0e88\u0eb2\u0e81\u0ea5\u0eb0\u0e9a\u0ebb\u0e9a",
};

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function OrdersIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M7 4h10v16l-2-1-2 1-2-1-2 1-2-1zM9 8h6M9 12h6M9 16h4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
                d="M10 6H6v12h4M14 8l4 4-4 4M8 12h10"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    );
}

export function HeaderActions() {
    const [user, setUser] = useState(() => getAuthUser());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const syncUser = () => setUser(getAuthUser());

        window.addEventListener("auth:changed", syncUser);
        window.addEventListener("storage", syncUser);

        return () => {
            window.removeEventListener("auth:changed", syncUser);
            window.removeEventListener("storage", syncUser);
        };
    }, []);

    useEffect(() => {
        const handlePointerDown = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener("mousedown", handlePointerDown);
        return () => window.removeEventListener("mousedown", handlePointerDown);
    }, []);

    const displayName = user?.name?.trim().split(/\s+/)[0] ?? text.login;

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        window.location.assign("#home");
    };

    return (
        <div className="flex shrink-0 items-center justify-end gap-2 text-shop-text">
            <button
                type="button"
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-shop-light"
                aria-label="Messages"
            >
                <CircleIcon type="chat" />
            </button>
            <CartPreview />

            {user ? (
                <div ref={menuRef} className="relative hidden sm:block">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen((value) => !value)}
                        className="flex min-w-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-shop-light"
                        aria-expanded={isMenuOpen}
                        aria-haspopup="menu"
                    >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-shop-light text-shop-primary">
                            <span className="text-xs font-black">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        </span>
                        <span className="max-w-24 truncate">{displayName}</span>
                        <svg
                            viewBox="0 0 24 24"
                            className={`h-4 w-4 transition ${
                                isMenuOpen ? "rotate-180" : ""
                            }`}
                            aria-hidden="true"
                        >
                            <path
                                d="m6 9 6 6 6-6"
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>

                    {isMenuOpen ? (
                        <div
                            className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-red-100 bg-white shadow-[0_18px_45px_rgba(51,51,51,0.14)]"
                            role="menu"
                        >
                            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                                <div className="grid h-11 w-11 place-items-center rounded-full bg-shop-primary text-lg font-black text-white">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-black text-shop-text">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs font-medium text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <a
                                href="#/account"
                                onClick={closeMenu}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-shop-text transition hover:bg-shop-light"
                                role="menuitem"
                            >
                                <UserIcon />
                                {text.profile}
                            </a>

                            <a
                                href="#/orders"
                                onClick={closeMenu}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold text-shop-text transition hover:bg-shop-light"
                                role="menuitem"
                            >
                                <OrdersIcon />
                                {text.myOrders}
                            </a>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 border-t border-gray-100 px-4 py-3 text-left text-sm font-bold text-shop-primary transition hover:bg-shop-light"
                                role="menuitem"
                            >
                                <LogoutIcon />
                                {text.logout}
                            </button>
                        </div>
                    ) : null}
                </div>
            ) : (
                <a
                    href="#/login"
                    className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition hover:bg-shop-light sm:flex"
                >
                    <CircleIcon type="user" />
                    {text.login}
                </a>
            )}
        </div>
    );
}
