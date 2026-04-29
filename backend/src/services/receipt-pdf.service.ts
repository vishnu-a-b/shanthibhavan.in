import PDFDocument from "pdfkit";
import { Response } from "express";
import { toWords } from "number-to-words";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import whatsappHelper from "./whatsapp.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RECEIPTS_DIR = path.join(__dirname, "../../public/receipts");

// Ensure receipts directory exists
if (!fs.existsSync(RECEIPTS_DIR)) {
  fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
}

export interface ReceiptUser {
  name: string;
  amount: number;
  date: string;
  phoneNo: string;
  address: string;
  transactionNumber: string;
  receiptNumber: string;
  programName?: string;
}

/** Build the PDF buffer without sending anything to HTTP */
export const buildReceiptBuffer = (user: ReceiptUser): Promise<Buffer> => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });
  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));
  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  const addHorizontalLine = (y: number, margin = 40) => {
    doc.moveTo(margin, y).lineTo(doc.page.width - margin, y).stroke("#ddd");
  };

  const getTextHeight = (text: string, width: number, options: any = {}) => {
    return doc.heightOfString(text, { width, ...options });
  };

  let yPosition = 40;

  doc.fontSize(12).font("Helvetica-Bold");
  doc.text("Shanthibhavan Palliative International India", 40, yPosition);
  yPosition += 15;
  doc.text(`PAN: ${process.env.ORG_PAN || '[PAN Not Configured]'}`, 40, yPosition);
  yPosition += 15;
  doc.text("Registered Charitable Trust - 80G Approved", 40, yPosition);

  try {
    const logoPath = path.join(__dirname, "../../public/logo/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, doc.page.width - 140, 20, { width: 75, height: 75 });
    }
  } catch {
    // Logo not found, skip
  }

  yPosition += 30;
  addHorizontalLine(yPosition);
  yPosition += 20;

  doc.fontSize(10).font("Helvetica");
  doc.text("To", 40, yPosition);
  yPosition += 15;
  doc.fontSize(12).font("Helvetica");
  doc.text(user.name, 40, yPosition);
  yPosition += 15;
  doc.fontSize(10).font("Helvetica");

  const addressHeight = getTextHeight(user.address, 250);
  doc.text(user.address, 40, yPosition, { width: 250 });
  yPosition += addressHeight + 5;
  doc.text(user.phoneNo, 40, yPosition);
  yPosition += 25;

  doc.fontSize(11).font("Helvetica");
  doc.text(`Dear `, 40, yPosition, { continued: true });
  doc.font("Helvetica-Bold").text(user.name, { continued: true });
  doc.font("Helvetica").text(",");
  yPosition += 20;

  doc.text(
    `Thank you for your donation of ₹${user.amount.toLocaleString("en-IN")}. Below are the details of your contribution.`,
    40,
    yPosition,
    { width: 500 }
  );
  yPosition += 30;

  doc.fontSize(12).font("Helvetica-Bold");
  doc.text("Receipt", 40, yPosition);
  yPosition += 20;

  doc.fontSize(11).font("Helvetica");
  doc.text(
    `We confirm the receipt of payment from Mr/Ms/Mrs ${user.name} as per details below:-`,
    40,
    yPosition,
    { width: 500 }
  );
  yPosition += 30;

  const amountInWords = toWords(user.amount).replace(/\b\w/g, (c: string) => c.toUpperCase());

  const tableData = [
    ["Receipt No", user.receiptNumber],
    ["Payment Date", user.date],
    ["Transaction Number", user.transactionNumber],
    ["Amount Received", `₹${user.amount.toLocaleString("en-IN")} (${amountInWords} Rupees Only)`],
    ["Towards", "Shanthibhavan Palliative International India"],
  ];

  const tableStartY = yPosition;
  const rowHeight = 25;
  const col1Width = 150;
  const col2Width = 350;

  tableData.forEach((row, index) => {
    const currentY = tableStartY + index * rowHeight;
    doc.rect(40, currentY, col1Width, rowHeight).stroke("#ddd");
    doc.rect(40 + col1Width, currentY, col2Width, rowHeight).stroke("#ddd");
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text(row[0], 50, currentY + 8, { width: col1Width - 20 });
    doc.font("Helvetica");
    doc.text(row[1], 50 + col1Width, currentY + 8, { width: col2Width - 20 });
  });

  yPosition = tableStartY + tableData.length * rowHeight + 20;

  doc.fontSize(11).font("Helvetica-Bold");
  doc.text("Description", 40, yPosition, { continued: true });
  doc.font("Helvetica").text(" : This is a gift received to support the free treatment of bedridden patients.");
  yPosition += 30;

  addHorizontalLine(yPosition);
  yPosition += 15;

  doc.fontSize(11).font("Helvetica-Bold");
  doc.text("Declaration", 40, yPosition, { continued: true });
  doc.font("Helvetica").text(
    " : This receipt acknowledges that the above amount was donated to Shanthibhavan Palliative International India. No goods or services were received in return for this donation. This donation is eligible for tax deduction under Section 80G of the Income Tax Act, 1961.",
    { width: 500 }
  );
  yPosition += 50;

  addHorizontalLine(yPosition);
  yPosition += 15;

  doc.fontSize(11).font("Helvetica-Bold");
  doc.text("Registered office address", 40, yPosition, { continued: true });
  doc.font("Helvetica").text(
    " : Shanthibhavan Palliative International India, Alukkaparambil House, Karukulangara, Irinjalakuda, Thrissur, Kerala-680121, India",
    { width: 500 }
  );
  yPosition += 40;

  addHorizontalLine(yPosition);
  yPosition += 15;

  doc.fontSize(10).font("Helvetica");
  doc.text(
    "This receipt can be used for claiming a tax deduction under Section 80G of Income Tax Act, 1961.",
    40, yPosition, { width: 500 }
  );
  yPosition += 15;
  doc.text("For any enquiries, please contact us at:", 40, yPosition);
  yPosition += 12;
  doc.text("Email: operationssbind@palliativeinternational.com", 40, yPosition);
  yPosition += 12;
  doc.text("Phone: +91 9496277968", 40, yPosition);
  yPosition += 12;
  doc.text("Website: www.palliativeinternational.com", 40, yPosition);
  yPosition += 20;

  addHorizontalLine(yPosition);
  yPosition += 15;

  doc.fontSize(10).font("Helvetica");
  doc.text(
    "Shanthibhavan Palliative International India is registered under Section 80G of the Income Tax Act, 1961. Donations made to this organization are eligible for tax deduction as per applicable laws.",
    40, yPosition, { width: 500 }
  );
  yPosition += 40;

  doc.fontSize(9).font("Helvetica");
  const footerText = "This is an electronically generated receipt and does not require a signature.";
  const footerWidth = doc.widthOfString(footerText);
  const centerX = (doc.page.width - footerWidth) / 2;
  doc.fillColor("#666").text(footerText, centerX, yPosition);

  doc.end();
  return pdfPromise;
};

/**
 * Save receipt PDF to disk under public/receipts/ and return the public URL.
 */
export const saveReceiptToFile = async (user: ReceiptUser): Promise<string> => {
  const buffer = await buildReceiptBuffer(user);
  const filename = `${user.receiptNumber}.pdf`;
  const filePath = path.join(RECEIPTS_DIR, filename);
  fs.writeFileSync(filePath, buffer);

  const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3003').replace(/\/$/, '');
  return `${backendUrl}/public/receipts/${filename}`;
};

export const generateReceiptPDFIndia = async (
  res: Response,
  user: ReceiptUser
) => {
  const pdfBuffer = await buildReceiptBuffer(user);

  try {
    await whatsappHelper.sendDonationReceipt(
      user.phoneNo,
      pdfBuffer,
      `${user.receiptNumber}.pdf`
    );
  } catch (whatsappError) {
    console.error("Failed to send WhatsApp message:", whatsappError);
  }

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${user.receiptNumber}.pdf"`,
    "Content-Length": pdfBuffer.length,
  });

  res.end(pdfBuffer);
};
