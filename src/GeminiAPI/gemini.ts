import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

import fs from "fs";

import path from "path";

import { MeasureReturn, ProofOfPayment } from "../types/types";

import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY || "");

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function getMeasure(
  file: any,
  measureType: string
): Promise<MeasureReturn> {
  const filePath = path.resolve(__dirname, `../../tmp/${file.filename}`);

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: file.mimetype,
    displayName: `Medidor de ${measureType === "Water" ? "Água" : "Gás"}`,
  });

  fs.unlink(filePath, (err) => {});

  const { uri } = await fileManager.getFile(uploadResponse.file.name);

  const responseData = await model.generateContent([
    `Give me the measurement calculated by this ${measureType} meter. (Just answer in the format "value"). If you cannot recognize the image because of the quality of it, just answer "BAD QUALITY". If the image is not of a Water or Gas meter, just answer "NOT METER".`,
    {
      fileData: {
        fileUri: uri,
        mimeType: uploadResponse.file.mimeType,
      },
    },
  ]);

  const value = responseData?.response?.text();

  return {
    value,
  };
}

export async function getProofOfPayment(
  file: any
): Promise<ProofOfPayment | null> {
  const filePath = path.resolve(__dirname, `../../tmp/${file.filename}`);

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: file.mimetype,
    displayName: `Prova de pagamento de boleto.`,
  });

  fs.unlink(filePath, (err) => {});

  const { uri } = await fileManager.getFile(uploadResponse.file.name);

  const responseData = await model.generateContent([
    `Return to me (in JSON format to be parsed) the following values of the fields: 'Fatura', 'Valor pago', 'CPF', 'Data de pagamento'. If the is not any of these fields, return the word 'none'.`,
    {
      fileData: {
        fileUri: uri,
        mimeType: uploadResponse.file.mimeType,
      },
    },
  ]);

  const value = responseData?.response?.text();

  if (!value || value.toLowerCase() === "none") {
    return null;
  }

  return JSON.parse(value);
}
