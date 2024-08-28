import "dotenv/config";
import connectDB from "./database/database";
import express, { Request, Response } from "express";

const app = express();
const port = 80;

connectDB();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
