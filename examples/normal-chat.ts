import { Content, GoogleGenAI } from "@google/genai";
import * as readline from "node:readline/promises";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ai = new GoogleGenAI({});

const contents: Content[] = [];

async function main() {
  while (true) {
    console.log("---------------------------------------");

    let userInput = await rl.question("Type something: ");

    console.log("---------------------------------------");

    if (userInput === "quit" || userInput === "q") {
      return;
    }

    contents.push({
      role: "user",
      parts: [
        {
          text: userInput,
        },
      ],
    });

    const response = await ai.models.generateContent({
      contents,
      model: "gemini-2.5-flash",
    });

    contents.push({
      role: "model",
      parts: [
        {
          text: response.text,
        },
      ],
    });

    console.log(response.text);
  }
}

main();
