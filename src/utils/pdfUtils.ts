import PDFDocument from "pdfkit";

import { ImageSrc, ReportData } from "../types/types";

import bwipjs from "bwip-js";

import { Response } from "express";

import { UserData } from "../types/types";

import { formatDate, generateRandomNumber, getValueInMoney } from "./utils";

export async function createPDF(
  res: Response,
  userData: UserData,
  measuredValue: number,
  isDayOfPayment: boolean,
  measure_type: string
) {
  const { email, cpf, name, address } = userData;

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${
      isDayOfPayment ? "fatura-" : "previa-de-fatura-"
    }${name}-${formatDate(new Date(), "-")}.pdf`
  );

  doc.pipe(res);

  doc
    .fontSize(32)
    .text(isDayOfPayment ? "Fatura" : "Prévia de fatura", { align: "center" });

  doc.moveDown();
  doc
    .fontSize(20)
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

  if (isDayOfPayment) {
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

export async function createReportPDF(res: Response, reportData: ReportData) {
  const {
    totalOfBillings,
    quantityOfGasBillings,
    quantityOfWaterBillings,
    totalOfPaidBillings,
    totalOfNotPaidBillings,
    totalOfNotPaidWaterBillings,
    totalOfNotPaidGasBillings,
    totalOfPaidWaterBillings,
    totalOfPaidGasBillings,
    sumOfTotalPaid,
    sumOfTotalNotPaid,
  } = reportData;

  const doc = new PDFDocument({
    margins: { top: 50, left: 50, right: 50, bottom: 50 },
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Relatorio-${formatDate(new Date(), "-")}.pdf`
  );

  doc.pipe(res);

  doc
    .fontSize(24)
    .font("Helvetica-Bold")
    .text("Relatório SmartHydroGas", { align: "center" })
    .moveDown(2);

  doc
    .fontSize(16)
    .font("Helvetica")
    .text(`Data do Relatório: ${formatDate(new Date(), "-")}`)
    .moveDown();

  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Estatísticas do Relatório:")
    .moveDown(0.5);

  doc
    .fontSize(12)
    .font("Helvetica")
    .list([
      `Total de Faturas: ${totalOfBillings}`,
      `Faturas de Gás: ${quantityOfGasBillings}`,
      `Faturas de Água: ${quantityOfWaterBillings}`,
      `Faturas Pagas: ${totalOfPaidBillings}`,
      `Faturas Não Pagas: ${totalOfNotPaidBillings}`,
      `Faturas Não Pagas (Água): ${totalOfNotPaidWaterBillings}`,
      `Faturas Não Pagas (Gás): ${totalOfNotPaidGasBillings}`,
      `Faturas Pagas (Água): ${totalOfPaidWaterBillings}`,
      `Faturas Pagas (Gás): ${totalOfPaidGasBillings}`,
      `Valor Total Pago: R$ ${sumOfTotalPaid}`,
      `Valor Total Não Pago: R$ ${sumOfTotalNotPaid}`,
    ])
    .moveDown(2);

  doc
    .fontSize(10)
    .font("Helvetica-Oblique")
    .text(
      "Este relatório foi gerado automaticamente pelo sistema SmartHydroGas.",
      { align: "center", lineGap: 10 }
    );

  doc.end();
}
