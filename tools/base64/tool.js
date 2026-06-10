const base64Input = document.getElementById("base64-input");
const base64Output = document.getElementById("base64-output");
const base64Status = document.getElementById("base64-status");

function setBase64Status(message, isError) {
  if (!base64Status) return;
  base64Status.textContent = message;
  base64Status.style.color = isError ? "#9b1c1c" : "#225463";
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
