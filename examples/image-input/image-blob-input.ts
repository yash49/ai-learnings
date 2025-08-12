import {
  createPartFromBase64,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ai = new GoogleGenAI({});

async function main() {
  const fileBuffer = await readFile(path.join(".", "image.png"));

  const imageBase64 = fileBuffer.toString("base64");

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      "Tell me about this animal in 500 words",
      createPartFromBase64(imageBase64, "image/png"),
    ]),
  });

  for await (const chunk of response) {
    console.log(chunk.text);
    console.log("---------");
  }
}

main();
