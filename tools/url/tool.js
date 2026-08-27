const urlInput = document.getElementById("url-input");
const urlOutput = document.getElementById("url-output");
const urlStatus = document.getElementById("url-status");

function setUrlStatus(message, isError) {
  if (!urlStatus) return;
  urlStatus.textContent = message;
  urlStatus.style.color = isError ? "#9b1c1c" : "#225463";
}

document.getElementById("url-encode")?.addEventListener("click", () => {
  if (!urlInput || !urlOutput) return;
  urlOutput.value = encodeURIComponent(urlInput.value);
  setUrlStatus("Text encoded.", false);
});

document.getElementById("url-decode")?.addEventListener("click", () => {
  if (!urlInput || !urlOutput) return;
  try {
    urlOutput.value = decodeURIComponent(urlInput.value);
    setUrlStatus("Value decoded.", false);
  } catch (error) {
    setUrlStatus("Invalid URL-encoded input.", true);
  }
});

document.getElementById("url-clear")?.addEventListener("click", () => {
  if (!urlInput || !urlOutput) return;
  urlInput.value = "";
  urlOutput.value = "";
  setUrlStatus("Cleared.", false);
});

document.getElementById("url-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(urlOutput.value);
  setUrlStatus("Copied!", false);
});
