import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http-error";

type UpdateProfileData = {
    name?: string;
    avatarUrl?: string;
};

export const profileService = {
    // 1. ຮັບ userId ຈາກ token ທີ່ login ແລ້ວ
    // 2. ດຶງຂໍ້ມູນ profile ໂດຍບໍ່ດຶງ passwordHash
    // 3. ສົ່ງຂໍ້ມູນ user ກັບໄປໃຫ້ frontend ໃຊ້ສະແດງ profile
    async getProfile(userId: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new HttpError(404, "ບໍ່ພົບຜູ້ໃຊ້");
        }

        return user;
    },

    // 1. ຮັບ userId ຈາກ token ແລະຂໍ້ມູນ profile ໃໝ່ຈາກ body
    // 2. update ໄດ້ສະເພາະ name ແລະ avatarUrl ກ່ອນ
    // 3. ສົ່ງ profile ຫຼັງ update ກັບໄປໃຫ້ frontend
    async updateProfile(userId: number, data: UpdateProfileData) {
        return prisma.user.update({
            where: {
                id: userId,
            },
            data,
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                role: true,
                createdAt: true,
            },
        });
    },
};
