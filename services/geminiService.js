
import { GoogleGenAI } from "@google/genai";

let ai;

/**
 * Lazily initializes and returns the GoogleGenAI instance.
 * This prevents the app from crashing on load if `process.env` is not available.
 * @returns {import("@google/genai").GoogleGenAI}
 */
function getAiInstance() {
  if (!ai) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("VITE_GEMINI_API_KEY is not available. Using fallback description.");
      return null;
    }
    ai = new GoogleGenAI(apiKey);
  }
  return ai;
}

export async function generateProductDescription(product) {
  const prompt = `
    You are a world-class marketing copywriter for a luxury jewelry brand called "Merchant".
    Your tone is elegant, evocative, and sophisticated.
    Generate a compelling and short product description (around 50-70 words) for the following piece of jewelry.
    Do not use markdown or special formatting. Return only the text of the description.

    Product Details:
    - Name: ${product.name}
    - Category: ${product.category}
    - Material: ${product.details.material}
    ${product.details.gemstone ? `- Gemstone: ${product.details.gemstone}` : ''}
    - Style: ${product.details.style}
    
    Write the description now.
  `;

  try {
    const genAI = getAiInstance();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating product description:", error);
    return "Discover the timeless elegance of this exquisite piece, crafted with the finest materials and exceptional attention to detail. A true testament to sophisticated design, it's destined to become a cherished heirloom.";
  }
}
