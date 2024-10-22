import { In } from "typeorm";
import { adminUserMock } from "../constant/enums";
import AppDataSource from "../data-source";
import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { adminService } from "../services/admin.service";
import { usersTypes } from "../types/types";

// Seed file for role initialization
export const seedRoles = async () => {
    const roleRepo = AppDataSource.getRepository(Role);

    const defaultRoles = ["ADMIN", "MG", "PO", "BO", "TO"];

    // Check if roles already exist
    const existingRoles = await roleRepo.find();
    if (existingRoles.length === 0) {
        // Insert default roles into the database
        const rolesToInsert = defaultRoles.map((roleName) => {
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
            console.log("ADMIN user already exists with ID:", existingAdmin.id);
            return existingAdmin.id;
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
        console.log("ADMIN user created with ID:", newAdmin.id);

        return newAdmin.id;
    } catch (error) {
        console.error("Error creating ADMIN user:", error.message);
    }
};
