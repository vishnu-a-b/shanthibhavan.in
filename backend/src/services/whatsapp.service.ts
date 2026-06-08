import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface WhatsAppResponse {
  messageId?: string;
  id?: string;
  [key: string]: unknown;
}

const OMNI_API_URL =
  "https://wb.omni.tatatelebusiness.com/whatsapp-cloud/messages";

const getAuthToken = () =>
  process.env.OMNI_API_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZU51bWJlciI6Iis5MTQ4NzY2MTE2MDAiLCJwaG9uZU51bWJlcklkIjoiNTkyODgyNzUzOTE2NjExIiwiaWF0IjoxNzQ1NTg1OTAwfQ.qmjk1dJX9qkcWvshZYdrkN13Bowe74k9qch8w8gWMRA";

const headers = () => ({
  accept: "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
  "Content-Type": "application/json",
});

const extractMessageId = (data: WhatsAppResponse): string =>
  data.messageId || data.id || "sent";

export const whatsappHelper = {
  sendHiMessage: async (phoneNumber: string): Promise<string> => {
    try {
      const response = await axios.post<WhatsAppResponse>(
        OMNI_API_URL,
        {
          to: phoneNumber,
          type: "template",
          source: "external",
          template: {
            name: "welcome",
            language: { code: "en" },
            components: [],
          },
          metaData: { custom_callback_data: "optional_callback_data" },
        },
        { headers: headers() }
      );
      console.log("Hi message sent successfully!");
      return extractMessageId(response.data);
    } catch (error) {
      console.error("Error sending Hi message:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to send Hi message"
        );
      }
      throw new Error("Unexpected error occurred");
    }
  },

  sendSupporterWelcomeMessage: async (
    phoneNumber: string,
    text: string
  ): Promise<string> => {
    try {
      const response = await axios.post<WhatsAppResponse>(
        OMNI_API_URL,
        {
          to: phoneNumber,
          type: "template",
          source: "external",
          template: {
            name: "supporter_welcome",
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [{ type: "text", text }],
              },
            ],
          },
          metaData: { custom_callback_data: "optional_callback_data" },
        },
        { headers: headers() }
      );
      console.log("Supporter welcome message sent successfully!");
      return extractMessageId(response.data);
    } catch (error) {
      console.error("Error sending supporter welcome message:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to send supporter welcome message"
        );
      }
      throw new Error("Unexpected error occurred");
    }
  },

  uploadPDFToStorage: async (
    pdfBuffer: Buffer,
    filename: string
  ): Promise<string> => {
    const tempDir = path.join(__dirname, "../../public/temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const filePath = path.join(tempDir, filename);
    fs.writeFileSync(filePath, pdfBuffer);
    return `${(process.env.BACKEND_URL || "http://localhost:3003").replace(/\/$/, "")}/public/temp/${filename}`;
  },

  sendDonationReceipt: async (
    phoneNumber: string,
    pdfBuffer: any,
    filename: string = `receipt_${Date.now()}.pdf`,
    name: string = "",
    amount: string = ""
  ): Promise<string> => {
    console.log(`[WhatsApp] sendDonationReceipt: to=${phoneNumber}, file=${filename}, bufferSize=${pdfBuffer?.length ?? "N/A"}`);
    try {
      const pdfUrl = await whatsappHelper.uploadPDFToStorage(pdfBuffer, filename);
      console.log(`[WhatsApp] PDF uploaded to: ${pdfUrl}`);

      const components: object[] = [
        {
          type: "header",
          parameters: [
            {
              type: "document",
              document: { link: pdfUrl, filename },
            },
          ],
        },
      ];

      if (name || amount) {
        components.push({
          type: "body",
          parameters: [
            { type: "text", text: name },
            { type: "text", text: amount },
          ],
        });
      }

      const payload = {
        to: phoneNumber,
        type: "template",
        source: "external",
        template: {
          name: "fellowship_payment_receipt",
          language: { code: "en" },
          components,
        },
        metaData: { custom_callback_data: "donation_receipt" },
      };

      console.log(`[WhatsApp] Sending to Omni API: ${JSON.stringify(payload)}`);
      const response = await axios.post<WhatsAppResponse>(
        OMNI_API_URL,
        payload,
        { headers: headers() }
      );

      const msgId = extractMessageId(response.data);
      console.log(`[WhatsApp] Donation receipt sent! messageId=${msgId}, fullResponse=${JSON.stringify(response.data)}`);

      setTimeout(() => {
        try {
          const tempFilePath = path.join(__dirname, "../../public/temp", filename);
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          console.warn("[WhatsApp] Could not clean up temporary file:", cleanupError);
        }
      }, 60000);

      return msgId;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          `[WhatsApp] Omni API error: status=${error.response?.status}, data=${JSON.stringify(error.response?.data)}`
        );
        throw new Error(
          error.response?.data?.message || "Failed to send donation receipt"
        );
      }
      console.error("[WhatsApp] Unexpected error sending donation receipt:", error);
      throw new Error("Unexpected error occurred");
    }
  },

  sendPaymentReminderMessage: async (
    phoneNumber: string,
    name: string,
    amount: string,
    bedNo: string,
    supportLink: string
  ): Promise<string> => {
    try {
      const response = await axios.post<WhatsAppResponse>(
        OMNI_API_URL,
        {
          to: phoneNumber,
          type: "template",
          source: "external",
          template: {
            name: "first_followup_au",
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: name },
                  { type: "text", text: amount },
                  { type: "text", text: bedNo },
                  { type: "text", text: supportLink },
                ],
              },
            ],
          },
          metaData: { custom_callback_data: "first_followup_au" },
        },
        { headers: headers() }
      );
      console.log("Payment reminder message sent successfully!");
      return extractMessageId(response.data);
    } catch (error) {
      console.error("Error sending payment reminder message:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to send payment reminder message"
        );
      }
      throw new Error("Unexpected error occurred");
    }
  },

  /**
   * Send fellowship payment receipt via WhatsApp after a successful payment.
   * Template: fellowship_payment_receipt
   * {{1}} = donor name, {{2}} = donation amount
   */
  sendFellowshipPaymentReceipt: async (
    phoneNumber: string,
    name: string,
    amount: string
  ): Promise<string> => {
    try {
      const response = await axios.post<WhatsAppResponse>(
        OMNI_API_URL,
        {
          to: phoneNumber,
          type: "template",
          source: "external",
          template: {
            name: "fellowship_payment_receipt",
            language: { code: "en" },
            components: [
              {
                type: "body",
                parameters: [
                  { type: "text", text: name },
                  { type: "text", text: amount },
                ],
              },
            ],
          },
          metaData: { custom_callback_data: "fellowship_payment_receipt" },
        },
        { headers: headers() }
      );
      console.log("Fellowship payment receipt sent successfully!");
      return extractMessageId(response.data);
    } catch (error) {
      console.error("Error sending fellowship payment receipt:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ||
            "Failed to send fellowship payment receipt"
        );
      }
      throw new Error("Unexpected error occurred");
    }
  },
};

export default whatsappHelper;
