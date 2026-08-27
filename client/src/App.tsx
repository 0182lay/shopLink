import { useEffect, useState } from "react";
import { AccountPage } from "./pages/AccountPage";
import { AdminPage } from "./pages/AdminPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { OrderHistoryPage } from "./pages/OrderHistoryPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { ProductsPage } from "./pages/ProductsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { SearchEntryPage } from "./pages/SearchEntryPage";
import { SearchPage } from "./pages/SearchPage";
import { StoresPage } from "./pages/StoresPage";

type AppRoute =
    | "home"
    | "login"
    | "register"
    | "products"
    | "product-detail"
    | "cart"
    | "checkout"
    | "orders"
    | "account"
    | "stores"
    | "search"
    | "search-entry"
    | "admin";

type AdminSection =
    | "dashboard"
    | "orders"
    | "products"
    | "stores"
    | "categories"
    | "users"
    | "settings"
    | "more";

const adminSections = new Set<AdminSection>([
    "dashboard",
    "orders",
    "products",
    "stores",
    "categories",
    "users",
    "settings",
    "more",
]);

function getProductIdFromHash() {
    const match = window.location.hash.match(/^#\/?products\/(\d+)/);
    return match ? Number(match[1]) : null;
}

function getRoute(): AppRoute {
    const hash = window.location.hash.replace(/^#\/?/, "");

    if (hash === "admin" || hash.startsWith("admin/")) {
        return "admin";
    }

    if (hash === "login") {
        return "login";
    }

    if (hash === "register") {
        return "register";
    }

    if (hash.startsWith("products/")) {
        return "product-detail";
    }

    if (hash === "cart") {
        return "cart";
    }

    if (hash === "checkout") {
        return "checkout";
    }

    if (hash === "orders") {
        return "orders";
    }

    if (hash === "account" || hash.startsWith("account/")) {
        return "account";
    }

    if (hash === "products" || hash.startsWith("products?")) {
        return "products";
    }

    if (hash === "stores" || hash.startsWith("stores?")) {
        return "stores";
    }

    if (hash === "search" || hash.startsWith("search?")) {
        return "search";
    }

    if (hash === "search-entry" || hash.startsWith("search-entry?")) {
        return "search-entry";
    }

    return "home";
}

function getAdminSection(): AdminSection {
    const [, section] = window.location.hash.replace(/^#\/?/, "").split("/");

    if (section && adminSections.has(section as AdminSection)) {
        return section as AdminSection;
    }

    return "dashboard";
}

function App() {
    const [, setHash] = useState(() => window.location.hash);

    useEffect(() => {
        const handleHashChange = () => {
            const currentHash = window.location.hash;
            setHash(currentHash);

            if (currentHash && currentHash !== "#/cart" && currentHash !== "#/checkout") {
                sessionStorage.setItem("prevPath", currentHash);
            }
        };

        const initialHash = window.location.hash;
        if (initialHash && initialHash !== "#/cart" && initialHash !== "#/checkout") {
            sessionStorage.setItem("prevPath", initialHash);
        }

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

    const route = getRoute();

    if (route === "login") {
        return <LoginPage />;
    }

    if (route === "register") {
        return <RegisterPage />;
    }

    if (route === "products") {
        return <ProductsPage />;
    }

    if (route === "product-detail") {
        const productId = getProductIdFromHash();
        return productId ? <ProductDetailPage productId={productId} /> : <ProductsPage />;
    }

    if (route === "cart") {
        return <CartPage />;
    }

    if (route === "checkout") {
        return <CheckoutPage />;
    }

    if (route === "orders") {
        return <OrderHistoryPage />;
    }

    if (route === "account") {
        return <AccountPage />;
    }

    if (route === "stores") {
        return <StoresPage />;
    }

    if (route === "search") {
        return <SearchPage />;
    }

    if (route === "search-entry") {
        return <SearchEntryPage />;
    }

    if (route === "admin") {
        return <AdminPage section={getAdminSection()} />;
    }

    return <HomePage />;
}

export default App;
