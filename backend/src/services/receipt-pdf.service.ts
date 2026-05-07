import PDFDocument from "pdfkit";
import { Response } from "express";
import pkg from "number-to-words";
const { toWords } = pkg;
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import whatsappHelper from "./whatsapp.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RECEIPTS_DIR = path.join(__dirname, "../../public/receipts");
const LOGO_PATH = path.join(__dirname, "../../public/logo/logo.png");

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
  email?: string;
  transactionNumber: string;
  receiptNumber: string;
  programName?: string;
}

/** Build the PDF buffer matching the ShanthiBhavan receipt format */
export const buildReceiptBuffer = (user: ReceiptUser): Promise<Buffer> => {
  const doc = new PDFDocument({ margin: 50, size: "A4" });
  const buffers: Buffer[] = [];
  doc.on("data", buffers.push.bind(buffers));
  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  const pageWidth = doc.page.width;   // 595
  const margin = 50;
  const contentWidth = pageWidth - margin * 2; // 495

  const addHorizontalLine = (y: number) => {
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor("#cccccc").lineWidth(0.5).stroke();
    doc.strokeColor("#000000").lineWidth(1); // reset
  };

  // ─── HEADER: donor info (left) + logo (right) ───────────────────────────
  let y = 50;
  const logoSize = 80;
  const logoX = pageWidth - margin - logoSize;

  // Logo
  try {
    if (fs.existsSync(LOGO_PATH)) {
      doc.image(LOGO_PATH, logoX, y, { width: logoSize });
    }
  } catch {
    // logo missing — skip silently
  }

  // Donor block (left side, max width to avoid overlapping logo)
  const leftWidth = logoX - margin - 15;

  doc.fontSize(10).font("Helvetica").fillColor("#000000");
  doc.text(user.name, margin, y, { width: leftWidth });
  y = doc.y + 2;

  if (user.address) {
    doc.fontSize(10).font("Helvetica");
    doc.text(user.address, margin, y, { width: leftWidth });
    y = doc.y + 2;
  }

  if (user.phoneNo) {
    doc.fontSize(10).font("Helvetica");
    doc.text(user.phoneNo, margin, y, { width: leftWidth });
    y = doc.y + 2;
  }

  if (user.email) {
    doc.fontSize(10).font("Helvetica");
    doc.text(user.email, margin, y, { width: leftWidth });
    y = doc.y + 2;
  }

  // Move y below the logo if the donor block is shorter
  y = Math.max(y + 10, 50 + logoSize + 10);

  addHorizontalLine(y);
  y += 18;

  // ─── DEAR + THANK YOU ───────────────────────────────────────────────────
  doc.fontSize(10).font("Helvetica-Bold").fillColor("#000000");
  doc.text(`Dear ${user.name}`, margin, y, { width: contentWidth });
  y = doc.y + 4;

  doc.fontSize(10).font("Helvetica");
  doc.text(
    `Thank you for making a contribution of Rs ${user.amount.toLocaleString("en-IN")} on Shanthibhavan. Please keep this written acknowledgement of your payment for your tax records.`,
    margin, y, { width: contentWidth }
  );
  y = doc.y + 14;

  // ─── PAYMENT RECEIPT HEADING ────────────────────────────────────────────
  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("Payment Receipt", margin, y, { width: contentWidth });
  y = doc.y + 4;

  doc.fontSize(10).font("Helvetica");
  doc.text(
    `We confirm the receipt of payment from Mr/Ms/Mrs ${user.name} as per details below:-`,
    margin, y, { width: contentWidth }
  );
  y = doc.y + 12;

  // ─── TABLE ──────────────────────────────────────────────────────────────
  const amountInWords = toWords(user.amount)
    .replace(/\b\w/g, (c: string) => c.toUpperCase());

  const programLabel = user.programName || "ShanthiBhavan Palliative Hospital";

  const tableRows = [
    ["Receipt No", user.receiptNumber],
    ["Payment date", user.date],
    ["Transaction Number", user.transactionNumber],
    ["Generous Contribution Received", `Rs ${user.amount.toLocaleString("en-IN")}`],
    ["Generous Contribution Received (Words)", amountInWords],
    ["Towards (Nonprofit/Program Name)", programLabel],
  ];

  const col1W = 220;
  const col2W = contentWidth - col1W;
  const cellPadX = 8;
  const cellPadY = 8;
  const minRowHeight = 30;

  let tableY = y;
  tableRows.forEach((row) => {
    const col1TextH = doc.heightOfString(row[0], { width: col1W - cellPadX * 2 });
    const col2TextH = doc.heightOfString(row[1], { width: col2W - cellPadX * 2 });
    const rowH = Math.max(minRowHeight, col1TextH + cellPadY * 2, col2TextH + cellPadY * 2);

    // Cell borders
    doc.rect(margin, tableY, col1W, rowH).strokeColor("#aaaaaa").lineWidth(0.5).stroke();
    doc.rect(margin + col1W, tableY, col2W, rowH).strokeColor("#aaaaaa").lineWidth(0.5).stroke();

    // Cell text
    doc.fontSize(10).font("Helvetica").fillColor("#000000").strokeColor("#000000").lineWidth(1);
    doc.text(row[0], margin + cellPadX, tableY + cellPadY, { width: col1W - cellPadX * 2 });
    doc.text(row[1], margin + col1W + cellPadX, tableY + cellPadY, { width: col2W - cellPadX * 2 });

    tableY += rowH;
  });

  y = tableY + 18;

  // ─── 80G NOTICE ─────────────────────────────────────────────────────────
  doc.fontSize(10).font("Helvetica").fillColor("#000000");
  doc.text(
    "Payment given to this Trust is eligible for deduction u/s 80G (5) of Income Tax Act 1961 as per Registration no. AAATF4482H/09/16-17/T0072/80G dated 30.09.2016, allotted to the trust by Commissioner of Income Tax (Exemptions), Kochi.",
    margin, y, { width: contentWidth }
  );
  y = doc.y + 16;

  addHorizontalLine(y);
  y += 14;

  // ─── FOR CLARIFICATION ONLY ─────────────────────────────────────────────
  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("FOR CLARIFICATION ONLY", margin, y, { width: contentWidth });
  y = doc.y + 6;

  doc.fontSize(10).font("Helvetica");
  doc.text(
    "This is an electronically generated receipt and does not require further validation.",
    margin, y, { width: contentWidth }
  );
  y = doc.y + 14;

  addHorizontalLine(y);
  y += 14;

  // ─── REGISTERED OFFICE ──────────────────────────────────────────────────
  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("Registered office address: ", margin, y, { continued: true, width: contentWidth });
  doc.font("Helvetica").text(
    "Shanthibhavan Palliative Hospital A Division of Franciscan Sisters of St. Clare Charitable Trust,Mountain of Mercy, Pallissery,Arattupuzha.P.O, Thrissur - 680562,9744342009",
    { width: contentWidth }
  );
  y = doc.y + 8;

  // ─── CUSTOMER CARE ──────────────────────────────────────────────────────
  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("Customer Care: ", margin, y, { continued: true, width: contentWidth });
  doc.font("Helvetica").text(
    `If you have any question regarding this 80G tax deduction certificate, kindly get in touch with our Customer Care team at office@shanthibhavan.in by quoting the Transaction Reference Number`,
    { width: contentWidth }
  );

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

  const backendUrl = (process.env.BACKEND_URL || "http://localhost:3003").replace(/\/$/, "");
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
