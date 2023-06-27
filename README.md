# Ottagon
Master Thesis Project Roman Heubel (rheu@itu.dk). If you experience any issues during setup, feel free to reach out. This is an altered copy of the original repository for the sake of publication.

# Prerequisites
Please have [Node.js](https://nodejs.org/en/download) including the node package manager (comes with the Node installation usually) installed on your local machine. Have the packages [react-scripts](https://www.npmjs.com/package/react-scripts), [nodemon](https://www.npmjs.com/package/nodemon), [joi](https://www.npmjs.com/package/joi), [@sendgrid/mail](https://www.npmjs.com/package/@sendgrid/mail), and [fs-ext](https://www.npmjs.com/package/fs-ext) installed. 

If you want to send out transactional emails confirming signed-up users make sure to create a [SendGrid](https://signup.sendgrid.com/) account. In all cases, please have the @sendgrid/mail package installed no matter if you would like to use the email feature or not. 

# Installation Guide
1. Clone the development repository to your local machine
2. Open the folder ottagon-api in a terminal window
3. Run npm install in that folder
4. IMPORTANT: Create a new .env file in the ottagon-api folder containing the variables mentioned in the .env section of this README file
5. Open the folder ottagon-client in a separate terminal window
6. Run npm install in that folder 
7. Optionally, set up transactional email as described below. If you do not wish to send out account confirmation emails and want to manually access the platform with a newly created account, open users.json (by default located in ottagon-api/data/users.json) and copy the token for that user account. Append it to the domain you're hosting the platform on. For example: http://localhost:3000/token
  
# Starting and Stopping Ottagon
Run *npm run devStart* inside the ottagon-api folder
  
Run *npm start* inside the ottagon-client folder

# .env File
TRANSACTIONAL_EMAIL=FALSE

EMAIL_DB=./data/emails.json

USERS_DB=./data/users.json

JUDGE_DB=./data/judge.json

Adjust the paths accordingly if you would like to store your JSON data in a different location.

# Enable or disable sign-up for new users
Edit Signup.js in ottagon-client/src/components/Signup.js

Set const signUpDisabled = false; to true to disable the signup form

# Switching Challenges & Deactivating the App
Edit App.js in ottagon-client/src/App.js:

const testEnded = false; // Setting to true will deactivate the app
  
const secondSession = false; // Setting to true will activate the second training session

Note: Only users that completed the baseline test and the first challenge will be assigned a new set of emails. If you set secondSession to true before that is the case, users will NOT see new emails in their inbox. 

# Optional: Setup for Transactional Email with SendGrid
1. If you do not have an account with SendGrid yet, [create one](https://signup.sendgrid.com/)
2. IMPORTANT: You must create a new Dynamic Template on SendGrid. Follow the guide down below. 
3. Create an API key https://docs.sendgrid.com/api-reference/api-keys/create-api-keys
4. Add an additional environmental variable named SENDGRID_API_KEY to the .env file you created earlier and set it to your key. Note: Do not use any quotation marks. The structure has to be: SENDGRID_API_KEY=<YOUR KEY> (keys start with SG.)
5. Set the environmental variable to TRANSACTIONAL_EMAIL=TRUE
  
# Dynamic Template for Transactional Email
1. Log in to your SendGrid account
2. Create a new dynamic template by following [this guide](https://docs.sendgrid.com/ui/sending-email/how-to-send-an-email-with-dynamic-templates#design-a-dynamic-template)
3. Follow [this guide](https://docs.sendgrid.com/ui/sending-email/editor#importing-custom-html-with-drag-and-drop-markup) to import the html file accountCreated.html located in ottagon-api/html_template/accountCreated.html
4. In the editor click on the "Launch Ottagon" button to change the Button URL to the domain you are hosting the platform on. If you host it locally it will be something like localhost:3000. 
5. Save the template and copy the Template ID from your SendGrid dashboard. You will see the Template ID on the Dynamic Templates Overview page. Unfold the template you created and the ID should be shown to you. 
6. Navigate to ottagon-api/routes/users/users.model.js replace the given Template ID with yours. 
7. If you configured a custom domain when creating your SendGrid account, adjust the "from" Email address in users.model.js accordingly. 

# Additional Notes
Whenever you want to clean any of the JSON files to for example reset your installation of Ottagon, make sure to leave an empty array [] in the file. Otherwise, you will run into issues when users want to sign up for a new account or judge an email. 

