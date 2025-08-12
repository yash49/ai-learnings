import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "What is the sum of the first 50 prime numbers?",
    config: {
      thinkingConfig: {
        // thinkingBudget: 1024,
        includeThoughts: true,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts ?? []) {
    if (part.thought) {
      console.log("Thinking :: ", part.text);
    } else {
      console.log("Response :: ", part.text);
    }
  }
}

main();
