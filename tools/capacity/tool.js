// Tab switching
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;
    
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
    
    tab.classList.add("active");
    document.getElementById(tabName).classList.add("active");
  });
});

// Format bytes to GB
function formatGB(bytes) {
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

// Storage Calculator
function calculateStorage() {
  const recordsCount = parseInt(document.getElementById("records-count").value) || 0;
  const avgText = parseFloat(document.getElementById("avg-text").value) || 0;
  const avgNote = parseFloat(document.getElementById("avg-note").value) || 0;
  const attachments = parseFloat(document.getElementById("attachments").value) || 0;
  const auditYears = parseInt(document.getElementById("audit-years").value) || 0;

  // Calculate data storage (in bytes)
  const avgRecordSize = (avgText + avgNote + attachments) * 1024; // Convert KB to bytes
  const dataBytes = recordsCount * avgRecordSize;

  // Estimate audit storage (typically 3x data per year)
  const auditBytes = dataBytes * 3 * auditYears;

  // Attachment storage
  const attachmentBytes = recordsCount * attachments * 1024;

  const totalBytes = dataBytes + auditBytes + attachmentBytes;

  document.getElementById("data-storage").textContent = formatGB(dataBytes);
  document.getElementById("audit-storage").textContent = formatGB(auditBytes);
  document.getElementById("attachment-storage").textContent = formatGB(attachmentBytes);
  document.getElementById("total-storage").textContent = formatGB(totalBytes);

  // Licensing impact (2GB per license is common)
  const licensesNeeded = Math.ceil((totalBytes / (1024 * 1024 * 1024)) / 2);
  document.getElementById("storage-status").textContent = `~${licensesNeeded} licenses needed`;

  // Warning logic
  const warningDiv = document.getElementById("storage-warning");
  const warningText = document.getElementById("warning-text");

  if (totalBytes > 100 * 1024 * 1024 * 1024) { // > 100GB
    warningDiv.style.display = "block";
    warningText.textContent = "Large storage requirement. Consider archiving strategy and data lifecycle policies.";
  } else {
    warningDiv.style.display = "none";
  }
}

// API Rate Limits
function calculateAPI() {
  const concurrentUsers = parseInt(document.getElementById("concurrent-users").value) || 1;
  const requestsPerMin = parseInt(document.getElementById("requests-per-min").value) || 1;

  const totalReqPerMin = concurrentUsers * requestsPerMin;
  const throttleThreshold = 6000; // Dataverse limit
  const throttlePercent = (totalReqPerMin / throttleThreshold) * 100;

  document.getElementById("req-per-min").textContent = totalReqPerMin.toLocaleString();
  document.getElementById("throttle-percent").textContent = throttlePercent.toFixed(1) + "%";

  const statusSpan = document.getElementById("throttle-status");
  if (throttlePercent > 100) {
    statusSpan.textContent = "🔴 THROTTLED";
    statusSpan.className = "result-value danger";
  } else if (throttlePercent > 80) {
    statusSpan.textContent = "🟡 HIGH";
    statusSpan.className = "result-value warning-text";
  } else {
    statusSpan.textContent = "✓ Safe";
    statusSpan.className = "result-value good";
  }

  // Max safe users calculation
  const maxSafeUsers = Math.floor(throttleThreshold / Math.max(requestsPerMin, 1));
  document.getElementById("max-safe-users").textContent = maxSafeUsers.toLocaleString();

  // Warning
  const apiWarning = document.getElementById("api-warning");
  const apiWarningText = document.getElementById("api-warning-text");

  if (throttlePercent > 100) {
    apiWarning.style.display = "block";
    apiWarningText.textContent = `Approaching throttling limit. Reduce concurrent users or add delays between requests.`;
  } else if (throttlePercent > 80) {
    apiWarning.style.display = "block";
    apiWarningText.textContent = `High API usage. Optimize queries and consider batch operations.`;
  } else {
    apiWarning.style.display = "none";
  }
}

// Growth Projector
function calculateGrowth() {
  const initialRecords = parseInt(document.getElementById("initial-records").value) || 0;
  const monthlyGrowth = parseFloat(document.getElementById("monthly-growth").value) || 0;
  const avgRecordSize = parseFloat(document.getElementById("avg-record-size").value) || 0;
  const projectionMonths = parseInt(document.getElementById("projection-months").value) || 1;

  // Current storage
  const startBytes = (initialRecords * avgRecordSize * 1024);

  // Projected records using compound growth: P(t) = P0 * (1 + r)^t
  const growthRate = monthlyGrowth / 100;
  const projectedRecords = initialRecords * Math.pow(1 + growthRate, projectionMonths);
  const endBytes = (projectedRecords * avgRecordSize * 1024);

  const growthBytes = endBytes - startBytes;
  const avgMonthlyGrowth = growthBytes / projectionMonths;

  document.getElementById("start-storage").textContent = formatGB(startBytes);
  document.getElementById("end-storage").textContent = formatGB(endBytes);
  document.getElementById("growth-amount").textContent = formatGB(growthBytes);
  document.getElementById("avg-growth-month").textContent = formatGB(avgMonthlyGrowth);
  document.getElementById("proj-months").textContent = projectionMonths;
}

// Event listeners
document.getElementById("records-count").addEventListener("input", calculateStorage);
document.getElementById("avg-text").addEventListener("input", calculateStorage);
document.getElementById("avg-note").addEventListener("input", calculateStorage);
document.getElementById("attachments").addEventListener("input", calculateStorage);
document.getElementById("audit-years").addEventListener("input", calculateStorage);

document.getElementById("concurrent-users").addEventListener("input", calculateAPI);
document.getElementById("requests-per-min").addEventListener("input", calculateAPI);

document.getElementById("initial-records").addEventListener("input", calculateGrowth);
document.getElementById("monthly-growth").addEventListener("input", calculateGrowth);
document.getElementById("avg-record-size").addEventListener("input", calculateGrowth);
document.getElementById("projection-months").addEventListener("input", calculateGrowth);

// Initial calculations
calculateStorage();
calculateAPI();
calculateGrowth();
