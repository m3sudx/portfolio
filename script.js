// ------------------------------------------------------------
// Edit your details here. Anything left empty stays hidden.
// ------------------------------------------------------------
const CONFIG = {
  email: "",    // e.g. "you@gmail.com"
  linkedin: "", // e.g. "https://www.linkedin.com/in/your-name"
  upwork: "",   // e.g. "https://www.upwork.com/freelancers/~your-id"
};

document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Background lines subtle parallax ----------
(function bgParallax() {
  if (reduceMotion) return;
  const svg = document.getElementById("bg-lines");
  if (!svg) return;
  let raf;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 18;
    targetY = (e.clientY / window.innerHeight - 0.5) * 12;
  }, { passive: true });

  function tick() {
    // Lerp towards target — smooth inertia
    currentX += (targetX - currentX) * 0.045;
    currentY += (targetY - currentY) * 0.045;
    svg.style.transform = `translate(${currentX}px, ${currentY}px)`;
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
})();

// ---------- Contact details ----------
(function fillContact() {
  const { email, linkedin, upwork } = CONFIG;

  if (email) {
    document.querySelectorAll("[data-contact]").forEach((a) => {
      a.href = "mailto:" + email;
    });
    const t = document.querySelector("[data-email-text]");
    if (t) {
      t.href = "mailto:" + email;
      t.textContent = email;
      t.hidden = false;
    }
  }
  const li = document.querySelector("[data-linkedin]");
  if (li && linkedin) { li.href = linkedin; li.hidden = false; }
  const up = document.querySelector("[data-upwork]");
  if (up && upwork) { up.href = upwork; up.hidden = false; }
})();

// ---------- Mobile menu ----------
(function menu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("menu");
  if (!btn || !nav) return;

  const set = (open) => {
    nav.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  btn.addEventListener("click", () => set(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") set(false);
  });
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) set(false);
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) set(false);
  });
})();

// ---------- Highlight the current section in the menu ----------
(function activeLink() {
  const links = [...document.querySelectorAll(".menu a[href^='#']")];
  const map = new Map();
  links.forEach((a) => {
    const el = document.querySelector(a.getAttribute("href"));
    if (el) map.set(el, a);
  });
  if (!("IntersectionObserver" in window) || map.size === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          map.get(en.target)?.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  map.forEach((_, el) => io.observe(el));
})();

// ---------- Reveal on scroll ----------
(function reveal() {

  // Generic reveal elements
  const items = document.querySelectorAll(".reveal");

  // Project cards (staggered)
  const projects = [...document.querySelectorAll(".project")];

  // Skill rows (slide in from left, staggered)
  const skillRows = [...document.querySelectorAll(".skills > div")];

  // About children
  const aboutChildren = [...document.querySelectorAll(".about > *")];

  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach((i) => i.classList.add("in"));
    projects.forEach((p) => p.classList.add("in"));
    skillRows.forEach((s) => s.classList.add("in"));
    aboutChildren.forEach((a) => a.classList.add("in"));
    document.querySelectorAll(".chat .step").forEach((s) => s.classList.add("in"));
    return;
  }

  // Generic reveals
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((i) => io.observe(i));

  // Project cards with stagger
  const projIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const idx = projects.indexOf(en.target);
          setTimeout(() => en.target.classList.add("in"), idx * 120);
          projIO.unobserve(en.target);
        }
      });
    },
    { threshold: 0.08 }
  );
  projects.forEach((p) => projIO.observe(p));

  // Skill rows with stagger
  const skillIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const idx = skillRows.indexOf(en.target);
          setTimeout(() => en.target.classList.add("in"), idx * 100);
          skillIO.unobserve(en.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  skillRows.forEach((s) => skillIO.observe(s));

  // About children with stagger
  const aboutIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          const idx = aboutChildren.indexOf(en.target);
          setTimeout(() => en.target.classList.add("in"), idx * 150);
          aboutIO.unobserve(en.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  aboutChildren.forEach((a) => aboutIO.observe(a));

  // Chat messages appear one after another
  const steps = [...document.querySelectorAll(".chat .step")];
  steps.forEach((s, i) => setTimeout(() => s.classList.add("in"), 500 + i * 650));
})();

// ---------- Project screenshots: use real images when they exist ----------
(function screenshots() {
  document.querySelectorAll(".shot[data-image]").forEach((box) => {
    const src = box.dataset.image;
    const probe = new Image();
    probe.onload = () => {
      const img = document.createElement("img");
      img.className = "shot";
      img.src = src;
      img.alt = box.dataset.alt || "";
      img.loading = "lazy";
      box.replaceWith(img);
    };
    probe.src = src;
  });
})();

// ---------- Footer year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
