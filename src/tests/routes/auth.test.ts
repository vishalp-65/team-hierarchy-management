import httpStatus from "http-status";
import { generateRandomUserData } from "../utils/generateMockData";
import { makeRequest } from "../utils/request";

export let user: any;
const newPassword = "TestUser@123";

describe("Auth Routes", () => {
    beforeAll(async () => {
        const randomUser = generateRandomUserData(["ADMIN", "MG"]);
        const userRes = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUser
        );
        user = userRes?.body?.data?.user;
        expect(userRes.status).toBe(httpStatus.CREATED);
        expect(userRes.body.success).toBe(true);
    });

    // Edge case - (login user without changing default password)
    it("should return error for default password", async () => {
        const loginData = { email: user?.email, password: user?.password };
        const userRes = await makeRequest(
            "post",
            "/api/v1/auth/login",
            loginData
        );
        expect(userRes.status).toBe(httpStatus.BAD_REQUEST);
        expect(userRes.body.success).toBe(false);
    });

    it("should change password to newPassword", async () => {
        const loginData = {
            email: user?.email,
            password: user?.password,
            newPassword: newPassword,
        };
        const userRes = await makeRequest(
            "post",
            "/api/v1/auth/changePassword",
            loginData
        );
        console.log("res", userRes.body);
        expect(userRes.status).toBe(httpStatus.OK);
        expect(userRes.body.success).toBe(true);
    });

    it("should login and return token", async () => {
        const loginData = { email: user?.email, password: newPassword };
        const userRes = await makeRequest(
            "post",
            "/api/v1/auth/login",
            loginData
        );
        console.log("res2", userRes.body);
        expect(userRes.status).toBe(httpStatus.OK);
        expect(userRes.body.success).toBe(true);
        expect(userRes.body?.data?.token).toBeDefined();
    });
});
