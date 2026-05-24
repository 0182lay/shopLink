import dotenv from "dotenv";
import app, { loadRoutes } from "./app";
import { registerErrorHandlers } from "./middleware/error.middleware";

dotenv.config();

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    await loadRoutes(app);
    registerErrorHandlers(app);

    app.listen(PORT, () => {
        console.log("==============================");
        console.log(`ShopLink API running on port ${PORT}`);
        console.log("==============================");
    });
};

startServer();
