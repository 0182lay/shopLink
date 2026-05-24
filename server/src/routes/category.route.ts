import express from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategoriesByStoreId,
    getCategoryById,
    restoreCategory,
    updateCategory,
} from "../controllers/category.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// 1. ຮັບ request ຈາກ URL ຂອງ categories
// 2. ສົ່ງຕໍ່ໄປຫາ controller ທີ່ຮັບຜິດຊອບ
// 3. controller ຈະຈັດການ logic ແລ້ວສົ່ງ response ກັບ
router.post("/categories", requireAdmin, createCategory);
router.get("/categories", getCategories);
router.get("/stores/:storeId/categories", getCategoriesByStoreId);
router.get("/categories/:id", getCategoryById);
router.patch("/categories/:id", requireAdmin, updateCategory);
router.delete("/categories/:id", requireAdmin, deleteCategory);
router.patch("/categories/:id/restore", requireAdmin, restoreCategory);

export default router;
