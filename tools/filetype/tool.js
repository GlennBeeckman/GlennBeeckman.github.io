const fileInput = document.getElementById("file-input");
const fileName = document.getElementById("file-name");
const fileSize = document.getElementById("file-size");
const fileType = document.getElementById("file-type");
const fileSignature = document.getElementById("file-signature");
const fileValidation = document.getElementById("file-validation");
const fileStatus = document.getElementById("file-status");

const FILE_SIGNATURES = {
  "89504E47": "PNG",
  "FFD8FF": "JPEG",
  "47494638": "GIF",
  "25504446": "PDF",
  "504B0304": "ZIP",
  "7B0A": "JSON",
  "3C3F786D": "XML",
  "D0CF11E0": "Microsoft Office",
  "50432D46": "PCF Font",
  "66747970": "MP4/MOV"
};

function setFileStatus(message) {
  if (fileStatus) {
    fileStatus.textContent = message;
    fileStatus.style.color = "#225463";
  }
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, "0").toUpperCase())
    .join("");
}

function getFileSignature(buffer) {
  const bytes = new Uint8Array(buffer.slice(0, 8));
  return bytesToHex(bytes);
}

function validateFileSignature(mimeType, signature) {
  const validSignatures = [];
  for (const [sig, type] of Object.entries(FILE_SIGNATURES)) {
    if (signature.startsWith(sig)) {
      validSignatures.push(type);
    }
  }

  return {
    mimeType,
    detectedTypes: validSignatures,
    isValid: validSignatures.length > 0
  };
}

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  fileName.value = file.name;
  fileSize.value = `${file.size} bytes (${(file.size / 1024).toFixed(2)} KB)`;
  fileType.value = file.type || "unknown";

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const signature = getFileSignature(event.target.result);
      fileSignature.value = signature;

      const validation = validateFileSignature(file.type, signature);
      
      let validationText = `MIME Type: ${validation.mimeType || "Not detected"}\n`;
      validationText += `File Signature: ${signature}\n`;
      validationText += `Detected Types: ${validation.detectedTypes.length > 0 ? validation.detectedTypes.join(", ") : "None"}\n`;
      validationText += `Status: ${validation.isValid ? "✓ Valid signature detected" : "⚠ Unknown signature"}`;

      fileValidation.value = validationText;
      setFileStatus("File analyzed successfully");
    } catch (error) {
      fileStatus.textContent = "Error: " + error.message;
      fileStatus.style.color = "#9b1c1c";
    }
  };

  reader.readAsArrayBuffer(file);
});

// Drag and drop support
const dropZone = document.getElementById("file-drop-zone");
if (dropZone) {
  dropZone.addEventListener("click", () => fileInput.click());
  
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.background = "rgba(0, 102, 204, 0.1)";
    dropZone.style.borderColor = "var(--accent)";
  });
  
  dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "rgba(0, 102, 204, 0.02)";
    dropZone.style.borderColor = "var(--line)";
  });
  
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.background = "rgba(0, 102, 204, 0.02)";
    dropZone.style.borderColor = "var(--line)";
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      fileInput.files = files;
      const event = new Event("change", { bubbles: true });
      fileInput.dispatchEvent(event);
    }
  });
}
