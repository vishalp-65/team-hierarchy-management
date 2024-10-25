// src/services/auth.service.ts

import { Repository } from "typeorm";
import { User } from "../entities/User";
import AppDataSource from "../data-source";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import {
    generateToken,
    hashPassword,
    verifyPassword,
} from "../utils/authUtils";

class AuthService {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }

    async login(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        // Check if user changed default password
        if (user.created_at === user.updated_at) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Change default password"
            );
        }

        // Matching password
        const isPasswordMatch = await verifyPassword(password, user.password);

        if (!isPasswordMatch) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Password not match");
        }

        // Generate token
        const token = generateToken(user.id);

        return { user, token };
    }

    async resetPassword(email: string, password: string, newPassword: string) {
        const user = await this.findUserByEmail(email);

        // Matching password
        const isPasswordMatch = await verifyPassword(password, user.password);

        if (!isPasswordMatch) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Password not match");
        }

        // Hash password
        await hashPassword(newPassword);
    }

    // Helper: Find user by email
    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { email: email } });

        // If user not found, throw error
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "Email not exists");
        }

        return user;
    }
}

export const AuthServiceInstance = new AuthService();
