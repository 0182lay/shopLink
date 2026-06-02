import dotenv from "dotenv";
import app, { loadRoutes } from "./app";
import { checkDatabaseConnection, prisma } from "./config/prisma";
import { registerErrorHandlers } from "./middleware/error.middleware";

dotenv.config();

const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
    await loadRoutes(app);
    registerErrorHandlers(app);

    app.listen(Number(PORT), HOST, () => {
        console.log("==============================");
        console.log(`ShopLink API running on ${HOST}:${PORT}`);
        console.log("==============================");

        void checkDatabaseConnection(5, 2000).then((connected) => {
            if (connected) {
                console.log("Database connection ready");
                return;
            }

            console.error("Database connection is not ready after retries");
        });
    });
};

startServer().catch((error) => {
    console.error("Failed to start ShopLink API");
    console.error(error);
    process.exit(1);
});

const shutdown = async () => {
    await prisma.$disconnect();
    process.exit(0);
};

process.on("SIGTERM", () => {
    void shutdown();
});

process.on("SIGINT", () => {
    void shutdown();
});
