/* =========================================================
   English 1123 Premium UI Interactions
   Replace your old script.js with this file.
   ========================================================= */

(function () {
  "use strict";

  const body = document.body;
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const backToTop = document.getElementById("backToTop");
  const soundToggle = document.getElementById("soundToggle");
  const year = document.getElementById("year");

  if (year) year.textContent = new Date().getFullYear();

  /* Sticky header + back to top */
  const handleScroll = () => {
    const scrolled = window.scrollY > 30;
    header?.classList.toggle("scrolled", scrolled);
    backToTop?.classList.toggle("show", window.scrollY > 450);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    playTone("up");
  });

  /* Mobile navigation */
  const closeMenu = () => {
    menuToggle?.classList.remove("active");
    mainNav?.classList.remove("open");
    body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", () => {
    const isOpen = mainNav?.classList.toggle("open");
    menuToggle.classList.toggle("active", Boolean(isOpen));
    body.classList.toggle("menu-open", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    playTone(Boolean(isOpen) ? "open" : "close");
  });

  mainNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!mainNav || !menuToggle) return;
    if (!mainNav.classList.contains("open")) return;
    const clickedInside = mainNav.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) closeMenu();
  });

  /* Reveal animation */
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("show"));
  }

  /* Educational sound effects without audio files
     Browser rule: sound begins after user interaction. */
  let soundEnabled = localStorage.getItem("english1123Sound") !== "off";
  let audioContext = null;
  let lastSoundAt = 0;

  const updateSoundButton = () => {
    if (!soundToggle) return;
    soundToggle.textContent = soundEnabled ? "🔊" : "🔇";
    soundToggle.setAttribute("aria-pressed", String(soundEnabled));
    soundToggle.title = soundEnabled ? "Educational sounds on" : "Educational sounds off";
  };

  const getAudioContext = () => {
    if (!audioContext) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      audioContext = new AudioContext();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    return audioContext;
  };

  window.playTone = function playTone(type = "click") {
    if (!soundEnabled) return;

    const now = Date.now();
    if (now - lastSoundAt < 80) return;
    lastSoundAt = now;

    const ctx = getAudioContext();
    if (!ctx) return;

    const tones = {
      hover: [560, 0.025, 0.018],
      click: [720, 0.04, 0.028],
      open: [520, 0.05, 0.032],
      close: [320, 0.04, 0.025],
      up: [850, 0.06, 0.035],
      success: [660, 0.05, 0.03]
    };

    const [frequency, duration, volume] = tones[type] || tones.click;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  soundToggle?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("english1123Sound", soundEnabled ? "on" : "off");
    updateSoundButton();
    if (soundEnabled) playTone("success");
  });

  updateSoundButton();

  document.querySelectorAll(".sound-hover, .btn, .topic-card, .skill-item, .feature-card").forEach((element) => {
    element.addEventListener("mouseenter", () => playTone("hover"));
    element.addEventListener("click", () => playTone("click"));
  });

  /* Active nav state for same-page sections */
  const sectionIds = ["home", "about", "course-plan", "paper1", "paper2", "skills", "pastpapers", "resources", "trial"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const navLinks = Array.from(document.querySelectorAll(".main-nav a"));

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            const matches = href === `#${id}` || (id === "home" && href.endsWith("index.html"));
            if (matches) link.classList.add("active");
            else if (href.startsWith("#") || href.endsWith("index.html")) link.classList.remove("active");
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );

    sections.forEach((section) => activeObserver.observe(section));
  }
})();
