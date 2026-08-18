const decimalInput = document.getElementById("decimal-input");
const hexInput = document.getElementById("hex-input");
const binaryInput = document.getElementById("binary-input");
const octalInput = document.getElementById("octal-input");
const numberStatus = document.getElementById("number-status");

function setNumberStatus(message) {
  if (numberStatus) {
    numberStatus.textContent = message;
    numberStatus.style.color = "#225463";
  }
}

function updateAllFromDecimal(decimal) {
  const num = parseInt(decimal);
  if (isNaN(num)) return;

  hexInput.value = num.toString(16).toUpperCase();
  binaryInput.value = num.toString(2);
  octalInput.value = num.toString(8);
}

function updateAllFromHex(hex) {
  const num = parseInt(hex, 16);
  if (isNaN(num)) return;

  decimalInput.value = num;
  binaryInput.value = num.toString(2);
  octalInput.value = num.toString(8);
}

function updateAllFromBinary(binary) {
  const num = parseInt(binary, 2);
  if (isNaN(num)) return;

  decimalInput.value = num;
  hexInput.value = num.toString(16).toUpperCase();
  octalInput.value = num.toString(8);
}

function updateAllFromOctal(octal) {
  const num = parseInt(octal, 8);
  if (isNaN(num)) return;

  decimalInput.value = num;
  hexInput.value = num.toString(16).toUpperCase();
  binaryInput.value = num.toString(2);
}

decimalInput.addEventListener("input", (e) => {
  if (e.target.value) {
    updateAllFromDecimal(e.target.value);
    setNumberStatus("Converted from decimal");
  }
});

hexInput.addEventListener("input", (e) => {
  if (e.target.value) {
    updateAllFromHex(e.target.value);
    setNumberStatus("Converted from hexadecimal");
  }
});

binaryInput.addEventListener("input", (e) => {
  if (e.target.value) {
    updateAllFromBinary(e.target.value);
    setNumberStatus("Converted from binary");
  }
});

octalInput.addEventListener("input", (e) => {
  if (e.target.value) {
    updateAllFromOctal(e.target.value);
    setNumberStatus("Converted from octal");
  }
});

// Initialize
updateAllFromDecimal("255");
