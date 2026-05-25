import { UploadApiResponse } from "cloudinary";
import { configureCloudinary } from "../config/cloudinary";
import { HttpError } from "../utils/http-error";

type UploadImageData = {
    buffer: Buffer;
    folder?: string;
};

const uploadBuffer = ({ buffer, folder }: UploadImageData) => {
    const cloudinary = configureCloudinary();

    return new Promise<UploadApiResponse>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: folder ?? "shoplink",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                if (!result) {
                    return reject(new HttpError(500, "Image upload failed"));
                }

                return resolve(result);
            },
        );

        stream.end(buffer);
    });
};

export const uploadService = {
    async uploadImage(data: UploadImageData) {
        const result = await uploadBuffer(data);

        return {
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        };
    },
};
