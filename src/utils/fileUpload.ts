import { Request } from "express";
import multer from "multer";

// Define allowed file types (you can add more if needed)
export const allowedFileTypes = ["image/jpeg", "image/png", "application/pdf"];

// Multer configuration for file upload
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Define where files should be stored
    },
    filename: function (req, file, cb) {
        // Set filename (could be anything, here we use original name)
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to validate file type
const fileFilter = (req: Request, file: any, cb: any) => {
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false); // Reject unsupported file types
    }
};

// Multer instance
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5, // Set file size limit to 5MB
    },
});
