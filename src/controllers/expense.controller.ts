import { Response } from "express";
import { UserInfoRequest } from "../types/UserInfoRequest";
import { prisma } from "../config/prisma";

export const createExpense = async (req: UserInfoRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { amount, description, subCategoryId } = req.body;

        const subCategory = await prisma.subCategories.findUnique({
            where: {
                id: subCategoryId,
            },
        });

        if (!subCategory) {
            return res.status(400).json({
                success: false,
                error: "SubCategoryId invalid",
            });
        }

        if (subCategory.userId !== userId) {
            return res.status(400).json({
                success: false,
                error: "SubCategory does not belong to user",
            });
        }

        const createdExpense = await prisma.expenses.create({
            data: {
                subCategoriesId: subCategoryId,
                userId,
                amount,
                description,
            },
            select: {
                subCategoriesId: true,
                amount: true,
                date: true,
                description: true,
                id: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "Expense created successfully",
            expense: createdExpense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in createExpense",
        });
    }
};

export const getAllExpenses = async (req: UserInfoRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({
                success: false,
                error: "Need month and year",
            });
        }

        const m = Number(month);
        const y = Number(year);

        const startDate = new Date(y, m - 1, 1);
        const endDate = new Date(y, m, 0, 23, 59, 59);

        const expenses = await prisma.expenses.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        res.status(200).json({
            success: true,
            message: "Fetched all expenses in given month",
            expenses,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in getAllExpenses",
        });
    }
};

export const updateExpense = async (req: UserInfoRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = req.params.id;

        const existingExpense = await prisma.expenses.findUnique({
            where: {
                id,
            },
        });

        if (!existingExpense) {
            return res.status(400).json({
                success: false,
                error: "Invalid Expense Id",
            });
        }

        if (existingExpense.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "Expense does not belong to user",
            });
        }
        const existingExpenseDateYear = existingExpense.date.getFullYear();
        const currentDateYear = new Date().getFullYear();

        const existingExpenseDateMonth = existingExpense.date.getMonth();
        const currentDateMonth = new Date().getMonth();

        if (
            currentDateMonth !== existingExpenseDateMonth ||
            currentDateYear !== existingExpenseDateYear
        ) {
            return res.status(403).json({
                success: false,
                error: "Cannot modify expense from other months",
            });
        }

        const { amount, description, date } = req.body;

        const updateData: any = {};

        if (amount) {
            updateData.amount = parseFloat(amount);
        }

        if (description) {
            updateData.description = description;
        }

        if (date) {
            updateData.date = new Date(date);
        }

        const updatedExpense = await prisma.expenses.update({
            where: {
                id,
            },
            data: updateData,
            select: {
                subCategoriesId: true,
                amount: true,
                date: true,
                description: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in updateExpense",
        });
    }
};

export const deleteExpense = async (req: UserInfoRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const id = req.params.id;

        const existingExpense = await prisma.expenses.findUnique({
            where: {
                id,
            },
        });

        if (!existingExpense) {
            return res.status(400).json({
                success: false,
                error: "Invalid Expense Id",
            });
        }

        if (existingExpense.userId !== userId) {
            return res.status(400).json({
                success: false,
                error: "Expense does not belong to user",
            });
        }

        const existingExpenseDateYear = existingExpense.date.getFullYear();
        const currentDateYear = new Date().getFullYear();

        const existingExpenseDateMonth = existingExpense.date.getMonth();
        const currentDateMonth = new Date().getMonth();

        if (
            currentDateMonth !== existingExpenseDateMonth ||
            currentDateYear !== existingExpenseDateYear
        ) {
            return res.status(403).json({
                success: false,
                error: "Cannot delete expense from other months",
            });
        }

        const deletedExpense = await prisma.expenses.delete({
            where: {
                id,
            },
            select: {
                id: true,
                amount: true,
                date: true,
                description: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            expense: deletedExpense,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something went wrong in deleteExpense",
        });
    }
};
