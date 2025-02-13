const { google } = require("googleapis");
const { readFileSync } = require("fs");

// Load credentials
const credentials = JSON.parse(readFileSync("credentials.json"));

// Authenticate using Service Account
const auth = new google.auth.GoogleAuth({
  credentials,
  projectId: credentials.project_id,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

module.exports = { auth };
