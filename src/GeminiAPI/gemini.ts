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
  base64String: string,
  measureType: string,
  customer_code: string,
  measure_datetime: Date
): Promise<MeasureReturn> {
  const fileName = `${customer_code}-${measure_datetime.toString()}-${measureType}`;
  const filePath = path.resolve(__dirname, `../../tmp/${fileName}.png`);

  base64ToImage(base64String, filePath);

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: "image/png",
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

function base64ToImage(base64String: string, filePath: string) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  fs.writeFileSync(filePath, imageBuffer);
}
