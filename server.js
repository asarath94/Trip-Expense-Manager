const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  getAuthUrl,
  getAccessToken,
  oauth2Client,
} = require("./config/googleAuth");
const sheetsRoutes = require("./routes/sheetsRoutes"); // ✅ Import routes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// ✅ Serve static files (Move this above routes)
app.use(express.static("public"));

// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Route: Redirect to Google OAuth
app.get("/auth", (req, res) => {
  res.redirect(getAuthUrl());
});

// ✅ Route: Handle OAuth callback
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("Authorization code missing");

  try {
    const tokens = await getAccessToken(code);
    oauth2Client.setCredentials(tokens);
    res.send("Authentication successful! You can now access Google Sheets.");
  } catch (error) {
    console.error("Error getting tokens:", error);
    res.status(500).send("Authentication failed");
  }
});

// ✅ Use Google Sheets API routes
app.use("/sheets", sheetsRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
