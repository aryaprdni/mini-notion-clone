import express from "express";
import { UserController } from "../controllers/user-controller";

export const publicRouter = express.Router();

publicRouter.post("/users", UserController.register);
publicRouter.post("/users/login", UserController.login);
publicRouter.post("/users/logout", UserController.logout);
