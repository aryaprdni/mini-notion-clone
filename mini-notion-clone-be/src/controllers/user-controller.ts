import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/user-model";
import { UserService } from "../services/user-service";
import { UserRequest } from "../type/user-request";

export class UserController {
    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const request: CreateUserRequest = req.body as CreateUserRequest;
            const response = await UserService.register(request);
            res.status(200).json({
                data: response
            })
        } catch (e) {
            next(e);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const request: LoginUserRequest = req.body as LoginUserRequest;
            const { token, ...user } = await UserService.login(request);

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ data: user });
        } catch (e) {
            next(e);
        }
    }

    static async logout(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                sameSite: "lax",
                secure: process.env.NODE_ENV === "production",
            });

            return res.status(200).json({
                message: "Logout successful",
            });
        } catch (e) {
            next(e);
        }
    }
}