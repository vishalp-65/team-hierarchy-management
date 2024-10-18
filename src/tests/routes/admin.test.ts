import httpStatus from "http-status";
import { mockUser } from "../mocks/mockData";
import { makeRequest } from "../utils/request";

describe("Admin Routes", () => {
    it("should create a user successfully", async () => {
        const res = await makeRequest("post", "/api/v1/admin/user", mockUser);
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should update a user successfully", async () => {
        const res = await makeRequest(
            "put",
            `/api/v1/admin/user/${mockUser.id}`,
            mockUser
        );
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should fetch user hierarchy successfully", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/admin/users/hierarchy/${mockUser.id}`
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });
});
