// Node.js built-in module used for generating unique IDs.
// We use it to generate a unique name for every uploaded PDF.
import crypto from "crypto";
import cloudinary from "../config/cloudinary.js";



// Function that uploads a PDF buffer to Cloudinary.
// buffer = actual PDF data received from Multer.
// Since we used multer.memoryStorage(), the PDF is available as:
// req.file.buffer
const uploadPdf = (buffer) => {


    // upload_stream() works asynchronously,
    // so we return a Promise.
    // resolve()  -> upload successful
    // reject()   -> upload failed

    return new Promise((resolve, reject) => {

        /**Generate a unique ID for the uploaded PDF.
        
        Example:
        "550e8400-e29b-41d4-a716-446655440000"
        
        This prevents two uploaded files from having
        the same public_id/name. */
        const uniqueId = crypto.randomUUID()


        /**  Create a Cloudinary upload stream.
         A stream allows us to send the PDF data directly
         to Cloudinary without first creating a physical file
         on our server. */
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                // Cloudinary normally handles images/videos.
                // "raw" tells Cloudinary that this is a raw file,
                // such as a PDF or other non-image file.
                resource_type: "raw",
                folder: "studysnap/notes",
                public_id: uniqueId,
                // Give the uploaded file a unique ID.
                // This helps avoid filename conflicts.
            },

            // If Cloudinary returned an error,
            // reject the Promise.
            (error, result) => {
                if (error) {
                    return reject(error);
                }


                // If upload was successful,
                // return Cloudinary's result.
                // result contains information such as:
                // result.secure_url
                // result.public_id
                // result.resource_type
                resolve(result);
            }
        );

        // Send the actual PDF data to Cloudinary.
        // buffer came from: req.file.buffer
        // .end() tells the upload stream that
        // all data has been provided.
        uploadStream.end(buffer);
    });
};

export default uploadPdf;