let currentQR = null;

function switchTab(tab) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach(el => el.style.display = "none");
  
  // Show selected tab
  document.getElementById(tab + "-tab").style.display = "block";
  
  // Update button states
  document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");
  
  // Reset QR display
  document.getElementById("qr-display").innerHTML = '<div style="text-align: center; color: var(--text-light);"><p>Enter data to generate QR code</p></div>';
}

// Color picker sync
document.getElementById("fg-color").addEventListener("change", (e) => {
  document.getElementById("fg-text").value = e.target.value;
});

document.getElementById("bg-color").addEventListener("change", (e) => {
  document.getElementById("bg-text").value = e.target.value;
});

function generateQR() {
  const activeTab = Array.from(document.querySelectorAll(".tab-content")).find(el => el.style.display !== "none");
  
  let qrData = "";
  
  if (activeTab.id === "text-tab") {
    qrData = document.getElementById("qr-input").value;
  } else if (activeTab.id === "wifi-tab") {
    qrData = generateWiFiString();
  } else if (activeTab.id === "vcard-tab") {
    qrData = generateVCard();
  }
  
  if (!qrData) {
    alert("Please enter data for the QR code");
    return;
  }
  
  // Clear previous QR
  document.getElementById("qr-display").innerHTML = "";
  
  // Get colors
  const fgColor = document.getElementById("fg-color").value.replace("#", "");
  const bgColor = document.getElementById("bg-color").value.replace("#", "");
  const errorLevel = document.getElementById("error-level").value;
  
  // Generate QR code
  try {
    currentQR = new QRCode(document.getElementById("qr-display"), {
      text: qrData,
      width: 300,
      height: 300,
      colorDark: "#" + fgColor,
      colorLight: "#" + bgColor,
      correctLevel: QRCode.CorrectLevel[errorLevel]
    });
  } catch (e) {
    document.getElementById("qr-display").innerHTML = '<div style="color: #dc2626; padding: 2rem; text-align: center;"><p>Error generating QR code: ' + e.message + '</p></div>';
  }
}

function generateWiFiString() {
  const ssid = document.getElementById("wifi-ssid").value;
  const password = document.getElementById("wifi-password").value;
  const type = document.getElementById("wifi-type").value;
  const hidden = document.getElementById("wifi-hidden").checked;
  
  if (!ssid) return "";
  
  // WiFi QR format: WIFI:T:WPA;S:SSID;P:PASSWORD;;
  let wifiString = "WIFI:";
  
  if (type !== "nopass") {
    wifiString += "T:" + type + ";";
  }
  
  wifiString += "S:" + escapeWiFiString(ssid) + ";";
  
  if (password && type !== "nopass") {
    wifiString += "P:" + escapeWiFiString(password) + ";";
  }
  
  if (hidden) {
    wifiString += "H:true;";
  }
  
  wifiString += ";";
  return wifiString;
}

function escapeWiFiString(str) {
  return str.replace(/[;:,\\]/g, "\\$&");
}

function generateVCard() {
  const name = document.getElementById("vcard-name").value;
  const phone = document.getElementById("vcard-phone").value;
  const email = document.getElementById("vcard-email").value;
  const org = document.getElementById("vcard-org").value;
  const url = document.getElementById("vcard-url").value;
  
  if (!name) return "";
  
  let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
  vcard += "FN:" + name + "\n";
  
  if (phone) vcard += "TEL:" + phone + "\n";
  if (email) vcard += "EMAIL:" + email + "\n";
  if (org) vcard += "ORG:" + org + "\n";
  if (url) vcard += "URL:" + url + "\n";
  
  vcard += "END:VCARD";
  return vcard;
}

function downloadQR() {
  if (!currentQR) {
    alert("Generate a QR code first");
    return;
  }
  
  const canvas = document.querySelector("#qr-display canvas");
  if (!canvas) return;
  
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "qrcode.png";
  link.click();
}

function copyQRData() {
  const activeTab = Array.from(document.querySelectorAll(".tab-content")).find(el => el.style.display !== "none");
  
  let qrData = "";
  
  if (activeTab.id === "text-tab") {
    qrData = document.getElementById("qr-input").value;
  } else if (activeTab.id === "wifi-tab") {
    qrData = generateWiFiString();
  } else if (activeTab.id === "vcard-tab") {
    qrData = generateVCard();
  }
  
  if (!qrData) return;
  
  navigator.clipboard.writeText(qrData).then(() => {
    const status = document.getElementById("copy-status");
    status.style.display = "block";
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
  });
}

// Generate QR on Enter
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    generateQR();
  }
});
