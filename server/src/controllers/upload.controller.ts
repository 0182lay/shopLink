import { Request, Response } from "express";
import { uploadService } from "../services/upload.service";

export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Image file is required",
        });
    }

    const folder =
        typeof req.body.folder === "string" && req.body.folder.trim()
            ? req.body.folder.trim()
            : undefined;

    const image = await uploadService.uploadImage({
        buffer: req.file.buffer,
        folder,
    });

    return res.status(201).json({
        success: true,
        data: image,
    });
};
