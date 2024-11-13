import app from "..";
import AppDataSource from "../data-source";
import { seedAdminUser } from "../seeds/roles.seed";
import { config } from "./server_config";

// Initialize the database and start the server
export function startServer(): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            if (config.NODE_ENV !== "test") {
                await AppDataSource.initialize();
                console.log("Data Source has been initialized!");

                await seedAdminUser(); // Seed the admin user

                app.listen(config.PORT, () => {
                    console.log(`Server running at ${config.PORT}`);
                    resolve(); // Resolve when the server is running
                });
            }
        } catch (error) {
            console.error("Error during Data Source initialization:", error);
            reject(error); // Reject on error
        }
    });
}
