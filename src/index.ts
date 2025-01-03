import "dotenv/config";
import connectDB from "./database/database";
import express from "express";

import bodyParser from "body-parser";

import path from "path";

import { router as uploadRoutes } from "./routes/uploadRoutes";
import { router as userRoutes } from "./routes/userRoutes";

import { sessionConfig } from "./config/sessionConfig";

import swaggerUi from "swagger-ui-express";

import YAML from "yamljs";

const app = express();
const port = 80;
const swaggerFilePath = path.resolve(__dirname, "./swagger/swagger.yaml");

connectDB();

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sessionConfig);

app.use("/", uploadRoutes);
app.use("/", userRoutes);

const swaggerDocument = YAML.load(swaggerFilePath);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
