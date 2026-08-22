import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
        return cb(new Error("Only PDF files are allowed"), false);
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
        files: 1,
    },
});

export default upload;