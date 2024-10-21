import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import { generateRandomUserData } from "../utils/generateMockData";

export let teamUser: any;

describe("Team Routes", () => {
    // Creating user
    beforeAll(async () => {
        const randomUser = generateRandomUserData(["TO"]);
        const userRes = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUser
        );
        teamUser = userRes?.body?.data;
        expect(userRes.status).toBe(httpStatus.CREATED);
        expect(userRes.body.success).toBe(true);
    });

    it("should return team hierarchy successfully", async () => {
        const res = await makeRequest("get", "/api/v1/team", "", teamUser.id);
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Team hierarchy");
    });
});
