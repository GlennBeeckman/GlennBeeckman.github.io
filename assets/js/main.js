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

  function initSnailFollower() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      .cursor-snail {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 9999;
        pointer-events: none;
        user-select: none;
        transform: translate(-100px, -100px);
        will-change: transform;
        font-size: 0.55rem;
        line-height: 1;
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2));
      }

      .cursor-snail .snail-body {
        display: inline-block;
        transform-origin: 50% 60%;
      }

      .cursor-snail.is-eating .snail-body {
        animation: snail-munch 220ms ease-in-out infinite;
      }

      .cursor-snail-crumb {
        position: fixed;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #7aa33a;
        pointer-events: none;
        z-index: 9998;
        opacity: 0;
        animation: snail-crumb-pop 280ms ease-out forwards;
      }

      @keyframes snail-munch {
        0% { transform: scale(1, 1) rotate(0deg); }
        50% { transform: scale(1.08, 0.92) rotate(-4deg); }
        100% { transform: scale(1, 1) rotate(0deg); }
      }

      @keyframes snail-crumb-pop {
        0% { opacity: 0.9; transform: scale(1) translateY(0); }
        100% { opacity: 0; transform: scale(0.3) translateY(-8px); }
      }
    `;
    document.head.appendChild(style);

    const snail = document.createElement("div");
    snail.className = "cursor-snail";
    snail.innerHTML = '<span class="snail-body" aria-hidden="true">🐌</span>';
    document.body.appendChild(snail);

    // Start snail at random off-screen position
    const edge = Math.random();
    let startX, startY;
    if (edge < 0.25) {
      // Top edge
      startX = Math.random() * window.innerWidth;
      startY = -50;
    } else if (edge < 0.5) {
      // Bottom edge
      startX = Math.random() * window.innerWidth;
      startY = window.innerHeight + 50;
    } else if (edge < 0.75) {
      // Left edge
      startX = -50;
      startY = Math.random() * window.innerHeight;
    } else {
      // Right edge
      startX = window.innerWidth + 50;
      startY = Math.random() * window.innerHeight;
    }

    const state = {
      mouseX: window.innerWidth * 0.5,
      mouseY: window.innerHeight * 0.5,
      x: startX,
      y: startY,
      velocityX: 0,
      velocityY: 0,
      nextCrumbAt: 0
    };

    document.addEventListener("mousemove", (event) => {
      state.mouseX = event.clientX;
      state.mouseY = event.clientY;
    }, { passive: true });

    function emitCrumb(cx, cy) {
      const crumb = document.createElement("span");
      crumb.className = "cursor-snail-crumb";
      crumb.style.left = (cx + (Math.random() * 8 - 4)) + "px";
      crumb.style.top = (cy + (Math.random() * 8 - 4)) + "px";
      document.body.appendChild(crumb);
      setTimeout(() => crumb.remove(), 320);
    }

    function tick(now) {
      const pull = 0.0003;
      const damping = 0.96;
      const maxSpeed = 0.15;

      const dx = state.mouseX - state.x;
      const dy = state.mouseY - state.y;

      state.velocityX = (state.velocityX + dx * pull) * damping;
      state.velocityY = (state.velocityY + dy * pull) * damping;

      const speed = Math.hypot(state.velocityX, state.velocityY);
      if (speed > maxSpeed) {
        const scale = maxSpeed / speed;
        state.velocityX *= scale;
        state.velocityY *= scale;
      }

      state.x += state.velocityX;
      state.y += state.velocityY;

      const faceScale = dx >= 0 ? -1 : 1;
      const tilt = Math.max(-14, Math.min(14, dy * 0.08));
      snail.style.transform = "translate(" + (state.x - 4) + "px, " + (state.y - 3) + "px) scaleX(" + faceScale + ") rotate(" + tilt + "deg)";

      const distance = Math.hypot(dx, dy);
      const isEating = distance < 8;
      snail.classList.toggle("is-eating", isEating);
      if (isEating && now >= state.nextCrumbAt) {
        emitCrumb(state.mouseX - 2, state.mouseY - 2);
        state.nextCrumbAt = now + 130;
        
        // Try to eat a letter from nearby text
        eatNearbyLetter();
      }

      requestAnimationFrame(tick);
    }

    // Track eaten letters
    const eatenLetters = new Map();

    function eatNearbyLetter() {
      // Find edible elements (titles, headings, paragraphs - but not inputs)
      const editableSelectors = "h1, h2, h3, h4, h5, p, .hero, .panel:not(input):not(textarea)";
      const elements = document.querySelectorAll(editableSelectors);
      
      let closest = null;
      let closestDist = 120;
      let closestElement = null;
      
      elements.forEach(el => {
        if (el.querySelector("input") || el.querySelector("textarea")) return;
        
        const rect = el.getBoundingClientRect();
        const elX = rect.left + rect.width / 2;
        const elY = rect.top + rect.height / 2;
        const dist = Math.hypot(state.x - elX, state.y - elY);
        
        if (dist < closestDist && el.textContent.length > 0) {
          closestDist = dist;
          closest = el;
          closestElement = el;
        }
      });
      
      if (!closest) return;
      
      // Get all text nodes
      const textNodes = [];
      const walker = document.createTreeWalker(
        closest,
        NodeFilter.SHOW_TEXT,
        null
      );
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim().length > 0) {
          textNodes.push(node);
        }
      }
      
      if (textNodes.length === 0) return;
      
      // Pick random text node and random character
      const textNode = textNodes[Math.floor(Math.random() * textNodes.length)];
      const text = textNode.textContent;
      const charIndex = Math.floor(Math.random() * text.length);
      
      if (text[charIndex] === ' ') return; // Don't eat spaces
      
      const key = textNode.textContent + "|" + charIndex + "|" + Math.random();
      
      // Store original and hide letter
      if (!eatenLetters.has(key)) {
        eatenLetters.set(key, {
          node: textNode,
          index: charIndex,
          originalText: text
        });
        
        const hiddenText = text.substring(0, charIndex) + ' ' + text.substring(charIndex + 1);
        textNode.textContent = hiddenText;
        
        // Restore after 2 seconds
        setTimeout(() => {
          textNode.textContent = text;
          eatenLetters.delete(key);
        }, 2000);
      }
    }
    }

    requestAnimationFrame(tick);
  }

  initSnailFollower();
})();
