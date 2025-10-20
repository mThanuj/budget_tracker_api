import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import bcrypt from "bcryptjs";
import { JwtPayload, sign } from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        const userInDb = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userInDb) {
            return res.status(400).json({
                success: false,
                error: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const createdUser = await prisma.user
            .create({
                data: {
                    name,
                    email,
                    password_hash: hashedPassword,
                    needs_percentage: 50.0,
                    wants_percentage: 30.0,
                    savings_percentage: 20.0,
                },
            })
            .then((u) => ({ name: u.name, email: u.email, id: u.id }));

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: createdUser,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in register user",
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const userInDb = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!userInDb) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            userInDb.password_hash,
        );

        if (!passwordMatches) {
            return res.status(400).json({
                success: false,
                error: "Invalid credentials",
            });
        }

        const jwtPayload: JwtPayload = {
            sub: userInDb.id,
            name: userInDb.name,
            email: userInDb.email,
        };

        const token = sign(jwtPayload, process.env.JWT_SECRET!);

        res.status(200).json({
            success: true,
            message: "User logged in",
            token,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in login user",
        });
    }
};
