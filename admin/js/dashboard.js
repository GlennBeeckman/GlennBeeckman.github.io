let currentPostData = null;

function initDashboard() {
  const postForm = document.getElementById("post-form");
  const titleInput = document.getElementById("post-title");
  const slugInput = document.getElementById("post-slug");
  const dateInput = document.getElementById("post-date");
  const previewBtn = document.getElementById("preview-btn");
  const generateBtn = postForm ? postForm.querySelector('button[type="submit"]') : null;

  // Set today's date as default
  if (dateInput) {
    dateInput.valueAsDate = new Date();
  }

  // Auto-generate slug from title
  if (titleInput) {
    titleInput.addEventListener("input", () => {
      if (slugInput) {
        slugInput.value = generateSlug(titleInput.value);
      }
    });
  }

  // Preview button
  if (previewBtn) {
    previewBtn.addEventListener("click", (e) => {
      e.preventDefault();
      previewPost();
    });
  }

  // Form submission
  if (postForm) {
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();
      generatePost();
    });
  }
}

function getFormData() {
  return {
    title: document.getElementById("post-title").value,
    slug: document.getElementById("post-slug").value,
    date: document.getElementById("post-date").value,
    excerpt: document.getElementById("post-excerpt").value,
    content: document.getElementById("post-content").value,
    layout: document.getElementById("post-layout").value,
  };
}

function previewPost() {
  const data = getFormData();

  if (!data.title || !data.date || !data.content) {
    alert("Please fill in at least Title, Date, and Content.");
    return;
  }

  const section = document.getElementById("preview-section");
  const previewBox = document.getElementById("preview-content");

  if (!section || !previewBox) return;

  const formattedDate = formatDate(data.date);

  // Build preview HTML
  let previewHTML = `<h1>${escapeHTML(data.title)}</h1>`;
  previewHTML += `<p class="post-meta">${escapeHTML(formattedDate)}</p>`;
  previewHTML += `<div>${data.content}</div>`;

  previewBox.innerHTML = previewHTML;
  section.style.display = "block";
  section.scrollIntoView({ behavior: "smooth" });

  // Store for download
  currentPostData = { ...data, formattedDate };

  // Wire up action buttons
  document.getElementById("publish-btn")?.addEventListener("click", publishDirectly);
  document.getElementById("download-btn")?.addEventListener("click", downloadPost);
  document.getElementById("copy-html-btn")?.addEventListener("click", copyPostHTML);
  document.getElementById("close-preview-btn")?.addEventListener("click", () => {
    section.style.display = "none";
  });
}

function generatePost() {
  previewPost();
}

function escapeHTML(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function downloadPost() {
  if (!currentPostData) {
    alert("Generate a post first.");
    return;
  }

  const { title, slug, formattedDate, content } = currentPostData;
  const postHTML = generatePostHTML(title, formattedDate, content);

  // Create a blob with the HTML
  const blob = new Blob([postHTML], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Create download link
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}-index.html`;
  link.click();

  URL.revokeObjectURL(url);

  alert(`Downloaded index.html for "${slug}"\n\nHow to add to your site:\n1. Create folder: blog/posts/${slug}/\n2. Add this file to that folder\n3. Update blog/index.html with a teaser\n4. Commit and push to GitHub`);
}

function copyPostHTML() {
  if (!currentPostData) {
    alert("Generate a post first.");
    return;
  }

  const { title, slug, formattedDate, content } = currentPostData;
  const postHTML = generatePostHTML(title, formattedDate, content);

  navigator.clipboard.writeText(postHTML).then(() => {
    alert("Post HTML copied to clipboard!");
  });
}

async function publishDirectly() {
  if (!currentPostData) {
    alert("Generate a post first.");
    return;
  }

  try {
    const { title, slug, formattedDate, content, excerpt } = currentPostData;
    
    // Ask user to select a folder (ideally the root of the repo)
    const rootFolder = await window.showDirectoryPicker();
    
    // Navigate to blog/posts folder
    let blogFolder = rootFolder;
    try {
      blogFolder = await rootFolder.getDirectoryHandle("blog", { create: false });
      blogFolder = await blogFolder.getDirectoryHandle("posts", { create: true });
    } catch (e) {
      alert("Error: Could not find or create blog/posts folder. Make sure you selected the root of your repository.");
      return;
    }
    
    // Create post folder
    const postFolder = await postsFolder.getDirectoryHandle(slug, { create: true });
    
    // Write index.html
    const postHTML = generatePostHTML(title, formattedDate, content);
    const indexFile = await postFolder.getFileHandle("index.html", { create: true });
    const writable = await indexFile.createWritable();
    await writable.write(postHTML);
    await writable.close();

    // Update blog/index.html to add the teaser
    await updateBlogIndex(title, slug, formattedDate, excerpt);

    alert(
      `✓ Post published successfully!\n\nFolder: blog/posts/${slug}/\n\nDon't forget to:\n1. Upload any images to blog/assets/images/\n2. Commit and push to GitHub`
    );

    // Clear form
    document.getElementById("post-form").reset();
    document.getElementById("post-slug").value = "";
    document.getElementById("post-date").valueAsDate = new Date();
    document.getElementById("preview-section").style.display = "none";
    currentPostData = null;
  } catch (error) {
    if (error.name === "NotAllowedError") {
      alert("Permission denied. Please select the blog/posts/ folder.");
    } else if (error.name === "NotFoundError") {
      alert("Could not find the folder. Please try again.");
    } else {
      console.error("Error:", error);
      alert("Error publishing post: " + error.message);
    }
  }
}

async function updateBlogIndex(title, slug, date, excerpt) {
  try {
    // Get access to the blog folder
    const root = await window.showDirectoryPicker();
    
    // Navigate to blog/index.html
    let blogFolder = root;
    try {
      // Try to go up to find blog folder
      if (root.name === "posts") {
        blogFolder = await root.getParent();
      }
      if (blogFolder.name === "blog") {
        // Good, we're in blog folder
      }
    } catch (e) {
      console.log("Could not verify blog folder structure, skipping blog index update");
      return;
    }

    const blogIndexFile = await blogFolder.getFileHandle("index.html");
    const content = await blogIndexFile.text();

    // Create new teaser HTML (insert before the first existing post-teaser if any)
    const teaserHTML = `      <article class="post-teaser">
        <div class="post-meta">${date}</div>
        <h3><a href="posts/${slug}/">${title}</a></h3>
        <p>${excerpt}</p>
        <a href="posts/${slug}/" class="read-more">Read More →</a>
      </article>\n`;

    // Find the post-teaser section and insert before it
    let updatedContent = content;
    const teaserRegex = /(\s+)<article class="post-teaser">/;
    if (teaserRegex.test(content)) {
      updatedContent = content.replace(teaserRegex, teaserHTML + "$1<article class=\"post-teaser\">");
    }

    // Write updated content
    const writable = await blogIndexFile.createWritable();
    await writable.write(updatedContent);
    await writable.close();
  } catch (error) {
    console.warn("Could not auto-update blog/index.html. You may need to add the teaser manually:", error);
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
