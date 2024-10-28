import dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: process.env.PORT || "8082",
    DB_URI: process.env.DB_URI,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    SOCKET_PORT: process.env.SOCKET_PORT || "8083",
    SALT_ROUNDS: Number(process.env.SALT_ROUNDS) || 10,
    NODE_ENV: process.env.NODE_ENV || "development",
};
