import express from "express";
import dotenv from "dotenv";

dotenv.config({});

import authRoutes from "./routes/auth.routes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
