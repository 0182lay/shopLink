import express, { Express } from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import cors from "cors";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "ShopLink API is running",
        status: "live",
    });
});

app.get("/api", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "ShopLink API root",
        endpoints: ["/api/health", "/api/stores", "/api/products"],
    });
});

const routesPath = path.join(__dirname, "routes");

export const loadRoutes = async (app: Express) => {
    const files = fs
        .readdirSync(routesPath)
        .filter(
            (file) => file.endsWith(".route.ts") || file.endsWith(".route.js"),
        );

    for (const file of files) {
        const routePath = pathToFileURL(path.join(routesPath, file)).href;
        const routeModule = await import(routePath);

        app.use("/api", routeModule.default);

        console.log(`✅ loaded route: ${file}`);
    }
};

export default app;
