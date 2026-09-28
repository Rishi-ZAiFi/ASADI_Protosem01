/* ==========================================================================
   PRINETHA KANNAN — PORTFOLIO SCRIPT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // 1. PRELOADER & MOVING NAME ANIMATION
  const preloader = document.getElementById("preloader");
  const loaderProgress = document.getElementById("loaderProgress");

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 20) + 10;
    if (progress > 100) progress = 100;
    if (loaderProgress) loaderProgress.style.width = progress + "%";

    if (progress === 100) {
      clearInterval(progressInterval);
      setTimeout(() => {
        if (preloader) preloader.classList.add("fade-out");
      }, 400);
    }
  }, 80);

  // 2. CURSOR SPOTLIGHT FOLLOWER
  const cursorGlow = document.getElementById("cursorGlow");
  window.addEventListener("mousemove", (e) => {
    if (cursorGlow) {
      cursorGlow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
  });

  // 3. INTERACTIVE COLOR TILES CANVAS
  const tileGrid = document.getElementById("tileGrid");
  let currentPreset = "neon";

  const colorPalettes = {
    neon: ["#6366f1", "#a855f7", "#06b6d4", "#3b82f6", "#ec4899"],
    aurora: ["#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#14b8a6"],
    sunset: ["#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#f97316"]
  };

  function createTileGrid() {
    if (!tileGrid) return;
    tileGrid.innerHTML = "";

    const tileSize = 55;
    const columns = Math.ceil(window.innerWidth / tileSize);
    const rows = Math.ceil(window.innerHeight / tileSize);
    const totalTiles = columns * rows;

    for (let i = 0; i < totalTiles; i++) {
      const tile = document.createElement("div");
      tile.classList.add("color-tile");

      tile.addEventListener("mouseenter", () => {
        const colors = colorPalettes[currentPreset];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        tile.style.backgroundColor = randomColor;
        tile.style.boxShadow = `0 0 12px ${randomColor}`;

        setTimeout(() => {
          tile.style.backgroundColor = "rgba(255, 255, 255, 0.012)";
          tile.style.boxShadow = "none";
        }, 750);
      });

      tileGrid.appendChild(tile);
    }
  }

  createTileGrid();
  window.addEventListener("resize", debounce(createTileGrid, 250));

  // Color Preset Buttons
  const presetBtns = document.querySelectorAll(".preset-btn");
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentPreset = btn.getAttribute("data-preset");
      showToast(`Color Palette: ${currentPreset.toUpperCase()}`);
    });
  });

  // 4. ECOMON LIVE CONTROLS SIMULATOR
  const evSlider = document.getElementById("evSlider");
  const evValue = document.getElementById("evValue");
  const evBar = document.getElementById("evBar");

  const gasSlider = document.getElementById("gasSlider");
  const gasValue = document.getElementById("gasValue");
  const gasBar = document.getElementById("gasBar");

  const powerSlider = document.getElementById("powerSlider");
  const powerValue = document.getElementById("powerValue");
  const powerBar = document.getElementById("powerBar");

  const ecomonStatus = document.getElementById("ecomonStatus");

  function updateEcomonWidget() {
    if (evSlider && evValue && evBar) {
      const val = evSlider.value;
      evValue.textContent = `${val}%`;
      evBar.style.width = `${val}%`;
    }

    if (gasSlider && gasValue && gasBar) {
      const val = gasSlider.value;
      gasValue.textContent = `${val}%`;
      gasBar.style.width = `${val}%`;
    }

    if (powerSlider && powerValue && powerBar) {
      const val = parseFloat(powerSlider.value).toFixed(1);
      powerValue.textContent = `${val} kWh`;
      const fillPercentage = (val / 5.0) * 100;
      powerBar.style.width = `${fillPercentage}%`;
    }

    if (ecomonStatus && evSlider && gasSlider && powerSlider) {
      const ev = parseInt(evSlider.value);
      const gas = parseInt(gasSlider.value);
      const power = parseFloat(powerSlider.value);

      if (ev < 20) {
        ecomonStatus.textContent = "⚠️ EV Battery critically low!";
        ecomonStatus.style.color = "#ef4444";
      } else if (gas < 15) {
        ecomonStatus.textContent = "⚠️ LPG Cylinder level low.";
        ecomonStatus.style.color = "#f59e0b";
      } else if (power > 4.2) {
        ecomonStatus.textContent = "⚠️ High electricity usage.";
        ecomonStatus.style.color = "#a855f7";
      } else {
        ecomonStatus.textContent = "✔ System operating normally.";
        ecomonStatus.style.color = "#10b981";
      }
    }
  }

  if (evSlider) evSlider.addEventListener("input", updateEcomonWidget);
  if (gasSlider) gasSlider.addEventListener("input", updateEcomonWidget);
  if (powerSlider) powerSlider.addEventListener("input", updateEcomonWidget);

  // 5. HORIZONTAL TIMELINE ARROW CONTROLS
  const horizontalTimeline = document.querySelector(".horizontal-timeline-wrapper");
  const timelinePrev = document.getElementById("timelinePrev");
  const timelineNext = document.getElementById("timelineNext");

  if (horizontalTimeline && timelinePrev && timelineNext) {
    timelinePrev.addEventListener("click", () => {
      horizontalTimeline.scrollBy({ left: -380, behavior: "smooth" });
    });
    timelineNext.addEventListener("click", () => {
      horizontalTimeline.scrollBy({ left: 380, behavior: "smooth" });
    });
  }

  // 6. NAVIGATION OBSERVER & MOBILE MENU
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });
  }

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 140;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // 7. COPY EMAIL
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = "prinethakannan@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email address copied!");
      }).catch(() => {
        showToast("prinethakannan@gmail.com");
      });
    });
  }

  // 8. LIGHTBOX MODAL TRIGGER HANDLERS
  const openModalBtns = document.querySelectorAll(".open-modal-btn, [data-modal]");
  const closeModalBtns = document.querySelectorAll(".modal-close");

  openModalBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetModalId = btn.getAttribute("data-modal");
      if (targetModalId) {
        const modal = document.getElementById(targetModalId);
        if (modal) modal.classList.add("active");
      }
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetModalId = btn.getAttribute("data-close");
      const modal = document.getElementById(targetModalId);
      if (modal) modal.classList.remove("active");
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      e.target.classList.remove("active");
    }
  });

  // 9. CONTACT FORM HANDLER
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("formName").value;
      showToast(`Thank you ${name}! Message sent.`);
      contactForm.reset();
    });
  }

  // TOAST FUNCTION
  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
});
