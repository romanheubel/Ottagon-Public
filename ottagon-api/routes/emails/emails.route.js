// IMPORTS
import express from "express";
import { getEmailByUserAndFolder, judgeEmail } from "./emails.controler.js";

// ROUTER
export const emailsRouter = express.Router();

//MIDDLEWARE
emailsRouter.use(express.json());

//AUTHENTICATION
//CHATGPT was consulted to create the authentication requirement
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "Authorization header missing" });
  }
  next();
}

// ROUTES
emailsRouter.get("/emails/folder/:folder/", auth, getEmailByUserAndFolder);
emailsRouter.post("/emails/judge/", auth, judgeEmail);
