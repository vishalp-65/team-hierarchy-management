import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "reflect-metadata";
import { ApiError } from "./utils/ApiError";
import httpStatus from "http-status";
import errorHandler from "./middlewares/errorHandler";
import apiRoutes from "./routes/index";
import swaggerRoutes from "./config/swagger";
import cron from "node-cron";
import { SLAServiceInstance } from "./services/sla.service";
import { startServer } from "./config/database_config";

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

startServer().catch((error) => {
    console.error("Failed to start the server:", error);
});

export default app;
