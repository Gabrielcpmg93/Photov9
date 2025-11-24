import { GoogleGenAI, Type } from "@google/genai";

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates a creative caption and tags for an image using Gemini.
 * Includes robust error handling to prevent application crashes (White/Blue screens)
 * if the API key is missing or the service is unreachable (404).
 */
export const analyzeImageForPost = async (base64Image: string): Promise<{ caption: string; tags: string[] }> => {
  try {
    const apiKey = process.env.API_KEY;
    
    // 1. Guard against missing API Key
    if (!apiKey) {
      console.warn("Gemini API Key is missing. Using fallback data.");
      throw new Error("API_KEY_MISSING");
    }

    // Initialize Gemini Client inside the function to ensure API_KEY is available and fresh
    const ai = new GoogleGenAI({ apiKey });

    // Remove header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, '');

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from header
              data: cleanBase64
            }
          },
          {
            text: "Generate a creative, engaging social media caption for this image. Also provide 3-5 relevant hashtags as a JSON array. Return the response as a JSON object with keys 'caption' and 'tags'."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response text from AI");

    const parsed = JSON.parse(resultText);
    return {
      caption: parsed.caption || "Just posted a photo!",
      tags: parsed.tags || []
    };

  } catch (error: any) {
    // 2. Handle specific 404 NOT_FOUND errors gracefully
    if (error.message && error.message.includes("404")) {
       console.error("Gemini Model Not Found (404). Check region availability or model name.", error);
    } else {
       console.error("Gemini analysis failed:", error);
    }

    // 3. Fallback data prevents app crash
    return {
      caption: "Check out this amazing photo! ✨",
      tags: ["#photo", "#moments", "#life"]
    };
  }
};