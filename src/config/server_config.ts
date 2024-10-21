import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT as string | 8082,
    DB_URI: process.env.DB_URI as string,
    REDIS_URL: process.env.REDIS_URL as string,
    NODE_ENV: process.env.NODE_ENV as string | "development",
};
