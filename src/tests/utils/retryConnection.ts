import AppDataSource from "../../data-source";

export const initializeDataSource = async (retries = 5, delay = 2000) => {
    while (retries > 0) {
        try {
            if (!AppDataSource.isInitialized) {
                await AppDataSource.initialize();
            }
            console.log("Data Source has been initialized.");
            break; // Exit the loop if initialization succeeds
        } catch (error) {
            console.error("Error during Data Source initialization:", error);
            retries -= 1;
            if (retries === 0) {
                throw new Error(
                    "Failed to initialize Data Source after multiple retries."
                );
            }
            console.log(
                `Retrying Data Source initialization... (${retries} retries left)`
            );
            await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        }
    }
};
