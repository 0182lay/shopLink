import { useEffect, useState } from "react";
import { CartPage } from "./pages/CartPage";
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
    | "orders"
    | "stores"
    | "search"
    | "search-entry";

function getProductIdFromHash() {
    const match = window.location.hash.match(/^#\/?products\/(\d+)/);
    return match ? Number(match[1]) : null;
}

function getRoute(): AppRoute {
    const hash = window.location.hash.replace(/^#\/?/, "");

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

    if (hash === "orders") {
        return "orders";
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

function App() {
    const [route, setRoute] = useState<AppRoute>(() => getRoute());

    useEffect(() => {
        const handleHashChange = () => setRoute(getRoute());

        window.addEventListener("hashchange", handleHashChange);
        return () => window.removeEventListener("hashchange", handleHashChange);
    }, []);

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

    if (route === "orders") {
        return <OrderHistoryPage />;
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

    return <HomePage />;
}

export default App;
