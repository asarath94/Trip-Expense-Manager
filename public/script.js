// Function to fetch and display summary tables
document.addEventListener("DOMContentLoaded", async function () {
  await fetchAndDisplaySummary();
});

async function fetchAndDisplaySummary() {
  try {
    const response = await fetch("/sheets/summary");
    const result = await response.json();

    if (result.success) {
      displaySummaryTables(result.data);
    } else {
      throw new Error("Failed to fetch summary");
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

function displaySummaryTables(data) {
  const summaryContainer = document.getElementById("expense-list-content");

  if (!data || data.length === 0) {
    summaryContainer.innerHTML = "<p>No summary data available.</p>";
    return;
  }

  // Clear previous content
  summaryContainer.innerHTML = "";

  // Loop through data in steps of 2 (grouping every two rows)
  for (let i = 0; i < data.length; i += 2) {
    // Start a new table
    let tableHTML = "<table border='1'>";

    // Add two rows to the table
    for (let j = 0; j < 2; j++) {
      if (i + j < data.length) {
        // Ensure we don't go out of bounds
        tableHTML += "<tr>";
        data[i + j].forEach((cell) => {
          tableHTML += `<td>${cell}</td>`;
        });
        tableHTML += "</tr>";
      }
    }

    tableHTML += "</table>";

    // Append the table to the summary container
    summaryContainer.innerHTML += tableHTML;
  }
}

// Refresh summary after submitting an expense
document
  .getElementById("expenseForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    // Get form values
    const expenseDate = document.getElementById("expense-date").value;
    const paidBy = document.getElementById("paid-by").value;
    const expenseDescription = document.getElementById(
      "expense-description"
    ).value;
    const amountPaid = parseFloat(document.getElementById("amount-paid").value);

    // Check who shared the expense (Ensure Boolean values, not "TRUE"/"FALSE")
    const sarathShared = document.getElementById("shared-sarath").checked;
    const syamShared = document.getElementById("shared-syam").checked;
    const sudheerShared = document.getElementById("shared-sudheer").checked;

    const expenseData = {
      date: expenseDate,
      paidBy: paidBy,
      description: expenseDescription,
      amount: amountPaid,
      sarath: sarathShared, // ✅ Now sends true/false (not "TRUE"/"FALSE")
      syam: syamShared,
      sudheer: sudheerShared,
    };

    try {
      const response = await fetch("/sheets/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Expense submitted successfully!");
        document.getElementById("expenseForm").reset();
        // Refresh summary tables after adding expense
        fetchAndDisplaySummary();
      } else {
        alert("Error submitting expense: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting expense");
    }
  });
document.addEventListener("DOMContentLoaded", fetchAndDisplaySummary);
