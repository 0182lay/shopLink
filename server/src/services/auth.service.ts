import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http-error";

type RegisterAdminData = {
    name: string;
    email: string;
    password: string;
};

type LoginAdminData = {
    email: string;
    password: string;
};

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new HttpError(500, "ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ JWT secret");
    }

    return secret;
};

const createToken = (admin: { id: number; email: string; role: string }) => {
    return jwt.sign(
        {
            userId: admin.id,
            email: admin.email,
            role: admin.role,
        },
        getJwtSecret(),
        {
            expiresIn: "7d",
        },
    );
};

export const authService = {
    // 1. ຮັບຂໍ້ມູນ user ໃໝ່ຈາກ controller
    // 2. hash password ກ່ອນບັນທຶກ ເພື່ອບໍ່ເກັບ password ດິບ
    // 3. ສ້າງ user role USER ເປັນ default ແລະສົ່ງ token ກັບ
    async registerAdmin(data: RegisterAdminData) {
        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email.toLowerCase(),
                passwordHash,
                role: "ADMIN",
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });

        const token = createToken(user);

        return {
            admin: user,
            token,
        };
    },

    // 1. ຮັບ email ແລະ password ຈາກ controller
    // 2. ຄົ້ນຫາ admin ແລະກວດ password ກັບ passwordHash
    // 3. ຖ້າຖືກຕ້ອງຈະສ້າງ JWT token ໃຫ້ໃຊ້ກັບ protected routes
    async loginAdmin(data: LoginAdminData) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email.toLowerCase(),
            },
            select: {
                id: true,
                name: true,
                email: true,
                passwordHash: true,
                role: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new HttpError(401, "ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
        }

        const isPasswordValid = await bcrypt.compare(
            data.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new HttpError(401, "ອີເມວ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
        }

        const token = createToken(user);

        return {
            admin: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
            token,
        };
    },
};
