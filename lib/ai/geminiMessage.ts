// lib/ai/geminiMessage.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateOpportunityMessage({
  stockSymbol,
  stockName,
  alertType,
  conditionType,
}: {
  stockSymbol: string;
  stockName: string;
  alertType: "price" | "marketCap";
  conditionType: "greater" | "less" | "equal";
}) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
  Write a short, professional, and optimistic stock opportunity message for an investment email.
  The stock is ${stockName} (${stockSymbol}).
  The alert was triggered because its ${alertType} is ${conditionType} than the target.
  Use a confident and informative tone (like a financial advisor or market analyst).
  You may include one or two relevant emojis such as 📈📊💰🔥✅ to enhance tone.
  Do NOT use any special characters such as *, #, _, -, ~, or quotation marks.
  Do NOT start with titles like "Opportunity Alert" or similar phrases.
  Return only clean, natural text (1–2 sentences).`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
