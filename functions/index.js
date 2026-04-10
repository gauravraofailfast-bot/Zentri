const { initializeApp } = require("firebase-admin/app");

initializeApp();

const { generateGame } = require("./src/generateGame");

exports.generateGame = generateGame;
