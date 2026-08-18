# Blog Post Template

Use this template as a reference when creating posts manually or in the admin panel.

## Quick Start

1. Open `/admin/` and login (default: `admin` / `changeme`)
2. Fill in the form and preview
3. Download or copy the generated HTML
4. Add the post folder to `blog/posts/`
5. Update `blog/index.html` with a teaser

## Post Structure

Each post lives in its own folder:

```
blog/posts/
  └── my-post/
      └── index.html
```

## Post HTML Template

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Post Title</title>
  <meta name="description" content="Brief description of your post.">
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
      <p class="post-meta">June 11, 2026</p>
      <h1>Your Post Title</h1>
      
      <p>Your content starts here. You can use standard HTML tags.</p>
      
      <h2>Section heading</h2>
      <p>More content...</p>
      
      <ul>
        <li>Bullet point 1</li>
        <li>Bullet point 2</li>
      </ul>

      <p><a href="../../index.html">Back to blog</a></p>
    </article>
  </main>

  <footer class="site-footer">
    <p>Thanks for reading.</p>
  </footer>

  <script src="../../../assets/js/main.js"></script>
</body>
</html>
```

## Blog Index Teaser Template

Add this to `blog/index.html` inside `<section class="posts-list">`:

```html
<article class="post-teaser">
  <p class="post-meta">June 11, 2026</p>
  <h2>Your Post Title</h2>
  <p>Brief excerpt or teaser for your post that appears in the list.</p>
  <a href="posts/your-slug/">Read article</a>
</article>
```

## Adding Images

To add images to your posts:

1. Create `blog/assets/images/` folder in your repo (if not exists)
2. Add image files there
3. Reference in post HTML as:

```html
<img src="../../assets/images/my-image.jpg" alt="Description of image">
```

## Content Tips

- Use `<h2>` for section headers (not `<h1>` — that's for post title)
- Use `<p>` for paragraphs, `<ul>/<ol>` for lists
- Use `<code>` for inline code, `<pre><code>` for code blocks
- Use `<strong>` for bold, `<em>` for italics
- Keep line length reasonable for readability
- Preview before committing to GitHub

## Auto-Updates

- The homepage automatically shows your latest post
- Just make sure it's the first teaser in `blog/index.html`
- No manual updates needed to the home page!
