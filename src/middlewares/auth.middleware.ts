import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        if (!header.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized",
            });
        }

        const token = header.substring(8);

        let payload = jwt.verify(token, process.env.JWT_SECRET!);

        if (!payload) {
            return res.status(401).json({
                success: false,
                error: "Invalid JWT",
            });
        }

        if (typeof payload === "string") {
            return res.status(401).json({
                success: false,
                error: "Invalid JWT",
            });
        }

        req.user = {
            id: payload["sub"]!,
            name: payload["name"],
            email: payload["email"],
        };

        next();
    } catch (e) {
        return res.status(500).json({
            success: false,
            error: "Something happened in authMiddleware",
        });
    }
};
