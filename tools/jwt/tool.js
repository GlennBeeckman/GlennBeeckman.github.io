const jwtInput = document.getElementById("jwt-input");
const jwtHeader = document.getElementById("jwt-header");
const jwtPayload = document.getElementById("jwt-payload");
const jwtSignature = document.getElementById("jwt-signature");
const jwtStatus = document.getElementById("jwt-status");

function setJwtStatus(message, isError) {
  if (jwtStatus) {
    jwtStatus.textContent = message;
    jwtStatus.style.color = isError ? "#9b1c1c" : "#225463";
  }
}

function base64UrlDecode(str) {
  str += new Array(5 - str.length % 4).join("=");
  str = str.replace(/\-/g, "+").replace(/_/g, "/");
  try {
    return decodeURIComponent(atob(str).split("").map((c) => {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  } catch (e) {
    return null;
  }
}

document.getElementById("jwt-decode")?.addEventListener("click", () => {
  if (!jwtInput.value) {
    setJwtStatus("Please enter a JWT token", true);
    return;
  }

  try {
    const parts = jwtInput.value.trim().split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT: must have 3 parts (header.payload.signature)");
    }

    const headerStr = base64UrlDecode(parts[0]);
    const payloadStr = base64UrlDecode(parts[1]);

    if (!headerStr || !payloadStr) {
      throw new Error("Invalid Base64 encoding in JWT");
    }

    const headerObj = JSON.parse(headerStr);
    const payloadObj = JSON.parse(payloadStr);

    jwtHeader.value = JSON.stringify(headerObj, null, 2);
    jwtPayload.value = JSON.stringify(payloadObj, null, 2);
    jwtSignature.value = parts[2];

    setJwtStatus("JWT decoded successfully. Note: Signature is not verified.", false);
  } catch (error) {
    setJwtStatus("Error: " + error.message, true);
  }
});

document.getElementById("jwt-clear")?.addEventListener("click", () => {
  jwtInput.value = "";
  jwtHeader.value = "";
  jwtPayload.value = "";
  jwtSignature.value = "";
  setJwtStatus("", false);
});

document.getElementById("jwt-header-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(jwtHeader.value);
  setJwtStatus("Header copied!", false);
});

document.getElementById("jwt-payload-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(jwtPayload.value);
  setJwtStatus("Payload copied!", false);
});
