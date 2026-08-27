const hashInput = document.getElementById("hash-input");
const hashType = document.getElementById("hash-type");
const hashOutput = document.getElementById("hash-output");
const hashStatus = document.getElementById("hash-status");

function setHashStatus(message) {
  if (hashStatus) {
    hashStatus.textContent = message;
    hashStatus.style.color = "#225463";
    setTimeout(() => hashStatus.textContent = "", 2000);
  }
}

async function generateHash(text, type) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    
    let algorithm;
    switch (type) {
      case "sha1": algorithm = "SHA-1"; break;
      case "sha256": algorithm = "SHA-256"; break;
      case "sha512": algorithm = "SHA-512"; break;
      default: algorithm = "SHA-256";
    }
    
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  } catch (error) {
    throw new Error("Error generating hash: " + error.message);
  }
}

document.getElementById("hash-generate")?.addEventListener("click", async () => {
  if (!hashInput.value) {
    setHashStatus("Please enter text to hash");
    return;
  }

  try {
    const hash = await generateHash(hashInput.value, hashType.value);
    hashOutput.value = hash;
    setHashStatus(hashType.value.toUpperCase() + " hash generated.");
  } catch (error) {
    hashStatus.textContent = error.message;
    hashStatus.style.color = "#9b1c1c";
  }
});

document.getElementById("hash-clear")?.addEventListener("click", () => {
  hashInput.value = "";
  hashOutput.value = "";
  setHashStatus("");
});

document.getElementById("hash-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(hashOutput.value);
  setHashStatus("Hash copied!");
});
