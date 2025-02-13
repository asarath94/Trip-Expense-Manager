const { google } = require("googleapis");
const { auth } = require("./googleAuth");
const dotenv = require("dotenv");

dotenv.config();

// Create Google Sheets API client
const sheets = google.sheets({ version: "v4", auth: auth });

const SHEET_ID = process.env.SHEET_ID;

if (!SHEET_ID) {
  console.error("❌ ERROR: SHEET_ID is not defined in .env file.");
  throw new Error("SHEET_ID is not defined in .env file.");
}

// Function to read expense summary tables
const readSummaryTables = async () => {
  try {
    const RANGE = "TRIP!I3:O8";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    return response.data.values || [];
  } catch (error) {
    console.error(
      "Error reading summary tables:",
      error.response ? error.response.data : error.message
    );
    throw new Error(`Google Sheets API Error: ${error.message}`);
  }
};

const RANGE = "TRIP!A:G";

// Function to read data from Google Sheet
const readSheet = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: RANGE,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Error reading sheet:", error);
    return [];
  }
};

// Function to find the first empty row dynamically
const getNextEmptyRow = async () => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "TRIP!A:A", // Check column A to find the next empty row
    });

    const numRows = response.data.values ? response.data.values.length : 0;
    return numRows + 1; // Return the first available empty row (1-based index)
  } catch (error) {
    console.error("Error finding next empty row:", error);
    return null;
  }
};

// Function to write data to the first available empty row
const writeSheet = async (data) => {
  try {
    const nextRow = await getNextEmptyRow();
    if (!nextRow) {
      throw new Error("Could not determine the next empty row.");
    }

    const range = `TRIP!A${nextRow}:G${nextRow}`; // Insert data in the next empty row

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [data], // Adding a new row
      },
    });

    return { success: true, message: "Data added successfully" };
  } catch (error) {
    console.error("Error writing to sheet:", error);
    return { success: false, message: "Failed to add data" };
  }
};

module.exports = { readSheet, writeSheet, readSummaryTables };
