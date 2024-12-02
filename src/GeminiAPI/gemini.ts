import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

import fs from "fs";

import path from "path";

import { MeasureReturn } from "../types/types";

import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function getMeasure(
  file: any,
  measureType: string,
  customer_code: string,
  measure_datetime: Date
): Promise<MeasureReturn> {
  const filePath = path.resolve(
    __dirname,
    `../../tmp/${file.filename}.${file.mimetype.split("/")[1]}`
  );

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: file.mimetype,
    displayName: `Medidor de ${measureType === "Water" ? "Água" : "Gás"}`,
  });

  fs.unlinkSync(filePath);

  const { uri } = await fileManager.getFile(uploadResponse.file.name);

  const responseData = await model.generateContent([
    `Give me the measurement calculated by this ${measureType} meter. (Just answer in the format "value unity")`,
    {
      fileData: {
        fileUri: uri,
        mimeType: uploadResponse.file.mimeType,
      },
    },
  ]);

  const value = Number(responseData?.response?.text().split(" ")[0]);

  return {
    value,
  };
}
