import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../prisma/client";
import { UserRequest } from "../type/user-request";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authMiddleware = async (req: UserRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }

        const payload = jwt.verify(token, JWT_SECRET) as { id: number };

        const user = await prismaClient.user.findUnique({
            where: { id: payload.id },
        });

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
};
