import { In } from "typeorm";
import { adminUserMock, defaultRoles } from "../constant/enums";
import AppDataSource from "../data-source";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { adminService } from "../services/admin.service";
import { usersTypes } from "../types/types";
import { generateToken } from "../utils/authUtils";

// Seed file for role initialization
export const seedRoles = async () => {
    const roleRepo = AppDataSource.getRepository(Role);

    // Check if roles already exist
    const existingRoles = await roleRepo.find();
    if (existingRoles.length === 0) {
        // Insert default roles into the database
        const rolesToInsert = defaultRoles.map((roleName: string) => {
            return roleRepo.create({ role_name: roleName });
        });

        await roleRepo.save(rolesToInsert);
        console.log("Default roles seeded successfully");
    } else {
        console.log("Roles already exist in the database");
    }
};

// Seed file for admin user creation
export const seedAdminUser = async () => {
    try {
        const userRepo = AppDataSource.getRepository(User);
        const roleRepo = AppDataSource.getRepository(Role);

        // Check if the user already exists
        const existingAdmin = await userRepo.findOne({
            where: { email: adminUserMock.email },
            relations: ["roles"],
        });

        // If user exists, log the existing user's ID
        if (existingAdmin) {
            // Generate JWT token for the user
            const token = generateToken(existingAdmin.id);
            console.log("ID of user", existingAdmin.id);
            console.log("ADMIN user already exists token", token);
            return token;
        }

        // Fetch Role entities for the admin user
        const roles = await roleRepo.find({
            where: { role_name: In(adminUserMock.roles!) },
        });

        if (roles.length === 0) {
            throw new Error(
                "Admin roles not found. Ensure roles are seeded first."
            );
        }

        // Create the admin user
        const newAdmin = await adminService.createUser(
            adminUserMock as usersTypes
        );
        console.log("ADMIN user created with ID:", newAdmin.token);

        return newAdmin.token;
    } catch (error) {
        console.error("Error creating ADMIN user:", error.message);
    }
};
