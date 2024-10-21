import httpStatus from "http-status";
import { makeRequest } from "../utils/request";

describe("Analytics Routes", () => {
    it("should return analytics data successfully", async () => {
        const res = await makeRequest(
            "get",
            "/api/v1/analytics?timeframe=today"
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Analytics data");
    });

    // Edge cases
    it("should return error for invalid frame", async () => {
        const res = await makeRequest("get", "/api/v1/analytics?timeframe=");
        expect(res.status).toBe(httpStatus.BAD_REQUEST);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid timeframe");
    });
});
