import express from "express";
import { checkDatabaseConnection } from "../config/prisma";

const router = express.Router();

router.get("/health", (_req, res) => {
    return res.status(200).json({
        status: "ok",
        success: true,
        message: "OK",
        service: "shoplink-api",
    });
});

router.get("/health/db", async (_req, res) => {
    const connected = await checkDatabaseConnection(1, 0);

    if (!connected) {
        return res.status(503).json({
            status: "error",
            success: false,
            message: "Database connection failed",
            service: "shoplink-api",
        });
    }

    return res.status(200).json({
        status: "ok",
        success: true,
        message: "Database connection OK",
        service: "shoplink-api",
    });
});

export default router;
