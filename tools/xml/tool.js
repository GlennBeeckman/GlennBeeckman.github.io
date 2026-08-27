const xmlInput = document.getElementById("xml-input");
const xmlOutput = document.getElementById("xml-output");
const xmlStatus = document.getElementById("xml-status");

function setXmlStatus(message, isError) {
  if (xmlStatus) {
    xmlStatus.textContent = message;
    xmlStatus.style.color = isError ? "#9b1c1c" : "#225463";
  }
}

function formatXml(xml) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  if (doc.getElementsByTagName("parsererror").length > 0) {
    throw new Error("Invalid XML");
  }

  const formatted = formatXmlNode(doc.documentElement, 0);
  return formatted;
}

function formatXmlNode(node, indent) {
  const indentStr = "  ".repeat(indent);
  let result = "";

  if (node.nodeType === Node.ELEMENT_NODE) {
    result += indentStr + "<" + node.nodeName;

    for (let attr of node.attributes) {
      result += ` ${attr.nodeName}="${attr.nodeValue}"`;
    }

    if (node.childNodes.length === 0) {
      result += " />\n";
    } else {
      result += ">\n";

      for (let child of node.childNodes) {
        if (child.nodeType === Node.ELEMENT_NODE) {
          result += formatXmlNode(child, indent + 1);
        } else if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent.trim();
          if (text) {
            result += indentStr + "  " + text + "\n";
          }
        }
      }

      result += indentStr + "</" + node.nodeName + ">\n";
    }
  }

  return result;
}

document.getElementById("xml-format")?.addEventListener("click", () => {
  if (!xmlInput.value) {
    setXmlStatus("Please enter XML content", true);
    return;
  }

  try {
    const formatted = formatXml(xmlInput.value);
    xmlOutput.value = formatted.trim();
    setXmlStatus("XML formatted.", false);
  } catch (error) {
    setXmlStatus("Error: " + error.message, true);
  }
});

document.getElementById("xml-validate")?.addEventListener("click", () => {
  if (!xmlInput.value) {
    setXmlStatus("Please enter XML content", true);
    return;
  }

  try {
    formatXml(xmlInput.value);
    setXmlStatus("XML is valid.", false);
  } catch (error) {
    setXmlStatus("Error: " + error.message, true);
  }
});

document.getElementById("xml-clear")?.addEventListener("click", () => {
  xmlInput.value = "";
  xmlOutput.value = "";
  setXmlStatus("", false);
});

document.getElementById("xml-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(xmlOutput.value);
  setXmlStatus("XML copied!", false);
});
