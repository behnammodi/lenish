#!/usr/bin/env node
const chalk = require("chalk");
const rl = require("readline");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function initialDataBase() {
  const adapter = new FileSync("database.json");
  const db = low(adapter);
  db.defaults({ learned: [], vocabularies: [] }).write();
  return {
    getVocabularies: () => db.get("vocabularies").value(),
    getLearned: () => db.get("learned").value(),
    addToLearned: (vocabulary) => db.get("learned").push(vocabulary).write(),
  };
}

function prompt(question) {
  const r = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  return new Promise((resolve, error) => {
    r.question(question, (answer) => {
      r.close();
      resolve(answer);
    });
  });
}

function start() {
  const { getVocabularies, getLearned, addToLearned } = initialDataBase();

  const vocabularies = getVocabularies();
  const learned = getLearned();

  //TODO: totalVocabularies and totalLearned need coma seprator
  const welcomeMessage = `
    Welcome to Lenish [${vocabularies.length} vocabularies]
    You know ${learned.length} vocabularies!
  `;
  console.log(chalk.blue(welcomeMessage));

  async function promptVocabulary() {
    const vocabulary =
      vocabularies[getRandomArbitrary(0, vocabularies.length - 1)];

    const answer = await prompt(
      chalk.white(`
      Do you know "${vocabulary}"? (y/n)

      https://www.google.com/search?q=${vocabulary}+meaning
    `)
    );

    if (answer === "y") {
      addToLearned(vocabulary);
      console.log(
        chalk.green(`
      Congraulation!!!
      `)
      );
      promptVocabulary();
    } else {
      console.log(
        chalk.red(`
      Please study.
      `)
      );
      promptVocabulary();
    }
  }

  promptVocabulary();
}

start();

//console.log(process.argv);
