import PDFDocument from "pdfkit";

import { ImageSrc } from "../types/types";

import bwipjs from "bwip-js";

import { Response } from "express";

import { UserData } from "../types/types";

import { formatDate, generateRandomNumber, getValueInMoney } from "./utils";

export async function createPDF(
  res: Response,
  userData: UserData,
  measuredValue: number,
  isPreview: boolean,
  measure_type: string
) {
  const { email, cpf, name, address } = userData;

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${
      isPreview ? "fatura-" : "previa-de-fatura-"
    }${name}-${formatDate(new Date(), "-")}.pdf`
  );

  doc.pipe(res);

  doc.fontSize(18).text("Fatura", { align: "center" });

  doc.moveDown();
  doc
    .fontSize(12)
    .text(`Número da Fatura: ${generateRandomNumber()}`, { align: "left" })
    .text(`Data: ${formatDate(new Date(), "-")}`, { align: "left" })
    .moveDown();

  doc.text(`Cliente: ${name}`);
  doc.text(`CPF: ${cpf}`);
  doc.text(`Email: ${email}`);
  doc.text(`Endereço: ${address}`);
  doc.moveDown();

  doc.text("Detalhes da medição:", { underline: true });
  doc.text(
    `Valor medido no ${
      measure_type === "WATER" ? "Hidrômetro" : "Gasômetro"
    }: ${measuredValue} litros.`
  );
  doc.moveDown();

  doc.text(`Total: R$ ${getValueInMoney(measuredValue, measure_type)}`);
  doc.moveDown();

  try {
    // Geração do código de barras com async/await
    const pngBuffer = await generateBarcodeBuffer({
      bcid: "code128",
      text: String(measuredValue),
      scale: 10,
      height: 2,
      includetext: false,
      textxalign: "center",
    });

    // Adicionar o código de barras ao PDF
    doc.image(pngBuffer as ImageSrc, 60, 700, { width: 500 });
    doc.text(`Código de barras para pagamento da fatura`, 185, 685);
  } catch (err) {
    console.error("Erro ao gerar código de barras:", err);
  }

  // Finalizar o PDF
  doc.end();
}

function generateBarcodeBuffer(options: bwipjs.RenderOptions) {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer(options, (err, buffer) => {
      if (err) {
        return reject(err);
      }
      resolve(buffer);
    });
  });
}
