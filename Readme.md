# Trip Expense Manager

Trip Expense Manager is a simple, lightweight full-stack application designed to track and manage shared expenses during a trip. It uses a Node.js/Express backend and stores all data securely in a Google Spreadsheet, acting as the database.

**Live Demo:** [https://trip-expense-manager-1.onrender.com](https://trip-expense-manager-1.onrender.com)

## Features

- **Record Expenses:** Easily log expenses with details like Date, Paid By, Description, Amount, and Who Shared the expense.
- **Real-time Sync with Google Sheets:** All expenses are directly written to a connected Google Sheet.
- **Expense Summary:** Fetches and displays summary tables of expenses dynamically calculated in the Google Sheet.
- **Mobile Responsive UI:** Clean and simple web interface for easy expense tracking on the go.

## Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database/Storage:** Google Sheets API

## Prerequisites

Before you can run this project locally or deploy it, you need:

1. **Node.js** installed on your machine.
2. A **Google Cloud Console** account.
3. A **Google Spreadsheet** to act as your database.

## How to Set Up with Your Own API Keys

To use this project with your own Google Sheet, follow these steps to configure your API keys and environment variables.

### 1. Google Cloud Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project.
3. Navigate to **APIs & Services > Library** and enable the **Google Sheets API**.
4. Go to **APIs & Services > Credentials**.
5. Click **Create Credentials** and select **Service Account**.
6. Follow the prompts to create the service account.
7. Once created, click on the newly created service account, go to the **Keys** tab, click **Add Key > Create new key**, and select **JSON**.
8. Download the JSON file. You will need the contents of this file for your `.env` configuration.

### 2. Google Sheets Setup

1. Create a new Google Spreadsheet.
2. **Important:** Share the spreadsheet with the `client_email` found in the Service Account JSON file you downloaded (give it **Editor** access).
3. Ensure your spreadsheet has a tab named exactly **`TRIP`**.
4. Extract the `SHEET_ID` from your spreadsheet's URL. For example, in `https://docs.google.com/spreadsheets/d/your-sheet-id/edit`, the ID is `your-sheet-id`.
5. **Data Layout Requirement:** The application assumes your data starts being written from column A to G, and the summary data is read from the range `TRIP!I3:O8`. Ensure your Google Sheet is formatted to calculate summaries in this range or adjust the `config/googleSheets.js` file to match your sheet's layout.

### 3. Local Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Trip-expense-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=3000
   SHEET_ID=your_google_sheet_id_here
   GOOGLE_CREDENTIALS={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"...","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"...","universe_domain":"googleapis.com"}
   ```
   *Note: Ensure your entire Service Account JSON is minified/flattened into a single line for the `GOOGLE_CREDENTIALS` variable.*

4. Start the server:
   ```bash
   node server.js
   ```

5. **Local API Configuration:** Before running locally, ensure that the API base URL in `public/script.js` is pointed to your local server instead of the deployed one (change `https://trip-expense-manager.onrender.com` to `http://localhost:3000` or use a relative path if serving static files from Express).

## Deployment

To deploy this project to a platform like Render, Heroku, or Vercel:

1. Connect your GitHub repository to the deployment platform.
2. Set the build command to `npm install` and the start command to `node server.js`.
3. Add the environment variables (`SHEET_ID` and `GOOGLE_CREDENTIALS`) to the platform's environment variable settings. Make sure `GOOGLE_CREDENTIALS` is a valid JSON string.
4. Deploy the application.

## API Endpoints

- `GET /sheets/data` - Fetches all expense records from the sheet.
- `GET /sheets/summary` - Fetches the summary tables (reads from range `TRIP!I3:O8`).
- `POST /sheets/add` - Adds a new expense entry to the next empty row in the sheet (columns A through G).
