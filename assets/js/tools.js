function setStatus(id, message, isError) {
  const el = document.getElementById(id);
  if (!el) {
    return;
  }

  el.textContent = message;
  el.style.color = isError ? "#9b1c1c" : "#225463";
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

function parseJson(value) {
  return JSON.parse(value);
}

document.addEventListener("click", (event) => {
  const action = event.target && event.target.getAttribute("data-action");
  if (!action) {
    return;
  }

  if (action.startsWith("base64")) {
    const input = document.getElementById("base64-input");
    const output = document.getElementById("base64-output");

    if (!input || !output) {
      return;
    }

    try {
      if (action === "base64-encode") {
        output.value = utf8ToBase64(input.value);
        setStatus("base64-status", "Text encoded.", false);
      }

      if (action === "base64-decode") {
        output.value = base64ToUtf8(input.value.trim());
        setStatus("base64-status", "Value decoded.", false);
      }

      if (action === "base64-clear") {
        input.value = "";
        output.value = "";
        setStatus("base64-status", "Cleared.", false);
      }
    } catch (error) {
      setStatus("base64-status", "Invalid Base64 input.", true);
    }
  }

  if (action.startsWith("url")) {
    const input = document.getElementById("url-input");
    const output = document.getElementById("url-output");

    if (!input || !output) {
      return;
    }

    try {
      if (action === "url-encode") {
        output.value = encodeURIComponent(input.value);
        setStatus("url-status", "Text encoded.", false);
      }

      if (action === "url-decode") {
        output.value = decodeURIComponent(input.value);
        setStatus("url-status", "Value decoded.", false);
      }

      if (action === "url-clear") {
        input.value = "";
        output.value = "";
        setStatus("url-status", "Cleared.", false);
      }
    } catch (error) {
      setStatus("url-status", "Invalid URL-encoded input.", true);
    }
  }

  if (action.startsWith("json")) {
    const input = document.getElementById("json-input");
    const output = document.getElementById("json-output");

    if (!input || !output) {
      return;
    }

    try {
      const data = parseJson(input.value);

      if (action === "json-format") {
        output.value = JSON.stringify(data, null, 2);
        setStatus("json-status", "JSON formatted.", false);
      }

      if (action === "json-minify") {
        output.value = JSON.stringify(data);
        setStatus("json-status", "JSON minified.", false);
      }

      if (action === "json-clear") {
        input.value = "";
        output.value = "";
        setStatus("json-status", "Cleared.", false);
      }
    } catch (error) {
      if (action === "json-clear") {
        input.value = "";
        output.value = "";
        setStatus("json-status", "Cleared.", false);
      } else {
        setStatus("json-status", "Invalid JSON input.", true);
      }
    }
  }
});
