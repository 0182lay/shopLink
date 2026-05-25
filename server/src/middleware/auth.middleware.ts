import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/prisma";
import { HttpError } from "../utils/http-error";

type JwtPayload = {
    userId: number;
    email: string;
    role: string;
};

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new HttpError(500, "ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ JWT secret");
    }

    return secret;
};

declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: number;
                name: string;
                email: string;
                role: string;
            };
            user?: {
                id: number;
                name: string;
                email: string;
                role: string;
            };
        }
    }
}

// 1. ອ່ານ token ຈາກ Authorization header
// 2. ກວດ JWT ແລະຄົ້ນຫາ admin ໃນ database
// 3. ຖ້າ token ຖືກຕ້ອງຈະອະນຸຍາດໃຫ້ໄປ controller ຕໍ່
export const protect: RequestHandler = async (req, _res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return next(new HttpError(401, "ຕ້ອງມີ token ສຳລັບຢືນຢັນຕົວຕົນ"));
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    if (!user) {
        return next(new HttpError(401, "ບັນຊີຜູ້ໃຊ້ນີ້ບໍ່ມີແລ້ວ"));
    }

    req.user = user;
    req.admin = user;

    return next();
};

// 1. ຖ້າມີ token ຈະກວດແລະແນບ user ໃສ່ request
// 2. ຖ້າບໍ່ມີ token ກໍໃຫ້ໄປຕໍ່ ເພາະ checkout ບໍ່ບັງຄັບ login
// 3. ໃຊ້ກັບ route ທີ່ login ໄດ້ແຕ່ບໍ່ login ກໍໃຊ້ໄດ້
export const optionalAuth: RequestHandler = async (req, _res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        return next();
    }

    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, getJwtSecret()) as JwtPayload;

    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    if (user) {
        req.user = user;
        req.admin = user;
    }

    return next();
};

// 1. ກວດວ່າ user login ແລ້ວຫຼືບໍ່
// 2. ກວດ role ວ່າເປັນ ADMIN ຫຼື SUPER_ADMIN
// 3. ຖ້າບໍ່ແມ່ນ admin ຈະບໍ່ໃຫ້ເຂົ້າ route ຈັດການລະບົບ
export const requireAdmin: RequestHandler[] = [
    protect,
    (req, _res, next) => {
        if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPER_ADMIN") {
            return next(new HttpError(403, "ຕ້ອງມີສິດ admin"));
        }

        return next();
    },
];
