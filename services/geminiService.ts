import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeFinancials = async (data: any) => {
  try {
    const dataString = JSON.stringify(data);
    const prompt = `
      Actúa como un experto consultor de negocios deportivos. 
      Analiza los siguientes datos de ingresos de un complejo deportivo:
      ${dataString}
      
      Proporciona un resumen ejecutivo breve (máximo 3 párrafos) con:
      1. Tendencias principales.
      2. Una recomendación estratégica para aumentar ingresos.
      
      Mantén el tono profesional, minimalista y directo.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "No se pudo generar el análisis en este momento. Verifique su conexión o clave API.";
  }
};