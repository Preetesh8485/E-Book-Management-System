import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateAIResponse = async (prompt, options = {}) => {
  // 1. Build the baseline request structure required by the SDK
  const request = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  };

  // 2. Inject structured schema rules only if jsonMode is requested
  if (options.jsonMode) {
    request.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          emotion: { type: "string" },
          goal: { type: "string" },
          difficulty: { type: "string" }
        },
        required: ["emotion", "goal", "difficulty"]
      }
    };
  }

  // 3. Execute the request with the dynamic configuration
  const result = await model.generateContent(request);

  return result.response.text();
};