import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Multer errors
  if (err instanceof multer.MulterError) {

    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "PDF size cannot exceed 10 MB",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Only one PDF file is allowed",
      });
    }

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // File type error from our fileFilter
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed",
    });
  }

  // Other errors
return res.status(err.statusCode || 500).json({
  success: false,
  message: err.message || "Internal server error",
});
};

export default errorMiddleware;