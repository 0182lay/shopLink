import dotenv from "dotenv";
import app, { loadRoutes } from "./app";
import { registerErrorHandlers } from "./middleware/error.middleware";

dotenv.config();

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || "0.0.0.0";

const startServer = async () => {
    await loadRoutes(app);
    registerErrorHandlers(app);

    app.listen(Number(PORT), HOST, () => {
        console.log("==============================");
        console.log(`ShopLink API running on ${HOST}:${PORT}`);
        console.log("==============================");
    });
};

startServer();
