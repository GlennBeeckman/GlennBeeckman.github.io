(function () {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  async function syncLatestPostCard() {
    const homeCard = document.getElementById("latest-post-card");
    if (!homeCard) {
      return;
    }

    try {
      const response = await fetch("blog/index.html", { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const html = await response.text();
      const parser = new DOMParser();
      const blogDoc = parser.parseFromString(html, "text/html");
      const latestTeaser = blogDoc.querySelector(".posts-list .post-teaser");
      if (!latestTeaser) {
        return;
      }

      const meta = latestTeaser.querySelector(".post-meta");
      const title = latestTeaser.querySelector("h2, h3");
      const excerpt = latestTeaser.querySelector("p:not(.post-meta)");
      const link = latestTeaser.querySelector("a");

      if (!meta || !title || !excerpt || !link) {
        return;
      }

      const homeMeta = homeCard.querySelector(".post-meta");
      const homeTitle = homeCard.querySelector("h3");
      const homeExcerpt = homeCard.querySelector("p:not(.post-meta)");
      const homeLink = homeCard.querySelector("a");

      if (!homeMeta || !homeTitle || !homeExcerpt || !homeLink) {
        return;
      }

      homeMeta.textContent = meta.textContent;
      homeTitle.textContent = title.textContent;
      homeExcerpt.textContent = excerpt.textContent;

      const href = link.getAttribute("href") || "";
      homeLink.setAttribute("href", href.startsWith("http") ? href : `blog/${href.replace(/^\/+/, "")}`);
      homeLink.textContent = link.textContent || "Read article";
    } catch (error) {
      // Keep existing fallback content when blog fetch is unavailable.
    }
  }

  syncLatestPostCard();
})();
