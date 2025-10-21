import { Response } from "express";
import { UserInfoRequest } from "../types/UserInfoRequest";
import { Categories } from "../generated/prisma";
import { prisma } from "../config/prisma";

const isValidCategory = (
    category: string | null,
): Categories | undefined | string => {
    if (category === null) {
        return "NA";
    }

    return Object.values(Categories).find((c) => c == category);
};

export const createSubCategory = async (
    req: UserInfoRequest,
    res: Response,
) => {
    try {
        const { name, category } = req.body;

        const validCategory = isValidCategory(category);

        if (!validCategory || typeof validCategory === "string") {
            return res.status(400).json({
                success: false,
                error: "Invalid category",
            });
        }

        const existingSubCategory = await prisma.subCategories.findFirst({
            where: {
                name,
                userId: req.user!.id,
            },
        });

        if (existingSubCategory) {
            return res.status(400).json({
                success: false,
                error: "SubCategory name already exists",
            });
        }

        const createdSubCategory = await prisma.subCategories.create({
            data: {
                name,
                category: validCategory,
                userId: req.user!.id,
            },
            select: {
                id: true,
                name: true,
                category: true,
            },
        });

        res.status(201).json({
            success: true,
            message: "SubCategory created successfully",
            subCategory: createdSubCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something happened in createSubCategory",
        });
    }
};

export const getAllSubCategoriesOfUser = async (
    req: UserInfoRequest,
    res: Response,
) => {
    try {
        const userId = req.user!.id;

        const subCategories = await prisma.subCategories.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                name: true,
                category: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "Fetched all sub categories",
            subCategories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something happened in createSubCategory",
        });
    }
};

export const updateSubCategory = async (
    req: UserInfoRequest,
    res: Response,
) => {
    try {
        const subCategoryId = req.params.id;
        const { name, category } = req.body;

        const existingSubCategory = await prisma.subCategories.findUnique({
            where: {
                id: subCategoryId,
            },
        });

        if (!existingSubCategory) {
            return res.status(404).json({
                success: false,
                error: "SubCategory not found",
            });
        }

        let validCategory: Categories | undefined | string = undefined;
        if (category !== undefined) {
            validCategory = isValidCategory(category);
            if (!validCategory || validCategory === "NA") {
                return res.status(400).json({
                    success: false,
                    error: "Invalid category",
                });
            }
        }

        const updateData: any = {};
        if (name) {
            updateData.name = name;
        }
        if (validCategory) {
            updateData.category = validCategory;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: "Nothing to update",
            });
        }

        const updatedSubCategory = await prisma.subCategories.update({
            where: {
                id: subCategoryId,
            },
            data: updateData,
            select: {
                id: true,
                name: true,
                category: true,
            },
        });

        return res.status(200).json({
            success: true,
            message: "SubCategory updated successfully",
            subCategory: updatedSubCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something happened in updateSubCategory",
        });
    }
};

export const deleteSubCategory = async (
    req: UserInfoRequest,
    res: Response,
) => {
    try {
        const userId = req.user!.id;
        const subCategoryId = req.params.id;

        const existingSubCategory = await prisma.subCategories.findUnique({
            where: {
                id: subCategoryId,
            },
        });

        if (!existingSubCategory) {
            return res.status(400).json({
                success: false,
                error: "SubCategory does not exist",
            });
        }

        if (existingSubCategory.userId !== userId) {
            return res.status(400).json({
                success: false,
                error: "SubCategory does not belong to user",
            });
        }

        const deletedSubCategory = await prisma.subCategories.delete({
            where: {
                id: subCategoryId,
            },
            select: {
                id: true,
                name: true,
                category: true,
            },
        });

        res.status(200).json({
            success: true,
            message: "SubCategory deleted successfully",
            subCategory: deletedSubCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: "Something happened in deleteSubCategory",
        });
    }
};
