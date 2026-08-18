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

  function initRobotFollower() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const style = document.createElement("style");
    style.textContent = `
      .cursor-robot {
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

      .cursor-robot .robot-body {
        display: inline-block;
        transform-origin: 50% 60%;
      }

      .cursor-robot.is-walking .robot-body {
        animation: robot-walk 600ms ease-in-out infinite;
      }

      .cursor-robot.is-sitting .robot-body {
        animation: robot-sit 400ms ease-in-out forwards;
      }

      @keyframes robot-walk {
        0% { transform: scaleX(1) rotateZ(0deg); }
        25% { transform: scaleX(1) rotateZ(-2deg); }
        50% { transform: scaleX(1) rotateZ(0deg); }
        75% { transform: scaleX(1) rotateZ(2deg); }
        100% { transform: scaleX(1) rotateZ(0deg); }
      }

      @keyframes robot-sit {
        0% { transform: scaleX(1) rotateZ(0deg); }
        100% { transform: scaleX(0.95) rotateZ(0deg); }
      }
    `;
    document.head.appendChild(style);

    const robot = document.createElement("div");
    robot.className = "cursor-robot";
    robot.innerHTML = '<span class="robot-body" aria-hidden="true">🤖</span>';
    document.body.appendChild(robot);

    const state = {
      mouseX: window.innerWidth * 0.5,
      mouseY: window.innerHeight * 0.5,
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.5,
      velocityX: 0,
      velocityY: 0,
      nextCrumbAt: 0
    };

    document.addEventListener("mousemove", (event) => {
      state.mouseX = event.clientX;
      state.mouseY = event.clientY;
    }, { passive: true });

    function tick(now) {
      const pull = 0.0008;
      const damping = 0.94;
      const maxSpeed = 0.4;

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

      const faceScale = dx >= 0 ? 1 : -1;
      const tilt = Math.max(-14, Math.min(14, dy * 0.08));
      robot.style.transform = "translate(" + (state.x - 4) + "px, " + (state.y - 3) + "px) scaleX(" + faceScale + ") rotate(" + tilt + "deg)";

      const distance = Math.hypot(dx, dy);
      const isSitting = distance < 12;
      const isMoving = speed > 0.1;
      
      robot.classList.toggle("is-sitting", isSitting);
      robot.classList.toggle("is-walking", !isSitting && isMoving);

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  initRobotFollower();
})();
