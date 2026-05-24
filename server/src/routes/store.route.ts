import express from "express";
import {
    createStore,
    deleteStore,
    getStoreById,
    getStoreBySlug,
    getStores,
    restoreStore,
    updateStore,
} from "../controllers/store.controller";
import { requireAdmin } from "../middleware/auth.middleware";

const router = express.Router();

// 1. ຮັບ request ຈາກ URL ຂອງ stores
// 2. ສົ່ງຕໍ່ໄປຫາ controller ທີ່ຮັບຜິດຊອບ
// 3. controller ຈະຈັດການ logic ແລ້ວສົ່ງ response ກັບ
router.post("/stores", requireAdmin, createStore);
router.get("/stores", getStores);
router.get("/stores/slug/:slug", getStoreBySlug);
router.get("/stores/:id", getStoreById);
router.patch("/stores/:id", requireAdmin, updateStore);
router.delete("/stores/:id", requireAdmin, deleteStore);
router.patch("/stores/:id/restore", requireAdmin, restoreStore);

export default router;
