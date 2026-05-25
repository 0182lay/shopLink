import { v2 as cloudinary } from "cloudinary";
import { HttpError } from "../utils/http-error";

const requiredEnv = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
] as const;

export const configureCloudinary = () => {
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);

    if (missingEnv.length > 0) {
        throw new HttpError(
            500,
            `ຍັງບໍ່ໄດ້ຕັ້ງຄ່າ Cloudinary: ${missingEnv.join(", ")}`,
        );
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    return cloudinary;
};
