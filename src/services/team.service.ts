import AppDataSource from "../data-source";
import { Team } from "../entities/Team";
import { User } from "../entities/User";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

class TeamService {
    async getTeamHierarchy(userId: number) {
        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOne({
            where: { id: userId },
            relations: ["team", "roles"],
        });

        // Check if the user exists and has roles
        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, "User not found");
        }

        if (
            !user.roles ||
            !user.roles.some((role) => role.role_name === "TO")
        ) {
            throw new ApiError(
                httpStatus.FORBIDDEN,
                "User is not a Team Owner"
            );
        }

        // Fetch the team for the user
        const teamRepo = AppDataSource.getRepository(Team);
        const team = await teamRepo.findOne({
            where: { teamOwner: user },
            relations: ["teamOwner", "members"], // Assuming 'members' is the relation for users in the team
        });

        if (!team) {
            throw new ApiError(
                httpStatus.NOT_FOUND,
                "Team not found for this user"
            );
        }
        return team;
    }

    // Helper function to recursively get team hierarchy
    async getUserHierarchy(user: User) {
        const hierarchy: any[] = [];
        const currentTeam = await AppDataSource.getRepository(User).find({
            where: { team: { teamOwner: user } },
            relations: ["team", "roles"],
        });

        for (const member of currentTeam) {
            const memberHierarchy = await this.getUserHierarchy(member);
            hierarchy.push({
                user: member,
                subordinates: memberHierarchy,
            });
        }

        return hierarchy;
    }
}

export const teamService = new TeamService();
