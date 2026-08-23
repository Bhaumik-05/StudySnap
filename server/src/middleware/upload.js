import multer from "multer";
/**
  Multer is a middleware used to handle file uploads
 in Express applications (multipart/form-data).


 memoryStorage() stores the uploaded file temporarily in RAM
 instead of saving it to a physical folder.

The actual file data will be available as:
req.file.buffer


 fileFilter is used to decide whether a file should be
 accepted or rejected during upload.

 req  -> Express request object
 file -> information about the uploaded file
 cb   -> callback used to accept/reject the file

 */
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    /**  Check the MIME type of the uploaded file.
     "application/pdf" is the MIME type for PDF files.
    If the uploaded file is NOT a PDF, reject it.*/
    if (file.mimetype !== "application/pdf") {

        /**First argument = Error
        Second argument = false means reject the file
        return is used so that the function stops here
        and does not execute cb(null, true) below.*/
        return cb(new Error("Only PDF files are allowed"), false);
    }


    // If the file is a PDF:
    // null  -> no error
    // true  -> accept the file
    cb(null, true);
};

// Create the Multer upload middleware with our configuration.

const upload = multer({
    // Use memory storage.
    // Therefore, uploaded PDF data will be available
    // through req.file.buffer.
    storage,

    // Use our custom fileFilter to allow only PDFs.
    fileFilter,

    // Define restrictions for uploaded files.
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB

        // Only ONE file can be uploaded in a request.
        files: 1,
    },
});

export default upload;