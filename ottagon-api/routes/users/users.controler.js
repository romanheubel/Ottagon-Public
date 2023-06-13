// IMPORTS
import * as usersModel from "./users.model.js";

// CREATE NEW USER
export async function createUser(req, res) {
  try {
    const newUser = await usersModel.createUser(req.body);
    res.status(200).send({ message: "User created." });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

// GET ALL USER POINTS
export async function getPoints(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const points = await usersModel.getUserPoints(token);
    console.log(points);
    res.status(200).send({ points: points });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

// GET CURRENT USER CHALLENGE
export async function getChallenge(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const challenge = await usersModel.getChallenge(token);
    console.log(challenge);
    res.status(200).send({ challenge: challenge });
  } catch (error) {
    res.status(400).send(error.message);
  }
}
