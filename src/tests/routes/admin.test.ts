import httpStatus from "http-status";
import { makeRequest } from "../utils/request";
import {
    generateBrandData,
    generateRandomUserData,
} from "../utils/generateMockData";
import { fakeIDs } from "../mocks/mockData";

export let user: any;
export let brand: any;

describe("Admin Routes", () => {
    it("should create the user successfully", async () => {
        const randomUser = generateRandomUserData(["ADMIN", "BO"]);
        const userRes = await makeRequest(
            "post",
            "/api/v1/admin/user",
            randomUser
        );
        user = userRes?.body?.data?.user;
        expect(userRes.status).toBe(httpStatus.CREATED);
        expect(userRes.body.success).toBe(true);
    });

    it("should create the brand successfully", async () => {
        // Create a brand after user creation
        let brandData = generateBrandData([user.id]);
        const brandRes = await makeRequest(
            "post",
            "/api/v1/admin/brand",
            brandData
        );
        console.log("brand created", brandRes.body);
        brand = brandRes.body?.data;
        expect(brandRes.status).toBe(httpStatus.CREATED);
        expect(brandRes.body.success).toBe(true);
    });

    it("should update the user successfully", async () => {
        const updatedData = { user_name: "Updated Name" };
        const res = await makeRequest(
            "put",
            `/api/v1/admin/user/${user.id}`,
            updatedData
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("User updated");
    });

    it("should fetch user hierarchy successfully", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/admin/users/hierarchy/${user.id}`
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();
    });

    it("should update the brand successfully", async () => {
        const updatedData = { brand_name: `${brand.brand_name} updated` };
        const res = await makeRequest(
            "put",
            `/api/v1/admin/brand/${brand.id}`,
            updatedData
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Brand updated");
    });

    it("should assign new roles successfully", async () => {
        const data = { userId: user.id, roleIds: [3, 4] }; // Sample role IDs
        const res = await makeRequest(
            "post",
            "/api/v1/admin/assign-role",
            data
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    // Edge Case Tests
    it("should return error when creating a user with missing required fields", async () => {
        const invalidUser = {}; // Missing required fields
        const res = await makeRequest(
            "post",
            "/api/v1/admin/user",
            invalidUser
        );
        expect(res.status).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.success).toBe(false);
    });

    it("should return error when updating a non-existent user", async () => {
        const updatedData = { user_name: "Non-existent User" };
        const res = await makeRequest(
            "put",
            `/api/v1/admin/user/${fakeIDs[0]}`,
            updatedData
        );
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("User not found");
    });

    it("should return error when accessing protected route without a token", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/admin/users/hierarchy/${user.id}`,
            " ",
            " " // Empty header
        );

        expect(res.status).toBe(httpStatus.UNAUTHORIZED);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Unauthorized");
    });

    it("should return error when creating a brand with invalid owner ID", async () => {
        const invalidBrandData = generateBrandData([fakeIDs[0]]);
        const res = await makeRequest(
            "post",
            "/api/v1/admin/brand",
            invalidBrandData
        );
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("Brand owner not found");
    });

    it("should return error when assigning roles to non-existent user", async () => {
        const data = {
            userId: fakeIDs[0],
            roleIds: [3, 4],
        };
        const res = await makeRequest(
            "post",
            "/api/v1/admin/assign-role",
            data
        );
        expect(res.status).toBe(httpStatus.NOT_FOUND);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("User not found");
    });
});
