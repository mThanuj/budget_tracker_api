import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
    createSubCategory,
    deleteSubCategory,
    getAllSubCategoriesOfUser,
    updateSubCategory,
} from "../controllers/subcategories.controller";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createSubCategory);
router.get("/", getAllSubCategoriesOfUser);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
