import { Request, Response } from "express";
import { profileService } from "../services/profile.service";

// 1. ຮັບ user ຈາກ protect middleware
// 2. ເອີ້ນ service ເພື່ອດຶງ profile ຂອງ user ຄົນນັ້ນ
// 3. ສົ່ງຂໍ້ມູນ profile ກັບໄປໃຫ້ client
export const getMyProfile = async (req: Request, res: Response) => {
    const profile = await profileService.getProfile(req.user!.id);

    return res.status(200).json({
        success: true,
        data: profile,
    });
};

// 1. ຮັບ user ຈາກ token ແລະຂໍ້ມູນໃໝ່ຈາກ body
// 2. ໃຫ້ແກ້ໄດ້ກ່ອນຄື name ແລະ avatarUrl
// 3. update profile ແລ້ວສົ່ງຂໍ້ມູນໃໝ່ກັບ
export const updateMyProfile = async (req: Request, res: Response) => {
    const { name, avatarUrl } = req.body;

    const profile = await profileService.updateProfile(req.user!.id, {
        name,
        avatarUrl,
    });

    return res.status(200).json({
        success: true,
        data: profile,
    });
};
