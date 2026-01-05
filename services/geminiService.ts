
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, BankAccount, Category } from "../types";

// @fix: Correct initialization of GoogleGenAI using process.env.API_KEY directly
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  transactions: Transaction[], 
  accounts: BankAccount[],
  categories: Category[]
) => {
  const ai = getAI();
  const context = {
    totalBalance: accounts.reduce((acc, curr) => acc + curr.balance, 0),
    accounts: accounts.map(a => ({ name: a.name, balance: a.balance })),
    recentTransactions: transactions.slice(0, 20).map(t => ({
      type: t.type,
      amount: t.amount,
      category: categories.find(c => c.id === t.categoryId)?.name || 'Unknown',
      date: t.date
    }))
  };

  const prompt = `分析這些財務數據並提供專業、友好的建議。語言：繁體中文 (台灣)。
    數據：${JSON.stringify(context)}
    提供一個健康分數 (0-100)，消費習慣總結，以及 3 個可執行的建議。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            healthScore: { type: Type.NUMBER }
          },
          required: ["summary", "suggestions", "healthScore"]
        }
      }
    });
    // @fix: Use response.text property directly as per the guidelines
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return {
      summary: "暫時無法產生 AI 分析。請稍後再試。",
      suggestions: ["維持記帳習慣", "檢查大額支出", "定期審視預算"],
      healthScore: 70
    };
  }
};

export const parseNaturalLanguageTransaction = async (text: string, categories: Category[]) => {
  const ai = getAI();
  const prompt = `將以下記帳文字解析為 JSON 格式。文字："${text}"。
    當前日期：${new Date().toISOString().split('T')[0]}。
    分類列表：${categories.map(c => `${c.id}:${c.name}`).join(', ')}。
    請識別金額、類型(expense或income)、分類ID、備註。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            type: { type: Type.STRING, description: "expense or income" },
            categoryId: { type: Type.STRING },
            note: { type: Type.STRING },
            date: { type: Type.STRING, description: "YYYY-MM-DD" }
          },
          required: ["amount", "type", "categoryId", "note", "date"]
        }
      }
    });
    // @fix: Use response.text property directly
    return JSON.parse(response.text || 'null');
  } catch (error) {
    console.error("AI Parsing failed:", error);
    return null;
  }
};
