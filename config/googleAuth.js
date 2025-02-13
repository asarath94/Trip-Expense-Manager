const { google } = require("googleapis");

// Load credentials
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

// Authenticate using Service Account
const auth = new google.auth.GoogleAuth({
  credentials,
  projectId: credentials.project_id,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

module.exports = { auth };
