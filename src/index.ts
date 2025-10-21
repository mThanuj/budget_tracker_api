import express from "express";
import dotenv from "dotenv";

dotenv.config({});

import authRoutes from "./routes/auth.routes";
import subCategoriesRoutes from "./routes/subcategories.routes";
import expensesRoutes from "./routes/expense.routes";
import budgetRoutes from "./routes/budget.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sub-categories", subCategoriesRoutes);
app.use("/api/expenses", expensesRoutes);
app.use("/api/budget", budgetRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
