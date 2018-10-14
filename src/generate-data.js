'use strict';

const path = require(`path`);
const readline = require(`readline`);
const fs = require(`fs`);
const homedir = require(`os`).homedir();
const colors = require(`colors/safe`);

const GenerateEntities = require(`./helpers/generate-entities`);

const FIRST_QUESTION = `Do you want to generate a new data? (y/n) `;
const VALUE_QUESTION = `How many elements do you want to create? `;
const FILE_PATH_QUESTION = `Enter the file path `;
const REWRITE_FILE_QUESTION = `Do you want to rewrite the file {filePath}? (y/n) `;
const FILE_WAS_SAVED_MESSAGE = `The file has been saved to „{filePath}“!`;
const ERROR_MESSAGE = `There are an error: {error}`;
const VALUE_NOT_NUMBER_MESSAGE = `the value have to be a positive number.`;
const FILE_DID_NOT_WRITE_MESSAGE = `the file did not write.`;
const POSITIVE_ANSWERS = [`y`, `yes`];
const FILE_NAME = `data.json`;
const messageType = {
  ERROR: `error`,
  MESSAGE: `message`
};

const isYes = (answer) => {
  return POSITIVE_ANSWERS.includes(answer);
};

class GenerateData {
  constructor() {
    this.value = 1;
    this.filePath = path.join(homedir, FILE_NAME);
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer);
      });
    });
  }

  readFile(filePath) {
    return new Promise((resolve) => {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        resolve(err);
      });
    });
  }

  writeToFile(filePath, data) {
    return new Promise((resolve) => {
      fs.writeFile(filePath, data, `utf8`, (err) => {
        resolve(err);
      });
    });
  }

  close(message, type) {
    const colorize = type === messageType.MESSAGE ? colors.green : colors.red;
    this.rl.write(colorize(message));
    this.rl.close();
  }

  start() {
    this.askQuestion(FIRST_QUESTION).then((answer) => {
      if (isYes(answer)) {
        this.askAboutValueQuestion();
      } else {
        this.rl.close();
      }
    });
  }

  askAboutValueQuestion() {
    this.askQuestion(VALUE_QUESTION).then((answer) => {
      const value = parseInt(answer, 10);
      if (value > 0) {
        this.value = value;
        this.askAboutPathToFile();
      } else {
        this.close(ERROR_MESSAGE.replace(`{error}`, VALUE_NOT_NUMBER_MESSAGE));
      }
    });
  }

  askAboutPathToFile() {
    const question = `${FILE_PATH_QUESTION}(${this.filePath}) `;

    this.askQuestion(question).then((answer) => {
      if (answer) {
        this.filePath = path.join(answer, FILE_NAME);
      }
      this.checkFilePath();
    });
  }

  askAboutRewriteFile() {
    const question = REWRITE_FILE_QUESTION.replace(`{filePath}`, this.filePath);

    this.askQuestion(question).then((answer) => {
      if (isYes(answer)) {
        const data = this.generateData();
        this.saveData(data);
      } else {
        this.rl.close();
      }
    });
  }

  checkFilePath() {
    this.readFile(this.filePath).then((err) => {
      if (err) {
        const data = this.generateData();
        this.saveData(data);
      } else {
        this.askAboutRewriteFile();
      }
    });
  }

  generateData() {
    const generate = new GenerateEntities(this.value);
    return JSON.stringify(generate.getEntities());
  }

  saveData(data) {
    this.writeToFile(this.filePath, data).then((err) => {
      if (err) {
        this.close(ERROR_MESSAGE.replace(`{error}`, FILE_DID_NOT_WRITE_MESSAGE));
      } else {
        this.close(FILE_WAS_SAVED_MESSAGE.replace(`{filePath}`, this.filePath), messageType.MESSAGE);
      }
    });
  }
}

module.exports = GenerateData;
