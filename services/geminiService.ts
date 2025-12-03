import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { TimelineResponse, TimelineEvent, GroundingChunk } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a timeline of facts comparing birth year to present using Gemini 2.5 Flash with Search Grounding.
 */
export const generateTimeline = async (birthYear: number, country: string = '', topics: string[] = [], searchTerm: string = ''): Promise<TimelineResponse> => {
  const modelId = 'gemini-2.5-flash';
  const currentYear = new Date().getFullYear();

  const contextPart = country.trim() ? `Focus on cultural context, facts, and beliefs specifically relevant to ${country}.` : 'Focus on a general global perspective.';
  
  // Special handling for Education to ensure we get "facts taught in school" rather than just "facts about the education system"
  const isEducationTopic = topics.includes('Education');
  const educationInstruction = isEducationTopic 
    ? `CRITICAL FOR EDUCATION TOPIC: Include specific examples of "facts" that were commonly taught in schools around ${birthYear} but are now known to be incorrect or outdated (e.g., Pluto as a planet, the tongue map, electron orbits, historical misconceptions).`
    : '';

  const topicPart = topics.length > 0 
    ? `Focus on items related to these categories: ${topics.join(', ')}. ${educationInstruction}` 
    : 'Include a diverse mix of categories including beliefs, science, health, food, technology, urban legends, and world records/trivia.';

  const searchFocusPart = searchTerm.trim() 
    ? `CRITICAL FOCUS: The user is specifically interested in "${searchTerm}". All generated timeline events MUST relate to the history, evolution, perception, or facts about "${searchTerm}" from ${birthYear} to ${currentYear}.` 
    : '';

  const prompt = `
    I was born in ${birthYear}.
    Generate a list of 7 to 10 significant and interesting items starting from ${birthYear} up to ${currentYear}.
    ${searchFocusPart}
    ${!searchTerm.trim() ? contextPart : ''}
    ${!searchTerm.trim() ? topicPart : ''}

    CRITICAL INSTRUCTION:
    ${searchTerm.trim() ? `Track the evolution of "${searchTerm}" specifically.` : `You MUST include a mix of:
    1. Major beliefs or scientific facts.
    2. "Small facts" or trivia often found in Almanacs, Book of Records, or Atlases (e.g., "Tallest building then vs now", "Population count", "Geographical facts", "Fastest machines").
    3. Popular urban legends, myths, or misconceptions prevalent at the time.
    ${isEducationTopic ? '4. Common misconceptions taught in schools that have since been corrected.' : ''}
    `}

    For each item:
    1. Identify what was commonly believed, known, recorded, or the state of the art THEN (around that specific year).
    2. Compare it with what we know NOW (the modern reality, updated record, or debunking).
    3. State if it has been 'Debunked', 'Changed', 'Confirmed', or 'Evolved'.
    
    You MUST use Google Search to verify these facts and provide accurate comparisons.
    
    Format your response as a raw JSON array of objects. Do not use Markdown formatting for the JSON. 
    Each object must have these keys: 
    - "year" (number)
    - "category" (string)
    - "originalBelief" (string)
    - "modernReality" (string)
    - "status" (string enum: Changed, Debunked, Confirmed, Evolved)
    - "context" (string)
    - "sourceUrl" (string, optional: The specific URL found via Google Search that verifies this fact)
    - "sourceTitle" (string, optional: The title of the source website)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is NOT allowed with googleSearch, so we rely on the prompt.
      },
    });

    const text = response.text || "[]";
    
    // Attempt to clean Markdown code blocks if present
    const cleanJson = text.replace(/```json\n|\n```/g, '').replace(/```/g, '');
    
    let events: TimelineEvent[] = [];
    try {
      events = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse JSON from Gemini response", e);
      // Fallback: Return an empty array or a specific error event
      events = [];
    }

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return {
      events,
      groundingChunks
    };

  } catch (error) {
    console.error("Gemini Timeline Error:", error);
    throw error;
  }
};

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image (Nano Banana).
 */
export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
  // Mapping "Nano banana" to 'gemini-2.5-flash-image' as per instructions.
  const modelId = 'gemini-2.5-flash-image';

  // Ensure the base64 string doesn't have the header
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
  const mimeType = base64Image.match(/^data:image\/(png|jpeg|jpg|webp);base64,/)?.[1] ? `image/${base64Image.match(/^data:image\/(png|jpeg|jpg|webp);base64,/)?.[1]}` : 'image/jpeg';

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            text: prompt,
          },
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
        ],
      },
      // Nano banana does not support complex tools or configs like schema yet for images in this context
    });

    // The model might return a text description AND/OR an image. We look for the image inlineData.
    // Iterating through parts to find the image.
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content returned from model.");
    }

    let resultImage = null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        resultImage = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!resultImage) {
      // If no image is returned, it might have refused or just returned text.
      // We can check strictly for text to throw a better error.
      const textPart = parts.find(p => p.text);
      if (textPart) {
        throw new Error(`The model returned text instead of an image: "${textPart.text}"`);
      }
      throw new Error("No image data found in response.");
    }

    return resultImage;

  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};