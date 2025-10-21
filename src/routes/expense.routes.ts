import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
    createExpense,
    deleteExpense,
    getAllExpenses,
    updateExpense,
} from "../controllers/expense.controller";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createExpense);
router.get("/", getAllExpenses);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

export default router;
