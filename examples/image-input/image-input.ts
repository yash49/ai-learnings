import {
  createPartFromUri,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";

const ai = new GoogleGenAI({});

async function main() {
  const image = await ai.files.upload({
    file: "./image.png",
  });

  console.log(image, "\n-------");
  console.log(image.uri, "\n-------");
  console.log(image.mimeType, "\n-------");

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: createUserContent([
      "Tell me about this animal (keep it concise)",
      ...(image.uri && image.mimeType
        ? [createPartFromUri(image.uri, image.mimeType)]
        : []),
    ]),
  });

  for await (const chunk of response) {
    for (const part of chunk.candidates?.[0].content?.parts ?? []) {
      console.log(part.text);
    }
  }
}

main();
