import { Request } from "express";

export interface UserInfoRequest extends Request {
    user?: {
        id: string;
        name: string;
        email: string;
    };
}
