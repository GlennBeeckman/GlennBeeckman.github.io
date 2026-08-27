const yamlInput = document.getElementById("yaml-input");
const yamlOutput = document.getElementById("yaml-output");
const yamlStatus = document.getElementById("yaml-status");

function setYamlStatus(message, isError) {
  if (yamlStatus) {
    yamlStatus.textContent = message;
    yamlStatus.style.color = isError ? "#9b1c1c" : "#225463";
  }
}

function validateYaml(yaml) {
  const lines = yaml.split("\n");
  const indentStack = [0];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;

    const indent = line.search(/\S/);
    const content = line.trim();

    if (!content.includes(":") && !content.startsWith("-")) {
      continue;
    }

    if (content.includes(":")) {
      const parts = content.split(":");
      if (parts.length < 2) {
        throw new Error(`Line ${i + 1}: Invalid key-value pair`);
      }
    }
  }

  return true;
}

function formatYaml(yaml) {
  let formatted = "";
  let indentLevel = 0;
  const lines = yaml.split("\n");

  for (let line of lines) {
    if (line.trim() === "") {
      formatted += "\n";
      continue;
    }

    const trimmed = line.trim();
    const currentIndent = line.search(/\S/);

    // Adjust indent level based on content
    if (trimmed.startsWith("-")) {
      formatted += "  ".repeat(indentLevel) + trimmed + "\n";
    } else if (trimmed.includes(":")) {
      formatted += "  ".repeat(indentLevel) + trimmed + "\n";
      // Check if next line should be indented
      if (!trimmed.endsWith("{") && !trimmed.endsWith("[")) {
        // indentLevel might increase for nested content
      }
    } else {
      formatted += "  ".repeat(indentLevel) + trimmed + "\n";
    }
  }

  return formatted.trim();
}

document.getElementById("yaml-format")?.addEventListener("click", () => {
  if (!yamlInput.value) {
    setYamlStatus("Please enter YAML content", true);
    return;
  }

  try {
    const formatted = formatYaml(yamlInput.value);
    yamlOutput.value = formatted;
    setYamlStatus("YAML formatted.", false);
  } catch (error) {
    setYamlStatus("Error: " + error.message, true);
  }
});

document.getElementById("yaml-validate")?.addEventListener("click", () => {
  if (!yamlInput.value) {
    setYamlStatus("Please enter YAML content", true);
    return;
  }

  try {
    validateYaml(yamlInput.value);
    setYamlStatus("YAML is valid (basic validation).", false);
  } catch (error) {
    setYamlStatus("Error: " + error.message, true);
  }
});

document.getElementById("yaml-clear")?.addEventListener("click", () => {
  yamlInput.value = "";
  yamlOutput.value = "";
  setYamlStatus("", false);
});

document.getElementById("yaml-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(yamlOutput.value);
  setYamlStatus("YAML copied!", false);
});
