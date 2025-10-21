import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
    getBudgetPercentages,
    updateBudgetPercentages,
} from "../controllers/budget.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getBudgetPercentages);
router.put("/", updateBudgetPercentages);

export default router;
