// Placeholder test — expand as game engine grows
describe("generateGame", () => {
  test("gemini module exports expected functions", () => {
    const gemini = require("../src/lib/gemini");
    expect(typeof gemini.getGeminiModel).toBe("function");
    expect(typeof gemini.generateJSON).toBe("function");
  });
});
