// Admin authentication
// IMPORTANT: Change these credentials before deploying to production!
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "changeme";

const SESSION_KEY = "admin_session";

function initLoginForm() {
  const loginForm = document.getElementById("login-form");
  const errorMsg = document.getElementById("login-error");
  const successMsg = document.getElementById("login-success");

  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("admin-username").value;
    const password = document.getElementById("admin-password").value;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ user: username, timestamp: Date.now() }));
      loginForm.style.display = "none";
      if (successMsg) successMsg.style.display = "block";
      
      // Try redirect after 500ms
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 500);
    } else {
      errorMsg.textContent = "Invalid username or password";
      errorMsg.style.display = "block";
    }
  });
}

function checkAuth() {
  const session = localStorage.getItem(SESSION_KEY);
  const isDashboard = window.location.pathname.includes("dashboard");
  const isLocal = window.location.protocol === "file:";

  if (!session && isDashboard && !isLocal) {
    // Only enforce auth redirect for http/https, not for local file:// access
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

// Initialize based on page
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  initLoginForm();

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});

// Utility: Generate URL-safe slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Utility: Format date for display
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

// Utility: Generate blog post HTML
function generatePostHTML(title, date, content) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="Blog post by Glenn Beeckman.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../assets/css/styles.css">
</head>
<body>
  <div class="bg-grid"></div>
  <header class="site-header">
    <a class="brand" href="../../../index.html">
      <span class="brand-dot"></span>
      GlennBeeckman.dev
    </a>
    <nav>
      <a href="../../../tools/index.html">Tools</a>
      <a href="../../index.html">Blog</a>
      <a href="../../../index.html">Home</a>
    </nav>
  </header>

  <main>
    <article class="post-content reveal">
      <p class="post-meta">${date}</p>
      <h1>${title}</h1>
      ${content}
      <p><a href="../../index.html">Back to blog</a></p>
    </article>
  </main>

  <footer class="site-footer">
    <p>Thanks for reading.</p>
  </footer>

  <script src="../../../assets/js/main.js"></script>
</body>
</html>`;
}
