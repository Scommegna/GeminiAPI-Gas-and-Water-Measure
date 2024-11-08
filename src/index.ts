import "dotenv/config";
import connectDB from "./database/database";
import express from "express";

import bodyParser from "body-parser";

import { router as uploadRoutes } from "./routes/uploadRoutes";
import { router as userRoutes } from "./routes/userRoutes";

import { sessionConfig } from "./config/sessionConfig";

const app = express();
const port = 80;

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionConfig);

app.use("/", uploadRoutes);
app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
