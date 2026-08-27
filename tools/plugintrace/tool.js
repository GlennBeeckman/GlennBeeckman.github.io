let allTraces = [];
let filteredTraces = [];

function parseLog() {
  const input = document.getElementById("trace-input").value;
  
  if (!input.trim()) {
    alert("Please paste a trace log first");
    return;
  }

  allTraces = [];
  
  // Split by common delimiters
  const lines = input.split(/\n|\r\n/);
  
  lines.forEach(line => {
    if (line.trim()) {
      const trace = parseLogLine(line);
      if (trace) {
        allTraces.push(trace);
      }
    }
  });

  if (allTraces.length === 0) {
    // Try alternative parsing - treat each paragraph as entry
    const paragraphs = input.split(/\n\n+/);
    paragraphs.forEach(para => {
      const lines = para.split(/\n/);
      if (lines.length > 0) {
        const trace = {
          timestamp: extractTime(para),
          level: extractLevel(para),
          message: para.trim().substring(0, 200) + "..."
        };
        allTraces.push(trace);
      }
    });
  }

  filteredTraces = [...allTraces];
  renderLogs();
  updateStats();
  document.getElementById("stats-container").style.display = "grid";
}

function parseLogLine(line) {
  // Standard format: [HH:MM:SS] [LEVEL] Message
  const timeMatch = line.match(/\[(\d{2}:\d{2}:\d{2}(?:\.\d+)?)\]/);
  const levelMatch = line.match(/\[(Info|Warning|Error|Debug|Trace)\]/i);
  
  if (timeMatch || levelMatch) {
    return {
      timestamp: timeMatch ? timeMatch[1] : "N/A",
      level: levelMatch ? levelMatch[1] : "Info",
      message: line.replace(/\[[^\]]+\]/g, "").trim()
    };
  }

  // Alternative: Look for keywords
  if (line.toLowerCase().includes("error") || line.toLowerCase().includes("exception")) {
    return {
      timestamp: "N/A",
      level: "Error",
      message: line.trim()
    };
  }

  if (line.toLowerCase().includes("warning")) {
    return {
      timestamp: "N/A",
      level: "Warning",
      message: line.trim()
    };
  }

  return null;
}

function extractTime(text) {
  const match = text.match(/\[?(\d{1,2}:\d{2}:\d{2}(?:\.\d+)?)\]?/);
  return match ? match[1] : "N/A";
}

function extractLevel(text) {
  if (/error|exception/i.test(text)) return "Error";
  if (/warning/i.test(text)) return "Warning";
  if (/debug/i.test(text)) return "Debug";
  return "Info";
}

function renderLogs() {
  const output = document.getElementById("trace-output");
  
  if (filteredTraces.length === 0) {
    output.innerHTML = '<div class="no-logs">No logs match the current filters.</div>';
    return;
  }

  output.innerHTML = filteredTraces.map(trace => `
    <div class="trace-entry">
      <div class="trace-header">
        <span class="trace-time">${trace.timestamp}</span>
        <span class="trace-level level-${trace.level.toLowerCase()}">${trace.level}</span>
      </div>
      <div class="trace-message">${escapeHtml(trace.message)}</div>
    </div>
  `).join("");
}

function filterLogs() {
  const levelFilter = document.getElementById("level-filter").value;
  const searchTerm = document.getElementById("search-box").value.toLowerCase();

  filteredTraces = allTraces.filter(trace => {
    const levelMatch = !levelFilter || trace.level === levelFilter;
    const searchMatch = !searchTerm || 
      trace.message.toLowerCase().includes(searchTerm) ||
      trace.timestamp.toLowerCase().includes(searchTerm);
    
    return levelMatch && searchMatch;
  });

  renderLogs();
}

function updateStats() {
  const errorCount = allTraces.filter(t => t.level === "Error").length;
  const warnCount = allTraces.filter(t => t.level === "Warning").length;

  document.getElementById("stat-total").textContent = allTraces.length;
  document.getElementById("stat-errors").textContent = errorCount;
  document.getElementById("stat-warns").textContent = warnCount;

  // Estimate duration from timestamps
  if (allTraces.length > 1 && allTraces[0].timestamp !== "N/A") {
    const firstTime = parseTimeToMs(allTraces[0].timestamp);
    const lastTime = parseTimeToMs(allTraces[allTraces.length - 1].timestamp);
    const duration = Math.abs(lastTime - firstTime);
    document.getElementById("stat-duration").textContent = duration + "ms";
  }
}

function parseTimeToMs(timeStr) {
  const parts = timeStr.split(":");
  if (parts.length < 2) return 0;
  const minutes = parseInt(parts[0]) * 60000;
  const seconds = parseInt(parts[1]) * 1000;
  const ms = parts[2] ? parseInt(parts[2].split(".")[0]) : 0;
  return minutes + seconds + ms;
}

function clearInput() {
  document.getElementById("trace-input").value = "";
  document.getElementById("trace-output").innerHTML = '<div class="no-logs">Parse a log to see formatted entries here...</div>';
  document.getElementById("stats-container").style.display = "none";
  allTraces = [];
  filteredTraces = [];
}

function loadSample() {
  const sample = `[14:22:45.123] [Info] Executing plugin: MyPlugin.MyStep
[14:22:45.145] [Debug] Plugin initialized with context
[14:22:45.156] [Info] Processing entity: account
[14:22:45.167] [Info] Record ID: 12345678-1234-1234-1234-123456789012
[14:22:45.234] [Warning] Null reference in field: someField
[14:22:45.301] [Info] Retrieving related records...
[14:22:45.523] [Error] Exception: Unauthorized access to resource
[14:22:45.524] [Debug] Stack trace: at MyNamespace.MyClass.MyMethod()
[14:22:45.891] [Info] Plugin execution completed
[14:22:45.892] [Info] Total execution time: 769ms`;

  document.getElementById("trace-input").value = sample;
  parseLog();
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
