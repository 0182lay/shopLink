import express from "express";
import { uploadImage } from "../controllers/upload.controller";
import { requireAdmin } from "../middleware/auth.middleware";
import { uploadImageMiddleware } from "../middleware/upload.middleware";

const router = express.Router();

router.post(
    "/uploads/image",
    requireAdmin,
    uploadImageMiddleware.single("image"),
    uploadImage,
);

export default router;
