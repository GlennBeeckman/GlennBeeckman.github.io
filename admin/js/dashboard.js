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
  const publishBtn = document.getElementById("publish-btn");
  const downloadBtn = document.getElementById("download-btn");
  const copyBtn = document.getElementById("copy-html-btn");
  const closeBtn = document.getElementById("close-preview-btn");

  if (publishBtn) {
    publishBtn.onclick = publishDirectly;
  }

  if (downloadBtn) {
    downloadBtn.onclick = downloadPost;
  }

  if (copyBtn) {
    copyBtn.onclick = copyPostHTML;
  }

  if (closeBtn) {
    closeBtn.onclick = () => {
      section.style.display = "none";
    };
  }
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

  if (typeof window.showDirectoryPicker !== "function") {
    alert("Direct publish requires a browser that supports the File System Access API (for example Chromium-based browsers). Use Download Post Files instead.");
    return;
  }

  try {
    const { title, slug, formattedDate, content, excerpt } = currentPostData;

    // Ask user to select the repository root folder.
    const rootFolder = await window.showDirectoryPicker();

    const blogFolder = await rootFolder.getDirectoryHandle("blog", { create: false });
    const postsFolder = await blogFolder.getDirectoryHandle("posts", { create: true });

    // Create post folder
    const postFolder = await postsFolder.getDirectoryHandle(slug, { create: true });

    // Write index.html
    const postHTML = generatePostHTML(title, formattedDate, content);
    const indexFile = await postFolder.getFileHandle("index.html", { create: true });
    const writable = await indexFile.createWritable();
    await writable.write(postHTML);
    await writable.close();

    // Update blog/index.html to add the teaser.
    await updateBlogIndex(blogFolder, title, slug, formattedDate, excerpt);

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
      alert("Permission denied. Please allow folder access and try again.");
    } else if (error.name === "NotFoundError") {
      alert("Could not find blog/posts in the selected folder. Please choose your repository root.");
    } else {
      console.error("Error:", error);
      alert("Error publishing post: " + error.message);
    }
  }
}

async function updateBlogIndex(blogFolder, title, slug, date, excerpt) {
  try {
    const blogIndexHandle = await blogFolder.getFileHandle("index.html", { create: false });
    const blogIndexFile = await blogIndexHandle.getFile();
    const content = await blogIndexFile.text();

    if (content.includes(`href="posts/${slug}/`)) {
      return;
    }

    // Insert a new teaser above existing posts.
    const teaserHTML = `      <article class="post-teaser">
        <div class="post-meta">${date}</div>
        <h3><a href="posts/${slug}/">${title}</a></h3>
        <p>${excerpt}</p>
        <a href="posts/${slug}/" class="read-more">Read More →</a>
      </article>\n`;

    let updatedContent = content;
    const sectionStart = content.indexOf('<section class="posts-list reveal">');

    if (sectionStart !== -1) {
      const insertAt = sectionStart + '<section class="posts-list reveal">'.length;
      updatedContent = content.slice(0, insertAt) + "\n" + teaserHTML + content.slice(insertAt);
    } else {
      console.warn("Posts section not found; blog index was not updated automatically.");
      return;
    }

    // Write updated content
    const writable = await blogIndexHandle.createWritable();
    await writable.write(updatedContent);
    await writable.close();
  } catch (error) {
    console.warn("Could not auto-update blog/index.html. You may need to add the teaser manually:", error);
  }
}

document.addEventListener("DOMContentLoaded", initDashboard);
