import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

import fs from "fs";

import path from "path";

import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function getMeasure(base64String: string, measureType: string) {}

function base64ToImage(base64String: string, filePath: string) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  fs.writeFileSync(filePath, imageBuffer);
}
