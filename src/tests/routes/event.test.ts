import httpStatus from "http-status";
import { mockEvent } from "../mocks/mockData";
import { makeRequest } from "../utils/request";

describe("Event Routes", () => {
    it("should fetch all events and return success", async () => {
        const res = await makeRequest("get", "/api/v1/event");
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should create an event successfully", async () => {
        const res = await makeRequest("post", "/api/v1/event", mockEvent);
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should update an event successfully", async () => {
        const res = await makeRequest(
            "put",
            `/api/v1/event/${mockEvent.id}`,
            mockEvent
        );
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should delete an event successfully", async () => {
        const res = await makeRequest(
            "delete",
            `/api/v1/event/${mockEvent.id}`
        );
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });
});
