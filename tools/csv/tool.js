const csvInput = document.getElementById("csv-input");
const csvJsonOutput = document.getElementById("csv-json-output");
const csvStatus1 = document.getElementById("csv-status-1");

const jsonCsvInput = document.getElementById("json-csv-input");
const csvOutput = document.getElementById("csv-output");
const csvStatus2 = document.getElementById("csv-status-2");

function setCsvStatus(statusEl, message, isError) {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#9b1c1c" : "#225463";
}

function copyToClipboard(text, statusEl) {
  navigator.clipboard.writeText(text).then(() => {
    if (statusEl) setCsvStatus(statusEl, "Copied!", false);
    setTimeout(() => setCsvStatus(statusEl, "", false), 2000);
  }).catch(() => {
    if (statusEl) setCsvStatus(statusEl, "Failed to copy", true);
  });
}

// CSV to JSON
document.getElementById("csv-to-json")?.addEventListener("click", () => {
  if (!csvInput || !csvJsonOutput) return;
  try {
    const lines = csvInput.value.trim().split("\n");
    if (lines.length === 0) throw new Error("No CSV data");
    
    const headers = lines[0].split(",").map(h => h.trim());
    const result = [];
    
    for (let i = 1; i < lines.length; i++) {
      const obj = {};
      const values = lines[i].split(",").map(v => v.trim());
      headers.forEach((header, idx) => {
        obj[header] = isNaN(values[idx]) ? values[idx] : Number(values[idx]);
      });
      result.push(obj);
    }
    
    csvJsonOutput.value = JSON.stringify(result, null, 2);
    setCsvStatus(csvStatus1, "Converted to JSON.", false);
  } catch (error) {
    setCsvStatus(csvStatus1, "Error: " + error.message, true);
  }
});

// JSON to CSV
document.getElementById("json-to-csv")?.addEventListener("click", () => {
  if (!jsonCsvInput || !csvOutput) return;
  try {
    const json = JSON.parse(jsonCsvInput.value);
    if (!Array.isArray(json)) throw new Error("JSON must be an array of objects");
    
    if (json.length === 0) throw new Error("Array is empty");
    
    const headers = Object.keys(json[0]);
    let csv = headers.join(",") + "\n";
    
    json.forEach(obj => {
      const values = headers.map(h => {
        const val = obj[h];
        if (typeof val === "string" && val.includes(",")) {
          return `"${val}"`;
        }
        return val ?? "";
      });
      csv += values.join(",") + "\n";
    });
    
    csvOutput.value = csv.trim();
    setCsvStatus(csvStatus2, "Converted to CSV.", false);
  } catch (error) {
    setCsvStatus(csvStatus2, "Error: " + error.message, true);
  }
});

// Clear buttons
document.getElementById("csv-clear-1")?.addEventListener("click", () => {
  csvInput.value = "";
  csvJsonOutput.value = "";
  setCsvStatus(csvStatus1, "", false);
});

document.getElementById("csv-clear-2")?.addEventListener("click", () => {
  jsonCsvInput.value = "";
  csvOutput.value = "";
  setCsvStatus(csvStatus2, "", false);
});

// Copy buttons
document.getElementById("csv-json-copy")?.addEventListener("click", () => {
  copyToClipboard(csvJsonOutput.value, csvStatus1);
});

document.getElementById("csv-copy")?.addEventListener("click", () => {
  copyToClipboard(csvOutput.value, csvStatus2);
});
