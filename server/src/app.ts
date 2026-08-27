import express, { Express } from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import categoryRoutes from "./routes/category.route";
import healthRoutes from "./routes/health.route";
import orderRoutes from "./routes/order.route";
import productRoutes from "./routes/product.route";
import profileRoutes from "./routes/profile.route";
import storeRoutes from "./routes/store.route";
import uploadRoutes from "./routes/upload.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const publicCatalogCachePaths = [
    /^\/api\/products(?:\/(?:featured|\d+))?$/,
    /^\/api\/categories(?:\/\d+)?$/,
    /^\/api\/stores(?:\/(?:slug\/[^/]+|\d+))?$/,
    /^\/api\/stores\/\d+\/(?:products|categories)$/,
    /^\/api\/categories\/\d+\/products$/,
];

app.use((req, res, next) => {
    if (
        req.method === "GET" &&
        publicCatalogCachePaths.some((path) => path.test(req.path))
    ) {
        res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    }

    next();
});

app.get("/", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "ShopLink API is running",
        version: "1.0.0",
        status: "live",
    });
});

app.get("/ping", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "pong",
    });
});

app.get("/api", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "ShopLink API root",
        endpoints: ["/api/health", "/api/stores", "/api/products"],
    });
});

export const loadRoutes = async (app: Express) => {
    const routes = [
        ["auth.route", authRoutes],
        ["category.route", categoryRoutes],
        ["health.route", healthRoutes],
        ["order.route", orderRoutes],
        ["product.route", productRoutes],
        ["profile.route", profileRoutes],
        ["store.route", storeRoutes],
        ["upload.route", uploadRoutes],
    ] as const;

    routes.forEach(([name, router]) => {
        app.use("/api", router);
        console.log(`loaded route: ${name}`);
    });
};

export default app;
