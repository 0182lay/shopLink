import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrders,
    getOrdersByStoreId,
    updateOrderStatus,
} from "../controllers/order.controller";
import {
    optionalAuth,
    protect,
    requireAdmin,
} from "../middleware/auth.middleware";

const router = express.Router();

// 1. ຮັບ request ຈາກ URL ຂອງ orders
// 2. ສົ່ງຕໍ່ໄປຫາ controller ທີ່ຮັບຜິດຊອບ
// 3. controller ຈະສ້າງ order ຫຼືດຶງ order ແລ້ວສົ່ງ response ກັບ
router.post("/orders", optionalAuth, createOrder);
router.get("/orders", requireAdmin, getOrders);
router.get("/me/orders", protect, getMyOrders);
router.get("/stores/:storeId/orders", requireAdmin, getOrdersByStoreId);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", requireAdmin, updateOrderStatus);

export default router;
