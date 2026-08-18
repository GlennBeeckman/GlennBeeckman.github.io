const jsonInput = document.getElementById("json-input");
const jsonOutput = document.getElementById("json-output");
const jsonStatus = document.getElementById("json-status");

function setJsonStatus(message, isError) {
  if (!jsonStatus) return;
  jsonStatus.textContent = message;
  jsonStatus.style.color = isError ? "#9b1c1c" : "#225463";
}

document.getElementById("json-format")?.addEventListener("click", () => {
  if (!jsonInput || !jsonOutput) return;
  try {
    const parsed = JSON.parse(jsonInput.value);
    jsonOutput.value = JSON.stringify(parsed, null, 2);
    setJsonStatus("JSON formatted.", false);
  } catch (error) {
    setJsonStatus("Invalid JSON input.", true);
  }
});

document.getElementById("json-minify")?.addEventListener("click", () => {
  if (!jsonInput || !jsonOutput) return;
  try {
    const parsed = JSON.parse(jsonInput.value);
    jsonOutput.value = JSON.stringify(parsed);
    setJsonStatus("JSON minified.", false);
  } catch (error) {
    setJsonStatus("Invalid JSON input.", true);
  }
});

document.getElementById("json-clear")?.addEventListener("click", () => {
  if (!jsonInput || !jsonOutput) return;
  jsonInput.value = "";
  jsonOutput.value = "";
  setJsonStatus("Cleared.", false);
});

document.getElementById("json-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(jsonOutput.value);
  setJsonStatus("Copied!", false);
});
