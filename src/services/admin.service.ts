import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { In } from "typeorm";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Role } from "../entities/Role";
import { Brand } from "../entities/Brand";
import { teamService } from "./team.service";
import { ContactPerson } from "../entities/ContactPerson";
import { brandTypes, usersTypes } from "../types/types";

class AdminService {
    // Create a new user
    async createUser(userData: usersTypes) {
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
            where: { role_name: In(userData.roles!) },
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

        // Fetch manager if provided
        let manager = null;
        if (userData.managerId) {
            manager = await userRepo.findOneBy({ id: userData.managerId });
            if (!manager) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Manager not found");
            }
        }

        // Create the user
        const user = userRepo.create({
            user_name: userData.user_name,
            password: userData.password, // TODO: Hash the password before saving
            phone_number: userData.phone_number,
            email: userData.email,
            roles: roles,
            manager: manager, // Assign manager here
        });

        await userRepo.save(user);

        // Create a team if user is a Team Owner (TO)
        if (hasTO) {
            const hasCycle = await this.checkForCyclicHierarchy(
                user,
                userData.managerId!
            );
            if (hasCycle) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Cyclic hierarchy detected. Cannot assign this manager."
                );
            }
            // Automatically create a team if user has the "TO" role
            const team = teamRepo.create({
                teamOwner: user,
            });
            await teamRepo.save(team);

            // Assign the team to the user
            user.team = team;
            await userRepo.save(user);
        }

        return user;
    }

    // Update an existing user
    async updateUser(userId: string, userData: usersTypes) {
        const userRepo = AppDataSource.getRepository(User);
        const roleRepo = AppDataSource.getRepository(Role);
        const teamRepo = AppDataSource.getRepository(Team);

        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles", "team", "manager"],
        });

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        if (userData.roles) {
            const roles = await roleRepo.find({
                where: {
                    role_name: In(userData.roles),
                },
            });

            const hasPO = roles.some((role) => role.role_name === "PO");
            const hasTO = roles.some((role) => role.role_name === "TO");
            if (hasPO && !hasTO) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "PO role can only be assigned with TO role"
                );
            }

            user.roles = roles;
        }

        // Check if user manager is being updated
        if (userData.managerId && user.manager?.id !== userData.managerId) {
            const manager = await userRepo.findOneBy({
                id: userData.managerId,
            });
            if (!manager) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Manager not found");
            }

            // Check for cyclic hierarchy if updating the manager
            const hasCycle = await this.checkForCyclicHierarchy(
                user,
                userData.managerId
            );
            if (hasCycle) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Cyclic hierarchy detected. Cannot assign this manager."
                );
            }

            user.manager = manager;
        }

        // Update user details
        Object.assign(user, {
            user_name: userData.user_name || user.user_name,
            password: userData.password || user.password, // TODO: Hash the password if updated
            phone_number: userData.phone_number || user.phone_number,
            email: userData.email || user.email,
        });

        await userRepo.save(user);

        if (userData.roles && userData.roles.includes("TO")) {
            // If the user doesn't have a team, create one
            if (!user.team) {
                const team = teamRepo.create({
                    teamOwner: user,
                });
                await teamRepo.save(team);
                user.team = team;
                await userRepo.save(user);
            }
        }

        return user;
    }

    // Create a new brand
    async createBrand(brandData: brandTypes) {
        const brandRepo = AppDataSource.getRepository(Brand);
        const userRepo = AppDataSource.getRepository(User);
        const contactPersonRepo = AppDataSource.getRepository(ContactPerson);

        if (!brandData.ownerIds) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                "Brand owner id not found"
            );
        }

        // Fetch Brand Owners using findBy (In for multiple ids)
        const owners = await userRepo.find({
            where: {
                id: In(brandData.ownerIds),
            },
        });

        const brand = brandRepo.create({
            brand_name: brandData.brand_name,
            revenue: brandData.revenue,
            deal_closed_value: brandData.deal_closed_value,
            owners: owners,
        });

        await brandRepo.save(brand);
        // Add new contact persons
        if (
            brandData.contact_person_name &&
            brandData.contact_person_phone &&
            brandData.contact_person_email
        ) {
            const contactPersonEntities = contactPersonRepo.create({
                contact_person_name: brandData.contact_person_name,
                contact_person_phone: brandData.contact_person_phone,
                contact_person_email: brandData.contact_person_email,
                brand: brand,
            });

            // Save all contact persons
            await contactPersonRepo.save(contactPersonEntities);
        }

        // Return the brand with updated contact persons
        const updatedBrand = await brandRepo.findOne({
            where: { id: brand.id },
            relations: ["owners", "contactPersons"],
        });

        return updatedBrand;
    }

    // Update an existing brand
    async updateBrand(brandId: string, brandData: brandTypes) {
        const brandRepo = AppDataSource.getRepository(Brand);
        const userRepo = AppDataSource.getRepository(User);

        const brand = await brandRepo.findOne({
            where: { id: brandId },
        });

        if (!brand) {
            throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
        }

        // Update brand fields
        Object.assign(brand, {
            brand_name: brandData.brand_name || brand.brand_name,
            revenue: brandData.revenue || brand.revenue,
            deal_closed_value:
                brandData.deal_closed_value || brand.deal_closed_value,
        });

        // Update owners
        if (brandData.ownerIds) {
            const owners = await userRepo.find({
                where: { id: In(brandData.ownerIds) },
            });
            brand.owners = owners;
        }

        await brandRepo.save(brand);
        return brand;
    }

    // Assign roles to a user
    async assignRoleToUser(userId: string, roleIds: number[]) {
        const userRepo = AppDataSource.getRepository(User);
        const roleRepo = AppDataSource.getRepository(Role);

        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles"],
        });
        if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

        const roles = await roleRepo.find({
            where: { id: In(roleIds) },
        });
        user.roles = roles;
        await userRepo.save(user);
        return user;
    }

    // List all TOs (Team Owners) above a user in the hierarchy
    async listUsersWithTOHierarchy(userId?: string) {
        const userRepo = AppDataSource.getRepository(User);

        // Fetch the user along with their manager and roles
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["manager", "roles"],
        });

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        const hierarchy = [];
        let currentUser = user;

        // Traverse upwards in the hierarchy iteratively
        while (currentUser?.manager) {
            const manager = await userRepo.findOne({
                where: { id: currentUser.manager.id },
                relations: ["manager", "roles"],
            });

            if (!manager) {
                break; // If no manager is found, stop the iteration
            }

            // Check if the manager has the "TO" role
            if (manager.roles?.some((role) => role.role_name === "TO")) {
                hierarchy.push(manager);
            }

            // Move to the next manager (i.e., move up the hierarchy)
            currentUser = manager;
        }

        return {
            success: true,
            hierarchy,
        };
    }

    // Check for cyclic hierarchy
    async checkForCyclicHierarchy(
        user: User,
        managerId: string
    ): Promise<boolean> {
        if (!managerId) return false; // If no managerId provided, no cycle is possible

        const userRepo = AppDataSource.getRepository(User);

        // Start with the current manager
        let currentManager = await userRepo.findOne({
            where: { id: managerId },
            relations: ["manager"], // Load the user's manager
        });

        // Traverse up the hierarchy to check for cycles
        while (currentManager) {
            if (currentManager.id === user.id) {
                return true; // Cycle detected if the user is their own manager
            }
            currentManager = currentManager.manager; // Move up the chain to check the next manager
        }

        return false; // No cycle found
    }
}

export const adminService = new AdminService();
