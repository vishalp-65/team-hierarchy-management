import { Request, Response, NextFunction } from "express";
import { Server, Socket } from "socket.io";

const catchAsync =
    (fn: any) => (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err) => next(err));
    };

const catchAsyncSocket = (fn: any) => {
    return (io: Server, socket: Socket, ...args: any[]) => {
        Promise.resolve(fn(io, socket, ...args)).catch((err) => {
            console.error("Socket Error:", err);
            socket.emit("error", {
                message: "An error occurred",
                error: err.message || err,
            });
        });
    };
};

export { catchAsync, catchAsyncSocket };
