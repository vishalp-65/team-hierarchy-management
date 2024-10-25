import { Response } from "express";

// Define an interface for the response payload
interface ResponsePayload {
    success: boolean;
    message: string;
    data?: any;
}

// Generic response handler
const sendResponse = (
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data: any = null
): Response<ResponsePayload> => {
    return res.status(statusCode).json({
        success,
        message,
        data,
    });
};

export default sendResponse;
