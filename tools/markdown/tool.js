const mdInput = document.getElementById("md-input");
const htmlOutput = document.getElementById("html-output");
const mdStatus = document.getElementById("md-status");

function setMdStatus(message) {
  if (mdStatus) {
    mdStatus.textContent = message;
    mdStatus.style.color = "#225463";
    setTimeout(() => mdStatus.textContent = "", 2000);
  }
}

function markdownToHtml(md) {
  let html = md;

  // Headings
  html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`(.*?)`/g, "<code>$1</code>");

  // Lists
  html = html.replace(/^\* (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.*?)$/gm, "<li>$1</li>");
  html = html.replace(/^(\d+)\. (.*?)$/gm, "<li>$1. $2</li>");
  
  // Wrap consecutive list items
  html = html.replace(/(<li>.*?<\/li>[\n]?)+/g, (match) => {
    return "<ul>" + match.trim() + "</ul>";
  });

  // Blockquotes
  html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr>");

  // Line breaks
  html = html.replace(/\n\n/g, "</p><p>");
  html = "<p>" + html + "</p>";
  html = html.replace(/<p><\/p>/g, "");

  return html;
}

document.getElementById("md-to-html")?.addEventListener("click", () => {
  if (!mdInput.value) {
    setMdStatus("Please enter markdown text");
    return;
  }

  try {
    const html = markdownToHtml(mdInput.value);
    htmlOutput.value = html;
    setMdStatus("Converted to HTML.");
  } catch (error) {
    mdStatus.textContent = "Error: " + error.message;
    mdStatus.style.color = "#9b1c1c";
  }
});

document.getElementById("md-clear")?.addEventListener("click", () => {
  mdInput.value = "";
  htmlOutput.value = "";
  setMdStatus("");
});

document.getElementById("html-copy")?.addEventListener("click", () => {
  navigator.clipboard.writeText(htmlOutput.value);
  setMdStatus("HTML copied!");
});
