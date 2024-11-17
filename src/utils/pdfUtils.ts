import PDFDocument from "pdfkit";

import { Response } from "express";

export function createPDF(
  res: Response,
  measuredValue?: string,
  isPreview?: boolean
) {
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=fatura.pdf");

  doc.pipe(res);

  doc.fontSize(18).text("Fatura", { align: "center" });

  doc.moveDown();
  doc
    .fontSize(12)
    .text("Número da Fatura: 12345", { align: "left" })
    .text("Data: 2024-11-16", { align: "left" })
    .moveDown();

  doc.text("Cliente: João da Silva");
  doc.text("Endereço: Rua Exemplo, 123, Lavras/MG");
  doc.moveDown();

  doc.text("Detalhes da Compra:", { underline: true });
  doc.text("Produto 1: R$ 50,00");
  doc.text("Produto 2: R$ 25,00");
  doc.text("Produto 3: R$ 30,00");
  doc.moveDown();

  doc.text("Total: R$ 105,00");
  doc.moveDown();

  doc.text("Obrigado pela sua compra!", { align: "center" });

  doc.end();
}
