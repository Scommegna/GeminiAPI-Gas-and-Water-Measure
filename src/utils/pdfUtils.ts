import PDFDocument from "pdfkit";

import bwipjs from "bwip-js";

import { Response } from "express";

import { UserData } from "../types/types";

import { formatDate, generateRandomNumber, getValueInMoney } from "./utils";

export function createPDF(
  res: Response,
  userData: UserData,
  measuredValue?: number,
  isPreview?: boolean,
  measure_type?: string
) {
  const { id, email, cpf, name, address } = userData;

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

  doc.end();
}

function createBarCode(code: number) {
  bwipjs.toBuffer({
    bcid: "code128",
    text: String(code),
    scale: 3,
  });
}
