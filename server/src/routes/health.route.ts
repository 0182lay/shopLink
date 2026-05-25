import express from "express";

const router = express.Router();

router.get("/health", (_req, res) => {
    return res.status(200).json({
        success: true,
        message: "OK",
        service: "shoplink-api",
    });
});

export default router;
