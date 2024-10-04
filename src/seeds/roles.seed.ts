import AppDataSource from "../data-source";
import { Role } from "../entities/Role";

// Seed file for role initilization
export const seedRoles = async () => {
    const roleRepo = AppDataSource.getRepository(Role);

    const defaultRoles = ["ADMIN", "PO", "BO", "TO"];

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
