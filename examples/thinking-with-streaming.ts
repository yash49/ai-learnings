import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "What is the sum of the first 50 prime numbers?",
    config: {
      thinkingConfig: {
        // thinkingBudget: 1024,
        includeThoughts: true,
      },
    },
  });

  for await (const chunk of response) {
    for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
      if (part.thought) {
        console.log("Thinking :: ", part.text);
      } else {
        if (part.text) {
          console.log("Response :: ", part.text);
        } else {
          console.log("NON TEXT PART :: ", part);
        }
      }
      console.log("-----------------------------------");
    }
  }
}

main();
