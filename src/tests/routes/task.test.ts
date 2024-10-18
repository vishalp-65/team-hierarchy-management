import httpStatus from "http-status";
import { mockTask } from "../mocks/mockData";
import { makeRequest } from "../utils/request";

describe("Task Routes", () => {
    it("should fetch tasks by filter and return success", async () => {
        const res = await makeRequest(
            "get",
            `/api/v1/tasks?sortBy=status&assignedTo=${mockTask.assignee.id}&taskType=your&dueDatePassed=0&order=asc`
        );
        expect(res.status).toBe(httpStatus.OK);
        expect(res.body.success).toBe(true);
    });

    it("should create a task successfully", async () => {
        const res = await makeRequest("post", "/api/v1/tasks", mockTask);
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should update a task successfully", async () => {
        const res = await makeRequest(
            "put",
            `/api/v1/tasks/${mockTask.id}`,
            mockTask
        );
        expect(res.status).toBe(httpStatus.CREATED);
        expect(res.body.success).toBe(true);
    });

    it("should delete a task successfully", async () => {
        const res = await makeRequest("delete", `/api/v1/tasks/${mockTask.id}`);
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
    });
});
