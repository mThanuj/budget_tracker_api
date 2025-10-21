import { Response } from "express";
import { UserInfoRequest } from "../types/UserInfoRequest";
import { prisma } from "../config/prisma";

export const getBudgetPercentages = async (
    req: UserInfoRequest,
    res: Response,
) => {
    try {
        const userId = req.user!.id;

        const budgetPercentages = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                needs_percentage: true,
                wants_percentage: true,
                savings_percentage: true,
            },
        });

        if (!budgetPercentages) {
            return res.status(400).json({
                success: false,
                error: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Budget Percentages fetched successfully",
            budgetPercentages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in getBudgetPercentages",
        });
    }
};

export const updateBudgetPercentages = async (
    req: UserInfoRequest,
    res: Response,
) => {
    try {
        const userId = req.user!.id;
        const { needs_percentage, wants_percentage, savings_percentage } =
            req.body;

        if (needs_percentage + wants_percentage + savings_percentage !== 100) {
            return res.status(400).json({
                success: false,
                error: "Percentages invalid",
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                error: "Invalid user",
            });
        }

        const updatedBudgetPercentages = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                needs_percentage,
                wants_percentage,
                savings_percentage,
            },
            select: {
                needs_percentage: true,
                wants_percentage: true,
                savings_percentage: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "Updated Budget successfully",
            updatedBudgetPercentages,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in updateBudgetPercentages",
        });
    }
};
