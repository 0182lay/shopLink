import express from "express";
import {
    getMyProfile,
    updateMyProfile,
} from "../controllers/profile.controller";
import { protect } from "../middleware/auth.middleware";
import { validateBody } from "../middleware/validate.middleware";
import { updateProfileSchema } from "../validations/request.validation";

const router = express.Router();       

// 1. ຮັບ request ສຳລັບ profile ຂອງ user ທີ່ login ແລ້ວ
// 2. ໃຊ້ protect ເພື່ອບັງຄັບວ່າຕ້ອງມີ token
// 3. controller ຈະດຶງ ຫຼື update profile ຂອງ user ຄົນນັ້ນ
router.get("/me", protect, getMyProfile);
router.patch(
    "/me",
    protect,
    validateBody(updateProfileSchema, { requireAtLeastOne: true }),
    updateMyProfile,
);

export default router;
