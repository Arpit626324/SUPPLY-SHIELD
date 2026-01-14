
import { GoogleGenAI, Type } from "@google/genai";
import { SupplierEvent, EventType } from "../types";
import { GEMINI_MODEL } from "../constants";

export const extractSupplierEvent = async (emailText: string): Promise<SupplierEvent> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: `Extract the following supplier event details from this email: "${emailText}"`,
    config: {
      systemInstruction: "You are an expert procurement analyst. Extract structured details from informal supplier emails. If a part name isn't explicit, infer the most likely automotive component or set it to null. Use DELAY, SHORTAGE, QUALITY, or OTHER for event_type.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          event_type: { type: Type.STRING, enum: ["DELAY", "SHORTAGE", "QUALITY", "OTHER"] },
          delay_hours: { type: Type.NUMBER, nullable: true },
          reason: { type: Type.STRING },
          supplier_name: { type: Type.STRING },
          part_name: { type: Type.STRING, nullable: true },
          expected_recovery_date: { type: Type.STRING, nullable: true },
        },
        required: ["event_type", "reason", "supplier_name"],
      },
    },
  });

  if (!response.text) throw new Error("Failed to extract data from email.");
  return JSON.parse(response.text.trim()) as SupplierEvent;
};
