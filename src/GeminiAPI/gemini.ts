import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export const fileManager = new GoogleAIFileManager(
  process.env.GEMINI_API_KEY || ""
);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
