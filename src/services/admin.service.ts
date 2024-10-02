// src/services/admin.service.ts
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
