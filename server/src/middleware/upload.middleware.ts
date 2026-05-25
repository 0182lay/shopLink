import multer from "multer";
import { HttpError } from "../utils/http-error";

const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]);

export const uploadImageMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1,
    },
    fileFilter: (_req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            return callback(
                new HttpError(
                    400,
                    "ອະນຸຍາດສະເພາະຮູບ JPEG, PNG, WEBP ແລະ GIF",
                ),
            );
        }

        return callback(null, true);
    },
});
