#!/usr/bin/env node

/**
 * Copy curriculum data from SprintUp (source) to Zentri (destination)
 *
 * Usage:
 *   node scripts/copyCurriculumData.js
 *
 * Before running:
 * 1. Download service account keys for both Firebase projects
 * 2. Place them in: scripts/sprintup-serviceAccount.json and scripts/zentri-serviceAccount.json
 */

const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Load service account keys
const sprintupKey = require("./sprintup-serviceAccount.json");
const zentriKey = require("./zentri-serviceAccount.json");

// Initialize both Firebase apps
const sprintupApp = admin.initializeApp(
  {
    credential: admin.credential.cert(sprintupKey),
  },
  "sprintup"
);

const zentriApp = admin.initializeApp(
  {
    credential: admin.credential.cert(zentriKey),
  },
  "zentri"
);

const sprintupDb = admin.firestore(sprintupApp);
const zentriDb = admin.firestore(zentriApp);

let docsCopied = 0;

async function copyCollection(sourcePath, destPath) {
  try {
    const sourceRef = sprintupDb.collection(sourcePath);
    const snapshot = await sourceRef.get();

    if (snapshot.empty) {
      console.log(`  ✓ ${sourcePath}: no documents (skipped)`);
      return 0;
    }

    let count = 0;
    for (const doc of snapshot.docs) {
      const destRef = zentriDb.collection(destPath).doc(doc.id);
      await destRef.set(doc.data());
      count++;
    }

    console.log(`  ✓ ${sourcePath}: ${count} documents copied`);
    return count;
  } catch (error) {
    console.error(`  ✗ Error copying ${sourcePath}:`, error.message);
    return 0;
  }
}

async function copyExamsWithHierarchy() {
  console.log("Copying exams with nested hierarchy...\n");

  const examsSnap = await sprintupDb.collection("exams").get();
  let examCount = 0;

  for (const examDoc of examsSnap.docs) {
    const examId = examDoc.id;
    console.log(`Exam: ${examId}`);

    // Copy exam document
    await zentriDb.collection("exams").doc(examId).set(examDoc.data());
    examCount++;

    // Copy subjects
    const subjectsSnap = await sprintupDb
      .collection("exams")
      .doc(examId)
      .collection("subjects")
      .get();

    for (const subjectDoc of subjectsSnap.docs) {
      const subjectId = subjectDoc.id;
      console.log(`  Subject: ${subjectId}`);

      await zentriDb
        .collection("exams")
        .doc(examId)
        .collection("subjects")
        .doc(subjectId)
        .set(subjectDoc.data());

      // Copy chapters
      const chaptersSnap = await sprintupDb
        .collection("exams")
        .doc(examId)
        .collection("subjects")
        .doc(subjectId)
        .collection("chapters")
        .get();

      for (const chapterDoc of chaptersSnap.docs) {
        const chapterId = chapterDoc.id;
        console.log(`    Chapter: ${chapterId}`);

        await zentriDb
          .collection("exams")
          .doc(examId)
          .collection("subjects")
          .doc(subjectId)
          .collection("chapters")
          .doc(chapterId)
          .set(chapterDoc.data());

        // Copy topics
        const topicsSnap = await sprintupDb
          .collection("exams")
          .doc(examId)
          .collection("subjects")
          .doc(subjectId)
          .collection("chapters")
          .doc(chapterId)
          .collection("topics")
          .get();

        for (const topicDoc of topicsSnap.docs) {
          const topicId = topicDoc.id;

          await zentriDb
            .collection("exams")
            .doc(examId)
            .collection("subjects")
            .doc(subjectId)
            .collection("chapters")
            .doc(chapterId)
            .collection("topics")
            .doc(topicId)
            .set(topicDoc.data());

          // Copy concepts (if any)
          const conceptsSnap = await sprintupDb
            .collection("exams")
            .doc(examId)
            .collection("subjects")
            .doc(subjectId)
            .collection("chapters")
            .doc(chapterId)
            .collection("topics")
            .doc(topicId)
            .collection("concepts")
            .get();

          for (const conceptDoc of conceptsSnap.docs) {
            await zentriDb
              .collection("exams")
              .doc(examId)
              .collection("subjects")
              .doc(subjectId)
              .collection("chapters")
              .doc(chapterId)
              .collection("topics")
              .doc(topicId)
              .collection("concepts")
              .doc(conceptDoc.id)
              .set(conceptDoc.data());
          }
        }

        // Copy questions in chapter
        const chapterQuestionsSnap = await sprintupDb
          .collection("exams")
          .doc(examId)
          .collection("subjects")
          .doc(subjectId)
          .collection("chapters")
          .doc(chapterId)
          .collection("questions")
          .get();

        for (const questionDoc of chapterQuestionsSnap.docs) {
          await zentriDb
            .collection("exams")
            .doc(examId)
            .collection("subjects")
            .doc(subjectId)
            .collection("chapters")
            .doc(chapterId)
            .collection("questions")
            .doc(questionDoc.id)
            .set(questionDoc.data());
        }
      }
    }
  }

  console.log(`\n✓ Copied ${examCount} exams with all nested data\n`);
  docsCopied += examCount;
}

async function main() {
  try {
    console.log("🚀 Starting curriculum data copy from SprintUp → Zentri\n");
    console.log("=" + "=".repeat(60) + "\n");

    // Copy exams with full hierarchy
    await copyExamsWithHierarchy();

    console.log("=" + "=".repeat(60));
    console.log(`\n✅ Data copy complete! ${docsCopied} root documents copied.\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message);
    process.exit(1);
  }
}

main();
