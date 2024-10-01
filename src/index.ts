import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { config } from "./config/server_config";
import { ApiError } from "./utils/ApiError";
import httpStatus from "http-status";
import errorHandler from "./middlewares/errorHandler";
import apiRoutes from "./routes/index";
import AppDataSource from "./data-source";
import { Role } from "./entities/Role";

dotenv.config(); // Load environment variables

const app = express();

// Seed file for role initilization
const seedRoles = async () => {
    const roleRepo = AppDataSource.getRepository(Role);

    const defaultRoles = ["ADMIN", "PO", "BO", "TO"];

    // Check if roles already exist
    const existingRoles = await roleRepo.find();
    if (existingRoles.length === 0) {
        // Insert default roles into the database
        const rolesToInsert = defaultRoles.map((roleName) => {
            return roleRepo.create({ role_name: roleName });
        });

        await roleRepo.save(rolesToInsert);
        console.log("Default roles seeded successfully");
    } else {
        console.log("Roles already exist in the database");
    }
};

// Handle CORS issue
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", apiRoutes);

// 404 handler for unknown API requests
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// Error handler middleware
app.use(errorHandler);

// Initialize the database and start the server
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        seedRoles().then(() => {
            app.listen(config.PORT, () => {
                console.log(`Server running at ${config.PORT}`);
            });
        });
    })
    .catch((error) => {
        console.error("Error during Data Source initialization:", error);
    });

export default app;
