import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";
import { In } from "typeorm";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { Role } from "../entities/Role";
import { Brand } from "../entities/Brand";

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

        if (hasTO) {
            // Check for cyclic hierarchy
            const hasCycle = await this.checkForCyclicHierarchy(
                user,
                userData.managerId
            );
            if (hasCycle) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Cyclic hierarchy detected. Cannot assign this user as team owner."
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
    async updateUser(userId: number, userData: any) {
        const userRepo = AppDataSource.getRepository(User);
        const roleRepo = AppDataSource.getRepository(Role);
        const teamRepo = AppDataSource.getRepository(Team);

        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["roles", "team"],
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

        // Update user details
        Object.assign(user, {
            user_name: userData.user_name || user.user_name,
            password: userData.password || user.password, // TODO: Hash the password if updated
            phone_number: userData.phone_number || user.phone_number,
            email: userData.email || user.email,
        });

        await userRepo.save(user);

        if (userData.roles && userData.roles.includes("TO")) {
            // Check for cyclic hierarchy if updating roles to TO
            const hasCycle = await this.checkForCyclicHierarchy(
                user,
                userData.managerId
            );
            if (hasCycle) {
                throw new ApiError(
                    httpStatus.BAD_REQUEST,
                    "Cyclic hierarchy detected. Cannot assign this user as team owner."
                );
            }

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
    async createBrand(brandData: any) {
        const brandRepo = AppDataSource.getRepository(Brand);
        const userRepo = AppDataSource.getRepository(User);

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
            contact_person_name: brandData.contact_person_name,
            contact_person_phone: brandData.contact_person_phone,
            contact_person_email: brandData.contact_person_email,
            owners: owners,
        });

        await brandRepo.save(brand);
        return brand;
    }

    // Update an existing brand
    async updateBrand(brandId: number, brandData: any) {
        const brandRepo = AppDataSource.getRepository(Brand);
        const brand = await brandRepo.findOneBy({ id: brandId });

        if (!brand) {
            throw new ApiError(httpStatus.NOT_FOUND, "Brand not found");
        }

        Object.assign(brand, brandData);
        await brandRepo.save(brand);
        return brand;
    }

    // Assign roles to a user
    async assignRoleToUser(userId: number, roleIds: number[]) {
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

    // List all TOs above a user in the hierarchy
    async listUsersWithTOHierarchy(userId: number) {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["team.teamOwner"],
        });

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        const hierarchy = [];
        let currentUser = user;
        while (currentUser.team?.teamOwner) {
            hierarchy.push(currentUser.team.teamOwner);
            currentUser = currentUser.team.teamOwner;
        }
        return hierarchy;
    }

    // Check for cyclic hierarchy
    async checkForCyclicHierarchy(
        user: User,
        managerId: number | null
    ): Promise<boolean> {
        if (!managerId) return false;

        let currentUser = await AppDataSource.getRepository(User).findOne({
            where: { id: managerId },
            relations: ["team.teamOwner"],
        });

        while (currentUser) {
            if (currentUser.id === user.id) {
                return true; // Cycle detected
            }
            if (currentUser.team?.teamOwner) {
                currentUser = await AppDataSource.getRepository(User).findOne({
                    where: { id: currentUser.team.teamOwner.id },
                    relations: ["team.teamOwner"],
                });
            } else {
                break;
            }
        }

        return false;
    }
}

export const adminService = new AdminService();
