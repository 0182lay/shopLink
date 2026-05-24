import express from "express";
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getProductsByCategoryId,
    getProductsByStoreId,
    restoreProduct,
    updateProduct,
} from "../controllers/product.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// 1. ຮັບ request ຈາກ URL ຂອງ products
// 2. ສົ່ງຕໍ່ໄປຫາ controller ທີ່ຮັບຜິດຊອບ
// 3. controller ຈະຈັດການ logic ແລ້ວສົ່ງ response ກັບ
router.post("/products", requireAdmin, createProduct);
router.get("/products", getProducts);
router.get("/stores/:storeId/products", getProductsByStoreId);
router.get("/categories/:categoryId/products", getProductsByCategoryId);
router.get("/products/:id", getProductById);
router.patch("/products/:id", requireAdmin, updateProduct);
router.delete("/products/:id", requireAdmin, deleteProduct);
router.patch("/products/:id/restore", requireAdmin, restoreProduct);

export default router;
