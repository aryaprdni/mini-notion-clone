import { User } from "@prisma/client";

export type CreateUserRequest = {
    email: string;
    password: string;
    token?: string;
}

export type LoginUserRequest = {
    email: string;
    password: string;
}

export type UserResponse = {
    email: string;
    token?: string;
}

export function toUserResponse(user: User): UserResponse {
    return {
        email: user.email,
    }
}