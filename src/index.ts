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
import { seedAdminUser, seedRoles } from "./seeds/roles.seed";
import swaggerRoutes from "./config/swagger";
import cron from "node-cron";
import { SLAServiceInstance } from "./services/sla.service";

dotenv.config(); // Load environment variables

const app = express();

// Handle CORS issue
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", apiRoutes);

// Swagger routes
app.use(swaggerRoutes);

// 404 handler for unknown API requests
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Route not found"));
});

// Error handler middleware
app.use(errorHandler);

// Schedule to run every hour
cron.schedule("0 * * * *", async () => {
    console.log("Running SLA Monitor");
    await SLAServiceInstance.monitorSLAs();
});

// Initialize the database and start the server
if (config.NODE_ENV !== "test") {
    AppDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!");
            seedRoles().then(() => {
                seedAdminUser().then(() => {
                    // Just to seed admin user for empty database or test
                    app.listen(config.PORT, () => {
                        console.log(`Server running at ${config.PORT}`);
                    });
                });
            });
        })
        .catch((error) => {
            console.error("Error during Data Source initialization:", error);
        });
}

export default app;
