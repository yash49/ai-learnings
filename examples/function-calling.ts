import {
  Content,
  ContentListUnion,
  FunctionDeclaration,
  GenerateContentConfig,
  GoogleGenAI,
  ToolConfig,
  Type,
} from "@google/genai";


// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

function getWeatherInfo({ city }: { city: string }) {
  return { weatherInfo: `${city}'s weather info is XXX` };
}

const getWeatherInfoFunctionDeclaration: FunctionDeclaration = {
  name: "get_weather_info",
  description:
    "Returns weather information of specific city, specifically temperature in Celsius.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        // enum: ['daylight', 'cool', 'warm'],
        description: "City for which you want the weather information.",
      },
    },
    required: ["city"],
  },
  response: {
    type: Type.OBJECT,
    properties: {
      weatherInfo: {
        type: Type.STRING,
        // enum: ['daylight', 'cool', 'warm'],
        description: "City weather information",
      },
    },
    required: ["weatherInfo"],
  },
};

const config: GenerateContentConfig = {
  tools: [
    {
      functionDeclarations: [getWeatherInfoFunctionDeclaration],
    },
  ],
};

const contents: Content[] = [
  {
    role: "user",
    parts: [
      {
        text: "Tell me weather of Ahmedabad",
      },
    ],
  },
];

// const contents: Content[] = [
//   {
//     role: "user",
//     parts: [
//       {
//         text: "Tell me weather of Ahmedabad and Mumbai",
//       },
//     ],
//   },
// ];

// const contents: Content[] = [
//   {
//     role: "user",
//     parts: [
//       {
//         text: "Tell me weather of Ahmedabad and Mumbai and also tell me if they are same or not ",
//       },
//     ],
//   },
// ];

// const contents: Content[] = [
//   {
//     role: "user", 
//     parts: [
//       {
//         text: "Fetch me weather of Ahmedabad and Convert it to Fahrenheit.",
//       },
//     ],
//   },
// ];

async function main() {
  while (true) {
    let response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config,
    });

    console.log(response.functionCalls);
    console.log(response.candidates?.length);
    console.log("------------");

    if (response.functionCalls && response.functionCalls.length > 0) {
      for (const { name, args } of response.functionCalls) {
        if (name === "get_weather_info") {
          const result = getWeatherInfo(args as unknown as { city: string });

          if (response.candidates?.[0]?.content) {
            contents.push(response.candidates?.[0]?.content);

            contents.push({
              role: "user",
              parts: [
                {
                  functionResponse: {
                    response: result,
                    name: "get_weather_info",
                  },
                },
              ],
            });
          } else {
            console.log(
              "No content found for function data :: ",
              response.text
            );
            break;
          }
        } else {
          throw new Error("Unknown function call: function " + name);
        }
      }
    } else {
      console.log("------------");
      console.log("Response :: ", response.text);
      break;
    }
  }
}

main();
