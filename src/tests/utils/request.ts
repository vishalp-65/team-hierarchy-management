import request from "supertest";
import app from "../..";
import { token } from "../mocks/mockData";

export const makeRequest = async (
    method: string,
    endpoint: string,
    data?: any
) => {
    switch (method) {
        case "get":
            return request(app)
                .get(endpoint)
                .set("Authorization", `Bearer ${token.admin}`);
        case "post":
            return request(app)
                .post(endpoint)
                .set("Authorization", `Bearer ${token.admin}`)
                .send(data);
        case "put":
            return request(app)
                .put(endpoint)
                .set("Authorization", `Bearer${token.admin}`)
                .send(data);
        case "delete":
            return request(app)
                .delete(endpoint)
                .set("Authorization", `Bearer ${token.admin}`);
        default:
            throw new Error("Invalid method");
    }
};
