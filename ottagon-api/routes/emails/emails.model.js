// IMPORTS
import * as fs from "fs/promises";
import {
  getUserFolders,
  saveUserFolders,
  getUserByToken,
  awardUserPoint,
  advanceUserChallenge,
} from "../users/users.model.js";
// LOAD DB PATHS FROM .ENV
const EMAIL_DB = process.env.EMAIL_DB;
const JUDGE_DB = process.env.JUDGE_DB;

/* If code had to be repeated multiple times for different functions , GitHub Co-Pilot was used to generate the code faster */

// READ EMAILS FROM JSON
export async function getAllEmails() {
  try {
    let emailsRaw = await fs.readFile(EMAIL_DB);
    let emails = JSON.parse(emailsRaw);
    return emails;
  } catch (err) {
    if (err.code === "ENOENT") {
      // DATA NOT FOUND
      await saveEmailArray([]); // CREATE EMPTY DATA ARRAY
      return []; // RETURN EMPTY DATA ARRAY
    } // ERROR
    else throw err;
  }
}

// GET ALL EMAILS OF CHALLENGE
export async function getChallengeEmailIds(challengeID) {
  let emailsArray = await getAllEmails();
  let challengeEmails = emailsArray.filter(
    (email) => email.challenge === challengeID
  );
  let emailIds = challengeEmails.map((email) => email.id);
  return emailIds;
}

// GET EMAIL BY ID
export async function getEmailById(emailID) {
  let emailsArray = await getAllEmails();
  let index = findEmailByID(emailsArray, emailID);
  if (index === -1) throw new Error(`No email found with id ${emailID}`);
  else return emailsArray[index];
}

//GET EMAIL BY USER ID AND FOLDER
export async function getEmailByUserAndFolder(token, folder) {
  let emailsArray = await getAllEmails();
  let userFolders = await getUserFolders(token);
  let userFolder = userFolders.find((userFolder) => userFolder.name === folder);
  let emailsByUserAndFolder = emailsArray.filter((email) =>
    userFolder.emails.includes(email.id)
  );
  return emailsByUserAndFolder;
}

// GET INDEX IN ARRAY GIVEN ID
function findEmailByID(emailsArray, emailID) {
  return emailsArray.findIndex((emails) => emails.id == emailID);
}

//JUDGE EMAIL
export async function judgeEmail(token, emailID, isPhish) {
  let userFolders = await getUserFolders(token);
  let inbox = userFolders.find((folder) => folder.name === "inbox");
  let spam = userFolders.find((folder) => folder.name === "spam");
  let trusted = userFolders.find((folder) => folder.name === "trusted");
  let email = await getEmailById(emailID);

  if (!inbox || !spam || !trusted) {
    throw new Error("User folders not found.");
  }

  //REMOVE EMAIL FROM INBOX
  let index = inbox.emails.indexOf(emailID);
  inbox.emails.splice(index, 1);

  let result = {
    id: emailID,
    score: 0,
    feedback: "",
    nextChallenge: false,
    end: false,
  };
  let predictionResult = "";

  // CHATGPT was used to generate a random set of cheering messages
  const cheers = [
    "You're amazing!",
    "Fantastic job!",
    "Well done!",
    "Great work!",
    "You nailed it!",
    "You're incredible!",
    "Fantastic job!",
    "Well done!",
    "Great work!",
    "You're really excelling at this!",
  ];

  // SELECT RANDOM CHEER
  const randomCheer = Math.floor(Math.random() * cheers.length);
  const cheer = cheers[randomCheer];

  // USER SAID PHISH
  if (isPhish) {
    if (email.isPhish) {
      //TRUE POSITIVE
      spam.emails.push(emailID);
      result.score = 1;
      result.feedback = cheer;
      predictionResult = "truePositive";
      await awardUserPoint(token, predictionResult);
    } else {
      //FALSE POSITIVE
      trusted.emails.push(emailID);
      result.score = 0;
      result.feedback =
        email.tip + " I moved the email to the trusted folder for you.";
      predictionResult = "falsePositive";
      await awardUserPoint(token, predictionResult);
    }
    // USER SAID NOT PHISH
  } else {
    // EMAIL IS IN FACT PHISH
    if (email.isPhish) {
      //FALSE NEGATIVE
      spam.emails.push(emailID);
      result.score = 0;
      result.feedback = email.tip + " I moved it to the spam folder for you.";
      predictionResult = "falseNegative";
      await awardUserPoint(token, predictionResult);

      // EMAIL IS IN FACT NOT PHISH
    } else {
      //TRUE NEGATIVE
      trusted.emails.push(emailID);
      result.score = 1;
      result.feedback = cheer;
      predictionResult = "trueNegative";
      await awardUserPoint(token, predictionResult);
    }
  }

  //CHECK IF IT WAS THE LAST EMAIL IN CURRENT CHALLENGE
  if (inbox.emails.length === 0) {
    const newChallenge = await advanceUserChallenge(token);
    if (newChallenge >= 2) {
      result.end = true;
      result.nextChallenge = false;
    } else {
      result.nextChallenge = true;
      inbox.emails = await getChallengeEmailIds(email.challenge + 1);
    }
  }
  // SAVE USER FOLDERS
  const newUserFolders = [inbox, spam, trusted];
  await saveUserFolders(token, newUserFolders);
  await createJudgeEntry(token, emailID, isPhish, predictionResult);
  return result;
}

// READ JUDGE.JSON
async function getAllJudges() {
  try {
    let judgesRaw = await fs.readFile(JUDGE_DB);
    let judges = JSON.parse(judgesRaw);
    return judges;
  } catch (err) {
    if (err.code === "ENOENT") {
      // DATA NOT FOUND
      await saveJudgeArray([]); // CREATE EMPTY DATA ARRAY
      return []; // RETURN EMPTY DATA ARRAY
    } // ERROR
    else throw err;
  }
}

// CREATE JUDGE.JSON ENTRY
export async function createJudgeEntry(
  token,
  emailID,
  isPhish,
  predictionResult
) {
  let judgeArray = await getAllJudges();
  const user = await getUserByToken(token);
  const userID = user.id;

  let newJudge = {
    userID: userID,
    emailID: emailID,
    isPhish: isPhish,
    predictionResult: predictionResult,
  };

  judgeArray.push(newJudge);
  await saveJudgeArray(judgeArray);
}

// SAVE JUDGE.JSON
async function saveJudgeArray(judgeArray) {
  let judges = JSON.stringify(judgeArray);
  await fs.writeFile(JUDGE_DB, judges);
}

// SAVE EMAIL ARRAY TO JSON
async function saveEmailArray(emailArray) {
  let emails = JSON.stringify(emailArray);
  await fs.writeFile(EMAIL_DB, emails);
}
