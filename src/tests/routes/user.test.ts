import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import { generateRandomUserData } from "../utils/generateMockData";

let user: any;
let teamUser: any;

describe("User Routes", () => {
    // Creating user
    beforeAll(async () => {
        const randomUser = generateRandomUserData(["TO"]);
        const userRes = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUser
        );
        user = userRes?.body?.data;

        const randomUserWithManager = generateRandomUserData(["TO"], user.id);
        const res = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUserWithManager
        );
        teamUser = res?.body?.data;
        expect(userRes.status).toBe(httpStatus.CREATED);
        expect(userRes.body.success).toBe(true);
    });

    it("should return searched users successfully", async () => {
        const res = await makeRequest(
            "get",
            "/api/v1/user/search?q=team owner"
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Filtered user");
    });

    it("should return list for teammates", async () => {
        const res = await makeRequest(
            "get",
            "/api/v1/user/team",
            "",
            teamUser.id // User with TO role
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("List of team mates");
    });
});
