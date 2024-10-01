// src/services/admin.service.ts
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { In } from "typeorm";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Role } from "../entities/Role";

class AdminService {
    // Create a new user
    async createUser(userData: any) {
        const userRepo = AppDataSource.getRepository(User);
        const teamRepo = AppDataSource.getRepository(Team);
        const roleRepo = AppDataSource.getRepository(Role);

        // Check if user already exists
        const userExists = await userRepo.findOneBy({ email: userData.email });
        if (userExists) {
            throw new ApiError(httpStatus.BAD_REQUEST, "User already exists");
        }

        // Fetch Role entities based on role names
        const roles = await roleRepo.find({
            where: {
                role_name: In(userData.roles),
            },
        });

        // Validate roles
        const hasPO = roles.some((role) => role.role_name === "PO");
        const hasTO = roles.some((role) => role.role_name === "TO");
        if (hasPO && !hasTO) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "PO role can only be assigned with TO role"
            );
        }

        // Create the user
        const user = userRepo.create({
            user_name: userData.user_name,
            password: userData.password, // TODO: Hash the password before saving
            phone_number: userData.phone_number,
            email: userData.email,
            roles: roles,
        });

        await userRepo.save(user);

        return user;
    }
}

export const adminService = new AdminService();
