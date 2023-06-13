// IMPORTS
import express from "express";
import { createUser, getPoints, getChallenge } from "./users.controler.js";

// ROUTER
export const usersRouter = express.Router();

// AUTHENTICATION
//CHATGPT was consulted to create the authentication requirement
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Authorization header missing" });
  }
  next();
}

//MIDDLEWARE
usersRouter.use(express.json());

// ROUTES
usersRouter.post("/users/create", createUser);
usersRouter.get("/users/points", auth, getPoints);
usersRouter.get("/users/challenge", auth, getChallenge);
