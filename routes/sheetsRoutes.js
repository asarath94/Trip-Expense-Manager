const express = require("express");
const { google } = require("googleapis");
const { readSheet, writeSheet } = require("../config/googleSheets");
const sheetsModule = require("../config/googleSheets");
const { readSummaryTables } = sheetsModule;
const router = express.Router();

// ✅ Route: Fetch summary from Google Sheets
router.get("/summary", async (req, res) => {
  try {
    if (typeof readSummaryTables !== "function") {
      throw new Error("❌ readSummaryTables is NOT a function.");
    }
    const summaryData = await readSummaryTables(); // ✅ Call imported function
    res.json({ success: true, data: summaryData });
  } catch (error) {
    console.error("❌ Error fetching summary:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Route: Fetch all expense data
router.get("/data", async (req, res) => {
  try {
    const data = await readSheet();
    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
});

// ✅ Route: Add a new expense to Google Sheet
router.post("/add", async (req, res) => {
  const { date, description, amount, paidBy, sarath, syam, sudheer } = req.body;

  if (!date || !description || !amount || !paidBy) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const expenseData = [
      date,
      paidBy,
      description,
      amount,
      sarath,
      syam,
      sudheer,
    ];
    const result = await writeSheet(expenseData);
    res.json(result);
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    res.status(500).json({ success: false, message: "Failed to add data" });
  }
});

module.exports = router;
