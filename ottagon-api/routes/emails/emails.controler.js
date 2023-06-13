//IMPORTS
import * as emailsModel from "./emails.model.js";

// FILTER EMAILS (HELPER FUNCTION)
export function filterEmails(allEmails) {
  const filteredEmails = allEmails.map((email) => {
    const { isPhish, generator, folder, read, ...filteredEmail } = email;
    return filteredEmail;
  });
  return filteredEmails;
}

// GET EMAILS BY USER AND FOLDER
export async function getEmailByUserAndFolder(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const emails = await emailsModel.getEmailByUserAndFolder(
      token,
      req.params.folder
    );
    res.status(200).send(emails);
  } catch (error) {
    res.status(400).send(error.message);
  }
}

// JUDGE EMAIL
export async function judgeEmail(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { emailID, isPhish } = req.body;
    res.status(200).send(await emailsModel.judgeEmail(token, emailID, isPhish));
  } catch (error) {
    res.status(400).send(error.message);
  }
}
