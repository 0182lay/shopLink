import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProductsPage } from "./pages/ProductsPage";
import { RegisterPage } from "./pages/RegisterPage";
import { StoresPage } from "./pages/StoresPage";

type AppRoute = "home" | "login" | "register" | "products" | "stores";

function getRoute(): AppRoute {
    const hash = window.location.hash.replace(/^#\/?/, "");

    if (hash === "login") {
        return "login";
    }

    if (hash === "register") {
        return "register";
    }

    if (hash === "products") {
        return "products";
    }

    if (hash === "stores") {
        return "stores";
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

    if (route === "stores") {
        return <StoresPage />;
    }

    return <HomePage />;
}

export default App;
