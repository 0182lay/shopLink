import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/auth.controller";

const router = express.Router();

// 1. ຮັບ request ສຳລັບ auth ຂອງ admin
// 2. register ໃຊ້ສ້າງ admin ຄົນທຳອິດໃນຊ່ວງ dev
// 3. login ຈະສົ່ງ JWT token ໃຫ້ໃຊ້ກັບ protected routes
router.post("/auth/register", registerAdmin);
router.post("/auth/login", loginAdmin);

export default router;
