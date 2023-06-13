// IMPORTS
import * as fs from "fs/promises";
import sgMail from "@sendgrid/mail";
import { getChallengeEmailIds } from "../emails/emails.model.js";
import Joi from "joi";
// LOAD DB PATHS FROM .ENV
const USERS_DB = process.env.USERS_DB;
// CHECK IF TRANSACTIONAL EMAIL IS ENABLED
const TRANSACTIONAL_EMAIL = process.env.TRANSACTIONAL_EMAIL;
// SET SENDGRID API KEY IF TRANSACTIONAL EMAIL IS ENABLED
if (TRANSACTIONAL_EMAIL === "TRUE") {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/* If code had to be repeated multiple times for different functions , GitHub Co-Pilot was used to generate the code faster */

// READ USERS FROM JSON
export async function getAllUsers() {
  try {
    const users = await fs.readFile(USERS_DB);
    return JSON.parse(users);
  } catch (error) {
    console.error(`Error reading users file: ${error.message}`);
    throw error;
  }
}

// GET USER BY TOKEN
export async function getUserByToken(token) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`No user found with token ${token}`);
    }
    return user;
  } catch (error) {
    console.error(`Error finding user: ${error.message}`);
    throw error;
  }
}

// FIND USER BY EMAIL
export async function findUserByEmail(email) {
  try {
    const users = await getAllUsers();
    return users.find((user) => user.email === email) || null;
  } catch (error) {
    console.error(`Error finding user: ${error.message}`);
    throw error;
  }
}

// CREATE NEW USER
//CHATGPT was consulted to create this input validation method
export async function createUser(user) {
  console.log(user);
  try {
    const schema = Joi.object({
      firstname: Joi.string().required(),
      lastname: Joi.string().required(),
      age: Joi.number().integer().min(18).max(120).required(),
      gender: Joi.string()
        .valid("male", "female", "non-binary", "prefer-not-to-say")
        .required(),
      itexperience: Joi.boolean().required(),
      email: Joi.string().email().required(),
      terms: Joi.boolean().required(),
    });
    const { error } = schema.validate(user);
    if (error) {
      throw new Error(`Invalid user data: ${error.message}`);
    }

    const existingUser = await findUserByEmail(user.email);
    if (existingUser) {
      throw new Error(
        "You already have an account. Please check your email or contact me at rheu@itu.dk."
      );
    }

    const newUser = {
      id: Math.floor(Math.random() * 1000000).toString(),
      signUpDate: new Date(),
      firstname: user.firstname,
      lastname: user.lastname,
      age: user.age,
      gender: user.gender,
      itexperience: user.itexperience,
      email: user.email,
      terms: user.terms,
      token:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      currentChallenge: 0,
      //CHATGPT gave advice on how to handle this nested array needed to differentiate between challenges
      challenges: [
        {
          challenge: 0,
          falseNegative: 0,
          falsePositive: 0,
          trueNegative: 0,
          truePositive: 0,
        },
        {
          challenge: 1,
          falseNegative: 0,
          falsePositive: 0,
          trueNegative: 0,
          truePositive: 0,
        },
        {
          challenge: 2,
          falseNegative: 0,
          falsePositive: 0,
          trueNegative: 0,
          truePositive: 0,
        },
      ],
      points: 0,
      trusted: [],
      spam: [],
    };
    const emails = await getChallengeEmailIds(0);
    newUser.inbox = emails;

    // SAVE ARRAY + NEW USER
    const users = await getAllUsers();
    users.push(newUser);
    await saveUserArray(users);
    if (TRANSACTIONAL_EMAIL === "TRUE") {
      await sendEmail(newUser.email, newUser.firstname, newUser.token);
      console.log("Email sent.");
    }
    return newUser;
  } catch (error) {
    console.error(`Error creating user: ${error.message}`);
    throw error;
  }
}

// SEND TRANSACTIONAL EMAIL TO USER
//CHATGPT was consulted to find the best way to send emails through SendGrid
async function sendEmail(email, firstname, token) {
  const msg = {
    to: email,
    from: {
      email: "otis@ottagon.com",
    },
    templateId: "d-f1a2910781f742ea9276d03c505acf54",
    dynamicTemplateData: {
      firstname: firstname,
      hash: token,
    },
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(`Error sending email: ${error.message}`);
    throw error;
  }
}

//GET AN ARRAY OF ALL EMAIL FOLDERS FOR A USER
export async function getUserFolders(token) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`User not found: ${token}`);
    }
    const folders = [
      { name: "inbox", emails: user.inbox },
      { name: "spam", emails: user.spam },
      { name: "trusted", emails: user.trusted },
    ];
    return folders;
  } catch (error) {
    console.error(`Error getting user folders: ${error.message}`);
    throw error;
  }
}

// AWARD POINT TO USER FOR FINDING SPAM
export async function awardUserPoint(token, predictionResult) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`User not found: ${token}`);
    }
    const currentChallenge = user.currentChallenge;

    switch (predictionResult) {
      case "truePositive":
        user.challenges[currentChallenge].truePositive++;
        //ONLY AWARD POINT IF EMAIL WAS A PHISH
        user.points++;
        break;
      case "falsePositive":
        user.challenges[currentChallenge].falsePositive++;
        break;
      case "trueNegative":
        user.challenges[currentChallenge].trueNegative++;
        break;
      case "falseNegative":
        user.challenges[currentChallenge].falseNegative++;
        break;
      default:
        throw new Error(`Invalid prediction result: ${predictionResult}`);
    }
    await saveUserArray(users);
  } catch (error) {
    console.error(`Error awarding user point: ${error.message}`);
    throw error;
  }
}

// ADVANCE USER TO NEXT CHALLENGE
export async function advanceUserChallenge(token) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`User not found: ${token}`);
    }
    user.currentChallenge++;
    await saveUserArray(users);
    return user.currentChallenge;
  } catch (error) {
    console.error(`Error advancing user challenge: ${error.message}`);
    throw error;
  }
}

// SAVE USER FOLDERS
export async function saveUserFolders(token, folders) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`User not found: ${token}`);
    }
    user.inbox = folders.find((folder) => folder.name === "inbox").emails;
    user.spam = folders.find((folder) => folder.name === "spam").emails;
    user.trusted = folders.find((folder) => folder.name === "trusted").emails;
    await saveUserArray(users);
  } catch (error) {
    console.error(`Error saving user folders: ${error.message}`);
    throw error;
  }
}

// GET USER POINTS
export async function getUserPoints(token) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`User not found: ${token}`);
    }
    return user.points;
  } catch (error) {
    console.error(`Error getting user points: ${error.message}`);
    throw error;
  }
}

// GET USER CURRENT CHALLENGE
export async function getChallenge(token) {
  try {
    const users = await getAllUsers();
    const user = users.find((user) => user.token === token);
    if (!user) {
      throw new Error(`User not found: ${token}`);
    }
    return user.currentChallenge;
  } catch (error) {
    console.error(`Error getting user challenge: ${error.message}`);
    throw error;
  }
}

// SAVE USER ARRAY
export async function saveUserArray(users) {
  try {
    const usersData = JSON.stringify(users);
    await fs.writeFile(USERS_DB, usersData);
  } catch (error) {
    console.error(`Error saving users: ${error.message}`);
    throw error;
  }
}
