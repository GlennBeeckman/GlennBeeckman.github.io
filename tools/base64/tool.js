const base64Input = document.getElementById("base64-input");
const base64Output = document.getElementById("base64-output");
const base64Status = document.getElementById("base64-status");

const pdfFileInput = document.getElementById("pdf-file-input");
const pdfOutput = document.getElementById("pdf-output");
const pdfStatus = document.getElementById("pdf-status");

function setBase64Status(message, isError) {
  if (!base64Status) return;
  base64Status.textContent = message;
  base64Status.style.color = isError ? "#9b1c1c" : "#225463";
}

function setPdfStatus(message, isError) {
  if (!pdfStatus) return;
  pdfStatus.textContent = message;
  pdfStatus.style.color = isError ? "#9b1c1c" : "#225463";
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToUtf8(base64) {
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

document.getElementById("base64-encode")?.addEventListener("click", () => {
  if (!base64Input || !base64Output) return;
  base64Output.value = utf8ToBase64(base64Input.value);
  setBase64Status("Text encoded.", false);
});

document.getElementById("base64-decode")?.addEventListener("click", () => {
  if (!base64Input || !base64Output) return;
  try {
    base64Output.value = base64ToUtf8(base64Input.value.trim());
    setBase64Status("Value decoded.", false);
  } catch (error) {
    setBase64Status("Invalid Base64 input.", true);
  }
});

document.getElementById("base64-clear")?.addEventListener("click", () => {
  if (!base64Input || !base64Output) return;
  base64Input.value = "";
  base64Output.value = "";
  setBase64Status("Cleared.", false);
});

document.getElementById("base64-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(base64Output.value);
  setBase64Status("Copied!", false);
});

// PDF to Base64 conversion
document.getElementById("pdf-encode")?.addEventListener("click", () => {
  if (!pdfFileInput || !pdfOutput) return;
  
  const file = pdfFileInput.files[0];
  if (!file) {
    setPdfStatus("Please select a PDF file.", true);
    return;
  }
  
  if (file.type !== "application/pdf") {
    setPdfStatus("Please select a valid PDF file.", true);
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const arrayBuffer = e.target.result;
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
      });
      pdfOutput.value = btoa(binary);
      setPdfStatus("PDF encoded to Base64.", false);
    } catch (error) {
      setPdfStatus("Error encoding PDF: " + error.message, true);
    }
  };
  
  reader.onerror = () => {
    setPdfStatus("Error reading file.", true);
  };
  
  reader.readAsArrayBuffer(file);
});

document.getElementById("pdf-clear")?.addEventListener("click", () => {
  if (!pdfFileInput || !pdfOutput) return;
  pdfFileInput.value = "";
  pdfOutput.value = "";
  setPdfStatus("Cleared.", false);
});

document.getElementById("pdf-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(pdfOutput.value);
  setPdfStatus("Copied!", false);
});

// Drag and drop support
const dropZone = document.getElementById("pdf-drop-zone");
if (dropZone) {
  dropZone.addEventListener("click", () => pdfFileInput.click());
  
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
      pdfFileInput.files = files;
      const event = new Event("change", { bubbles: true });
      pdfFileInput.dispatchEvent(event);
    }
  });
}

// ===== BASE64 TO FILE DECODER =====

const signatureMap = [
  { mime: 'application/pdf', ext: 'pdf', sig: [0x25, 0x50, 0x44, 0x46] },
  { mime: 'image/png', ext: 'png', sig: [0x89, 0x50, 0x4E, 0x47] },
  { mime: 'image/jpeg', ext: 'jpg', sig: [0xFF, 0xD8, 0xFF] },
  { mime: 'image/gif', ext: 'gif', sig: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', ext: 'webp', sig: [0x52, 0x49, 0x46, 0x46], riffWebP: true },
  { mime: 'application/zip', ext: 'zip', sig: [0x50, 0x4B, 0x03, 0x04] },
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: 'docx', sig: [0x50, 0x4B, 0x03, 0x04], officeHint: 'word/' },
  { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: 'xlsx', sig: [0x50, 0x4B, 0x03, 0x04], officeHint: 'xl/' },
  { mime: 'audio/mpeg', ext: 'mp3', sig: [0x49, 0x44, 0x33] }
];

let b64FileState = { bytes: null, blob: null, mime: '', ext: '', header: '', objectUrl: '' };

function setB64Status(text, type = '') {
  const el = document.getElementById('b64-status');
  if (el) {
    el.textContent = text;
    el.style.color = type === 'error' ? '#9b1c1c' : type === 'warn' ? '#8f5f00' : '#15803d';
  }
}

function clearB64ObjectUrl() {
  if (b64FileState.objectUrl) {
    URL.revokeObjectURL(b64FileState.objectUrl);
    b64FileState.objectUrl = '';
  }
}

function parseB64Input(raw) {
  const text = raw.trim();
  const match = text.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,([\s\S]+)$/i);
  if (match) {
    return {
      header: text.slice(0, text.indexOf(',') + 1),
      base64: match[2],
      mimeFromHeader: (match[1] || '').trim()
    };
  }
  return { header: '(none)', base64: text, mimeFromHeader: '' };
}

function cleanBase64(input) {
  return input.replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
}

function decodeBase64ToBytes(b64) {
  const normalized = cleanBase64(b64);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) {
    throw new Error('Invalid Base64 characters found.');
  }
  if (normalized.length % 4 !== 0) {
    throw new Error('Base64 length is invalid (not divisible by 4).');
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { bytes, normalized };
}

function bytesStartWith(bytes, sig) {
  if (bytes.length < sig.length) return false;
  for (let i = 0; i < sig.length; i++) {
    if (bytes[i] !== sig[i]) return false;
  }
  return true;
}

function detectBySignature(bytes) {
  for (const entry of signatureMap) {
    if (!bytesStartWith(bytes, entry.sig)) continue;
    if (entry.riffWebP) {
      const isWebp = bytes.length > 12 &&
        bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
      if (isWebp) return { mime: entry.mime, ext: entry.ext };
      continue;
    }
    return { mime: entry.mime, ext: entry.ext };
  }
  if (looksLikeUtf8Text(bytes)) {
    return { mime: 'text/plain', ext: 'txt' };
  }
  return { mime: 'application/octet-stream', ext: 'bin' };
}

function looksLikeUtf8Text(bytes) {
  if (bytes.length === 0) return true;
  const sample = bytes.slice(0, Math.min(bytes.length, 4096));
  let suspicious = 0;
  for (const b of sample) {
    if (b === 9 || b === 10 || b === 13) continue;
    if (b >= 32 && b <= 126) continue;
    if (b >= 194 && b <= 244) continue;
    if (b === 0) suspicious += 3;
    else suspicious++;
  }
  return suspicious / sample.length < 0.08;
}

function humanBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  const units = ['KB', 'MB', 'GB'];
  let n = bytes / 1024;
  let idx = 0;
  while (n >= 1024 && idx < units.length - 1) {
    n /= 1024;
    idx++;
  }
  return n.toFixed(2) + ' ' + units[idx];
}

async function sha256Hex(bytes) {
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return '(unavailable)';
  }
}

function updateB64Summary({ header, mime, ext, b64Length, byteLength, hash }) {
  document.getElementById('b64-sum-header').textContent = header;
  document.getElementById('b64-sum-mime').textContent = mime;
  document.getElementById('b64-sum-ext').textContent = ext;
  document.getElementById('b64-sum-b64len').textContent = b64Length.toLocaleString();
  document.getElementById('b64-sum-size').textContent = byteLength.toLocaleString() + ' bytes (' + humanBytes(byteLength) + ')';
  document.getElementById('b64-sum-hash').textContent = hash;
  document.getElementById('b64-summary').style.display = 'block';
}

function updateB64Preview(bytes, mime, objectUrl) {
  const previewBox = document.getElementById('b64-preview-box');
  const previewNote = document.getElementById('b64-preview-note');
  previewBox.innerHTML = '';
  previewNote.textContent = '';
  document.getElementById('b64-preview').style.display = 'block';

  if (mime.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = objectUrl;
    img.alt = 'Decoded image preview';
    img.style.maxWidth = '100%';
    previewBox.appendChild(img);
    previewNote.textContent = 'Image preview rendered in-browser.';
    return;
  }

  if (mime === 'application/pdf') {
    const isFileProtocol = window.location.protocol === 'file:';
    if (isFileProtocol) {
      const p = document.createElement('p');
      p.textContent = 'PDF inline preview is disabled on file:// pages. Download the file to inspect.';
      previewBox.appendChild(p);
      previewNote.textContent = 'Tip: Serve via http://localhost for inline PDF preview.';
      return;
    }
    const frame = document.createElement('iframe');
    frame.src = objectUrl;
    frame.style.width = '100%';
    frame.style.height = '320px';
    frame.style.border = '0';
    frame.title = 'PDF Preview';
    previewBox.appendChild(frame);
    previewNote.textContent = 'PDF preview depends on your browser support.';
    return;
  }

  if (mime.startsWith('text/') || mime === 'application/json') {
    const txt = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(0, 12000));
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.wordWrap = 'break-word';
    pre.style.fontFamily = 'Fira Code, monospace';
    pre.style.fontSize = '0.85rem';
    pre.textContent = txt;
    previewBox.appendChild(pre);
    if (bytes.length > 12000) previewNote.textContent = 'Preview truncated (first 12 KB shown).';
    return;
  }

  const p = document.createElement('p');
  p.textContent = 'File type ' + mime + ' - no preview available. Download to view.';
  previewBox.appendChild(p);
}

document.getElementById('b64-decode-btn')?.addEventListener('click', async () => {
  clearB64ObjectUrl();
  const input = document.getElementById('b64-file-input').value;
  
  if (!input.trim()) {
    setB64Status('Please paste Base64 or data URL.', 'error');
    return;
  }

  try {
    const parsed = parseB64Input(input);
    const { bytes, normalized } = decodeBase64ToBytes(parsed.base64);
    const detected = detectBySignature(bytes);
    
    // Update state
    b64FileState.bytes = bytes;
    b64FileState.mime = parsed.mimeFromHeader || detected.mime;
    b64FileState.ext = detected.ext;
    b64FileState.header = parsed.header;
    b64FileState.blob = new Blob([bytes], { type: b64FileState.mime });
    
    clearB64ObjectUrl();
    b64FileState.objectUrl = URL.createObjectURL(b64FileState.blob);

    // Auto-fill MIME and extension
    document.getElementById('b64-mime').value = b64FileState.mime;
    document.getElementById('b64-extension').value = b64FileState.ext;

    // Generate hash
    const hash = await sha256Hex(bytes);

    // Update summary
    updateB64Summary({
      header: b64FileState.header,
      mime: b64FileState.mime,
      ext: b64FileState.ext,
      b64Length: normalized.length,
      byteLength: bytes.length,
      hash: hash
    });

    // Update preview
    updateB64Preview(bytes, b64FileState.mime, b64FileState.objectUrl);

    // Enable download button
    document.getElementById('b64-download-btn').disabled = false;

    setB64Status('✓ Decoded successfully (' + humanBytes(bytes.length) + ')', 'ok');
  } catch (error) {
    setB64Status('Error: ' + error.message, 'error');
  }
});

document.getElementById('b64-download-btn')?.addEventListener('click', () => {
  if (!b64FileState.blob) {
    setB64Status('No file to download.', 'error');
    return;
  }

  const filename = document.getElementById('b64-filename').value || 'decoded-file';
  const ext = document.getElementById('b64-extension').value || b64FileState.ext;
  const fullname = ext ? filename + '.' + ext : filename;

  const link = document.createElement('a');
  link.href = b64FileState.objectUrl;
  link.download = fullname;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setB64Status('✓ Downloaded: ' + fullname, 'ok');
});

document.getElementById('b64-clear-btn')?.addEventListener('click', () => {
  document.getElementById('b64-file-input').value = '';
  document.getElementById('b64-mime').value = '';
  document.getElementById('b64-extension').value = '';
  document.getElementById('b64-summary').style.display = 'none';
  document.getElementById('b64-preview').style.display = 'none';
  document.getElementById('b64-download-btn').disabled = true;
  clearB64ObjectUrl();
  setB64Status('Cleared.', 'ok');
});
