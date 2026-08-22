import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";

const uploadPdf = (buffer) => {
    return new Promise((resolve, reject) => {
        const uniqueId = crypto.randomUUID();

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "studysnap/notes",
                public_id: uniqueId,
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        uploadStream.end(buffer);
    });
};

export default uploadPdf;