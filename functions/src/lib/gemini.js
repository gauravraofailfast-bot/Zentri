const { GoogleGenerativeAI } = require("@google/generative-ai");

let genAI = null;

function getGeminiModel(modelName = "gemini-2.0-flash") {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not set in environment");
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI.getGenerativeModel({ model: modelName });
}

async function generateJSON(prompt, modelName) {
  const model = getGeminiModel(modelName);
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Strip markdown code fences if present
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned);
}

module.exports = { getGeminiModel, generateJSON };
