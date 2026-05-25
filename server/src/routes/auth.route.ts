import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/auth.controller";
import { validateBody } from "../middleware/validate.middleware";
import { loginSchema, registerSchema } from "../validations/request.validation";

const router = express.Router();

// 1. ຮັບ request ສຳລັບ auth ຂອງ admin
// 2. register ໃຊ້ສ້າງ admin ຄົນທຳອິດໃນຊ່ວງ dev
// 3. login ຈະສົ່ງ JWT token ໃຫ້ໃຊ້ກັບ protected routes
router.post("/auth/register", validateBody(registerSchema), registerAdmin);
router.post("/auth/login", validateBody(loginSchema), loginAdmin);

export default router;
