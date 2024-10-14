import AppDataSource from "../data-source";
import { Brand } from "../entities/Brand";
import { ContactPerson } from "../entities/ContactPerson";
import { Role } from "../entities/Role";
import { Team } from "../entities/Team";
import { User } from "../entities/User";

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

export const deleteSchema = async () => {
    const brandRepo = AppDataSource.getRepository(Brand);
    const roleRepo = AppDataSource.getRepository(Role);
    const teamRepo = AppDataSource.getRepository(Team);
    const userRepo = AppDataSource.getRepository(User);
    const contactRepo = AppDataSource.getRepository(ContactPerson);

    try {
        await contactRepo.query(`
            DROP TABLE contact_persons;
        `);
        await brandRepo.query(`
            DROP TABLE brand_owners;
        `);
        await brandRepo.query(`
            DROP TABLE brand;
        `);
        await userRepo.query(`SET FOREIGN_KEY_CHECKS = 0;`);

        // Drop dependent table first
        await userRepo.query(`DROP TABLE users;`);

        // Drop referencing table
        await teamRepo.query(`DROP TABLE team;`);

        // ... (other tables)

        // Re-enable foreign key checks
        await userRepo.query(`SET FOREIGN_KEY_CHECKS = 1;`);
        await roleRepo.query(`
            DROP TABLE users_role;
        `);
        await roleRepo.query(`
            DROP TABLE role;
        `);
        console.log("Tables deleted successfully");
    } catch (error) {
        console.log("Error or already delete schema", error);
    }
};
