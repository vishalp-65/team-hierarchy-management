// utils/authUtils.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { config } from "../config/server_config";

// Function to hash password
export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, config.SALT_ROUNDS);
};

// Function to verify password
export const verifyPassword = async (
    password: string,
    hash: string
): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

// Function to generate JWT token
export const generateToken = (user: User): string => {
    return jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: "7d" }); // Token expires in 7 day
};

// Function to verify JWT token
export const verifyToken = (token: string): string | object => {
    try {
        return jwt.verify(token, config.JWT_SECRET);
    } catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token");
    }
};
