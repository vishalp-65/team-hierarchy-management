import httpStatus from "http-status";
import { makeRequest } from "../utils/request";

describe("Filter Routes", () => {
    it("should return all users successfully", async () => {
        const res = await makeRequest("get", "/api/v1/filter/users");
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should return list for teammates", async () => {
        const res = await makeRequest("get", "/api/v1/filter/team");
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should return list for all brands", async () => {
        const res = await makeRequest("get", "/api/v1/filter/brands");
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });
});
