import "dotenv/config";
import connectDB from "./database/database";
import express, { Request, Response } from "express";

import { router as uploadRoutes } from "./routes/uploadRoutes";

const app = express();
const port = 80;

connectDB();

app.use(express.json({ limit: "10mb" }));

app.use("/", uploadRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
