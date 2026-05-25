import { ErrorRequestHandler, Express, RequestHandler } from "express";
import { Prisma } from "../generated/prisma/client";
import { HttpError } from "../utils/http-error";

const isDevelopment = process.env.NODE_ENV === "development";

// 1. ຈັບ route ທີ່ບໍ່ມີໃນລະບົບ
// 2. ສ້າງ HttpError 404 ແລ້ວສົ່ງໄປ error middleware
// 3. ເຮັດໃຫ້ response ບໍ່ກາຍເປັນ HTML error ຍາວໆ
export const notFoundMiddleware: RequestHandler = (req, _res, next) => {
    next(new HttpError(404, `ບໍ່ພົບ route: ${req.method} ${req.originalUrl}`));
};

// 1. ກວດ error ທີ່ມາຈາກ Prisma
// 2. ແປ code ຂອງ Prisma ເປັນ message ທີ່ເຂົ້າໃຈງ່າຍ
// 3. ສົ່ງ status code ທີ່ເໝາະສົມກັບ client
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
    if (error.code === "P2002") {
        return {
            statusCode: 409,
            message: "ຂໍ້ມູນນີ້ມີຢູ່ແລ້ວ",
        };
    }

    if (error.code === "P2003") {
        return {
            statusCode: 400,
            message: "ຂໍ້ມູນທີ່ອ້າງອີງບໍ່ມີຢູ່",
        };
    }

    if (error.code === "P2025") {
        return {
            statusCode: 404,
            message: "ບໍ່ພົບຂໍ້ມູນ",
        };
    }

    if (error.code === "P2022") {
        return {
            statusCode: 500,
            message: "ໂຄງສ້າງຖານຂໍ້ມູນຂາດ column ທີ່ຈຳເປັນ",
        };
    }

    return {
        statusCode: 500,
        message: "ຖານຂໍ້ມູນມີບັນຫາ",
    };
};

// 1. ຮັບ error ທັງໝົດຈາກ controller ແລະ service
// 2. ແຍກວ່າເປັນ HttpError, Prisma error ຫຼື error ທົ່ວໄປ
// 3. ສົ່ງ JSON response ຮູບແບບດຽວກັນກັບທຸກ API
export const errorMiddleware: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next,
) => {
    let statusCode = 500;
    let message = "ລະບົບມີບັນຫາ";

    if (error instanceof HttpError) {
        statusCode = error.statusCode;
        message = error.message;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaError = handlePrismaError(error);
        statusCode = prismaError.statusCode;
        message = prismaError.message;
    }

    return res.status(statusCode).json({
        success: false,
        message,
        ...(isDevelopment && {
            error: error.message,
        }),
    });
};

// 1. ຕິດຕັ້ງ middleware ຈັບ 404 ແລະ error ກາງ
// 2. ຕ້ອງເອີ້ນຫຼັງຈາກ load routes ແລ້ວ
// 3. ເຮັດໃຫ້ API ທຸກເສັ້ນທາງສົ່ງ error ເປັນ JSON
export const registerErrorHandlers = (app: Express) => {
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);
};
