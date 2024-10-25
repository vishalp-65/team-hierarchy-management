import { Repository } from "typeorm";
import AppDataSource from "../data-source";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import {
    generateToken,
    hashPassword,
    verifyPassword,
} from "../utils/authUtils";
import { User } from "../entities/User";

class AuthService {
    private userRepo: Repository<User>;

    constructor() {
        this.userRepo = AppDataSource.getRepository(User);
    }

    // User login
    async login(email: string, password: string) {
        const user = await this.findUserByEmail(email);

        // Check if the user needs to change the default password
        if (user.isDefaultPassword) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Change default password before logging in."
            );
        }

        // Verify password
        const isPasswordMatch = await verifyPassword(password, user.password);
        if (!isPasswordMatch) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password.");
        }

        // Remove password from user before returning
        const { password: _, ...userWithoutPassword } = user;

        // Generate token
        const token = generateToken(user.id);
        return { user: userWithoutPassword, token };
    }

    // Reset user password
    async resetPassword(
        email: string,
        currentPassword: string,
        newPassword: string
    ) {
        const user = await this.findUserByEmail(email);

        // Check if the user is using the default password
        if (user.isDefaultPassword) {
            if (user.password !== currentPassword) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Current password does not match the default password."
                );
            }
        } else {
            // Otherwise, verify the existing password
            const isPasswordMatch = await verifyPassword(
                currentPassword,
                user.password
            );
            if (!isPasswordMatch) {
                throw new ApiError(
                    httpStatus.UNAUTHORIZED,
                    "Incorrect current password."
                );
            }
        }

        // Update password with the new hashed password and reset the default password flag
        user.password = await hashPassword(newPassword);
        user.isDefaultPassword = false;

        await this.userRepo.save(user);
    }

    // Helper function to find user by email
    private async findUserByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                "User with provided email does not exist."
            );
        }
        return user;
    }
}

export const AuthServiceInstance = new AuthService();
