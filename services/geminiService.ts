import { GoogleGenAI, Type } from "@google/genai";
import { QuizItem } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Step 1: Generate the vocabulary word, definition, and distractors using a text model.
 */
async function generateVocabData(difficulty: string, excludedWords: string[]): Promise<Omit<QuizItem, 'imageBase64'>> {
  const model = 'gemini-2.5-flash';
  
  // Create a very strong instruction about exclusion
  const exclusionList = excludedWords.map(w => w.toLowerCase()).join(', ');
  const exclusionPrompt = excludedWords.length > 0 
    ? `IMPORTANT: The following fruits have ALREADY been used: [${exclusionList}]. You MUST pick a DIFFERENT fruit. Do NOT use any fruit from this list.` 
    : '';

  const difficultyPrompt = difficulty === 'beginner' 
    ? 'Focus on common, everyday fruits (e.g., Apple, Banana, Orange, Mango, Grape, Strawberry, Watermelon, Pineapple, Peach, Pear, Cherry, Lemon, Coconut).' 
    : 'Focus on slightly more specific or tropical fruits (e.g., Durian, Dragonfruit, Mangosteen, Passion fruit, Lychee, Pomegranate, Persimmon, Guava, Jackfruit, Fig, Kiwi, Avocado, Papaya).';

  const prompt = `Generate a single English vocabulary quiz item specifically about a FRUIT.
  
  Task:
  1. Select a target fruit.
  2. ${difficultyPrompt}
  3. ${exclusionPrompt}
  4. Provide a very simple, clear English definition (suitable for beginners).
  5. Provide 4 options (English fruit names). One is the target fruit, three are distractors.
  6. Mark the correct index.
  
  Strict Constraints:
  - Target word MUST be a botanical fruit.
  - No vegetables (no tomato, no cucumber, no pumpkin).
  - Target word MUST NOT be in the excluded list: [${exclusionList}].
  
  Output JSON format.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          definition: { type: Type.STRING },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          correctOptionIndex: { type: Type.INTEGER }
        },
        required: ["word", "definition", "options", "correctOptionIndex"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No text response from Gemini");
  
  return JSON.parse(text) as Omit<QuizItem, 'imageBase64'>;
}

/**
 * Step 2: Generate an image representation of the word.
 */
async function generateVocabImage(word: string): Promise<string> {
  const model = 'gemini-2.5-flash-image'; 
  
  const prompt = `A cute, colorful, vector-art style icon of a ${word} (fruit). 
  White background. Minimalist design. High contrast.
  No text, no labels. Just the fruit.`;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { text: prompt }
      ]
    }
  });

  // Extract the image from the parts
  const candidates = response.candidates;
  if (candidates && candidates.length > 0) {
    const parts = candidates[0].content.parts;
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }
  }

  throw new Error("No image data generated.");
}

/**
 * Orchestrator function to get a full quiz item.
 */
export async function fetchQuizItem(difficulty: string = 'beginner', excludedWords: string[] = []): Promise<QuizItem> {
  try {
    const vocabData = await generateVocabData(difficulty, excludedWords);
    const imageBase64 = await generateVocabImage(vocabData.word);

    return {
      ...vocabData,
      imageBase64
    };
  } catch (error) {
    console.error("Error generating quiz item:", error);
    throw error;
  }
}