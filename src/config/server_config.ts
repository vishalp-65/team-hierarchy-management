import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT as string,
    DB_URI: process.env.DB_URI as string,
    REDIS_URL: process.env.REDIS_URL as string,
    TEST_PORT: process.env.TEST_PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
};
