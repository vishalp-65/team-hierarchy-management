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
