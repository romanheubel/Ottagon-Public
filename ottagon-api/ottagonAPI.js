// IMPORTS
import express from "express";
import { emailsRouter } from "./routes/emails/emails.route.js";
import { usersRouter } from "./routes/users/users.route.js";

// VARIABLES
const app = express();
const PORT = process.env.PORT || 3001;

// CORS
app.use(function (req, res, next) {
  const allowedOrigins = ["http://localhost:3000", "https://app.ottagon.com"];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// REQUEST LOGGING
var logger = function (req, res, next) {
  console.log("GOT REQUEST ! " + req);
  next(); // Passing the request to the next handler in the stack.
};

// PARSER
app.use(express.json());
app.use(logger);

// ROUTES
app.use(emailsRouter);
app.use(usersRouter);

// 404
app.get("*", (req, res) => {
  res.send("This is an invalid URL.");
});

// LAUNCH
app.listen(PORT, function (err) {
  if (err) console.log("An error occured");
  console.log("Server listening on port", PORT);
});
