const { onCall } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { generateJSON } = require("./lib/gemini");

const GAME_PROMPT = `You are an expert Game Designer + Educator specializing in K-12 learning.

Convert the given academic concept into an engaging, interactive learning game.

GAME DESIGN PRINCIPLES:
- The game must feel like a real game, not a quiz
- Use mechanics like: Levels, Progression, Rewards, Challenges, Decision-making, Storytelling
- Avoid boring MCQs unless embedded inside gameplay

INPUT:
- Topic: {topicName}
- Theory: {theory}
- Sample Questions: {questions}

OUTPUT (strict JSON):
{
  "gameTitle": "string",
  "targetClass": "string",
  "subject": "string",
  "conceptCovered": "string",
  "gameType": "adventure | simulation | puzzle | strategy | roleplay | timed-challenge",
  "story": "string (game narrative)",
  "mechanics": {
    "coreLoop": "string",
    "rules": ["string"],
    "winCondition": "string",
    "lossCondition": "string"
  },
  "levels": [
    {
      "levelNumber": 1,
      "title": "string",
      "objective": "string",
      "conceptTaught": "string",
      "interaction": "string",
      "difficulty": "beginner | intermediate | advanced"
    }
  ],
  "engagementHooks": {
    "xpPerLevel": 100,
    "streakBonus": true,
    "badges": ["string"]
  },
  "uiSuggestions": ["string"]
}

Use examples relatable to Indian students (shops, cricket, trains, exams).
Include humor, surprises, or twists.
Always think: "Would a 15-year-old actually enjoy playing this?"

Respond ONLY with valid JSON. No extra text.`;

const generateGame = onCall(
  { region: "asia-south1", maxInstances: 10 },
  async (request) => {
    const { examId, subjectId, chapterId, topicId } = request.data;

    if (!examId || !subjectId || !chapterId || !topicId) {
      throw new Error("Missing required fields: examId, subjectId, chapterId, topicId");
    }

    const db = getFirestore();

    // Read topic from SprintUp's existing Firestore data
    const topicRef = db
      .collection("exams").doc(examId)
      .collection("subjects").doc(subjectId)
      .collection("chapters").doc(chapterId)
      .collection("topics").doc(topicId);

    const topicDoc = await topicRef.get();
    if (!topicDoc.exists) throw new Error("Topic not found");

    const topicData = topicDoc.data();

    // Grab a few sample questions for context
    const questionsSnap = await db
      .collection("exams").doc(examId)
      .collection("subjects").doc(subjectId)
      .collection("chapters").doc(chapterId)
      .collection("questions")
      .where("topicId", "==", topicId)
      .limit(5)
      .get();

    const sampleQuestions = questionsSnap.docs.map((d) => d.data().questionText);

    const prompt = GAME_PROMPT
      .replace("{topicName}", topicData.topicName || "")
      .replace("{theory}", JSON.stringify(topicData.theory || ""))
      .replace("{questions}", JSON.stringify(sampleQuestions));

    const game = await generateJSON(prompt);

    // Save the generated game
    const gameRef = db.collection("games").doc();
    await gameRef.set({
      ...game,
      examId,
      subjectId,
      chapterId,
      topicId,
      createdAt: new Date(),
    });

    return { gameId: gameRef.id, ...game };
  }
);

module.exports = { generateGame };
