// ------------------------------------------------------------
// Edit your details here. Anything left empty stays hidden.
// ------------------------------------------------------------
const CONFIG = {
  email: "",    // e.g. "you@gmail.com"
  linkedin: "", // e.g. "https://www.linkedin.com/in/your-name"
};

// EmailJS (contact form). Get these three values from your EmailJS dashboard.
const EMAILJS = {
  publicKey: "8m49bWOv6JrmXox61",   // Account > General > Public Key
  serviceId: "service_pkgbp5a",   // Email Services > your Gmail service
  templateId: "template_786wh8q", // Email Templates > your template
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



// ---------- Askly widget: gentle bounce + hello bubble to attract attention ----------
(function asklyNudge() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const script = document.querySelector('script[src*="askly.js"]');
  const side = (script && script.dataset.position) === "left" ? "left" : "right";

  let tries = 0;
  const wait = setInterval(() => {
    const host = document.getElementById("askly-widget");
    const sr = host && host.shadowRoot;
    const btn = sr && sr.querySelector(".launcher");
    const root = sr && sr.querySelector(".root");
    if (!btn || !root) {
      if (++tries > 80) clearInterval(wait); // give up after about 20 seconds
      return;
    }
    clearInterval(wait);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes nudge-bounce {
        0%, 100% { transform: translateY(0); }
        20% { transform: translateY(-12px); }
        40% { transform: translateY(0); }
        55% { transform: translateY(-6px); }
        70% { transform: translateY(0); }
      }
      @keyframes nudge-ring {
        0%   { box-shadow: 0 0 0 0 rgba(243,239,232,.5); }
        100% { box-shadow: 0 0 0 20px rgba(243,239,232,0); }
      }
      .launcher.attn { animation: nudge-bounce 1.1s ease 1, nudge-ring 1.6s ease-out 2; }
      .nudge {
        position: absolute; bottom: 8px; ${side}: 68px;
        background: #f3efe8; color: #171717; padding: 10px 14px; border-radius: 12px;
        font: 500 14px/1.2 system-ui, -apple-system, "Segoe UI", sans-serif;
        white-space: nowrap; box-shadow: 0 8px 24px rgba(0,0,0,.35);
        opacity: 0; transform: translateY(6px);
        transition: opacity .3s ease, transform .3s ease; pointer-events: none;
      }
      .nudge.show { opacity: 1; transform: none; }
    `;
    sr.appendChild(style);

    const bubble = document.createElement("div");
    bubble.className = "nudge";
    bubble.textContent = "Ask me about Mesud";
    root.appendChild(bubble);

    let stopped = false;
    const stop = () => {
      stopped = true;
      bubble.classList.remove("show");
      btn.classList.remove("attn");
    };
    btn.addEventListener("click", stop);

    const play = () => {
      if (stopped) return;
      btn.classList.remove("attn");
      void btn.offsetWidth; // restart the animation
      btn.classList.add("attn");
    };

    const showBubble = () => {
      if (stopped) return;
      bubble.classList.add("show");
      setTimeout(() => bubble.classList.remove("show"), 6000);
    };

    // First nudge after 3.5 seconds.
    setTimeout(() => {
      play();
      showBubble();
    }, 3500);

    // Then keep going until the visitor clicks the icon:
    // a bounce every 10 seconds, and the hello bubble every 40 seconds.
    let beat = 0;
    setInterval(() => {
      if (stopped) return;
      beat++;
      play();
      if (beat % 4 === 0) showBubble();
    }, 10000);
  }, 250);
})();


// ---------- Hero code window: gentle tilt following the mouse ----------
(function codeTilt() {
  const card = document.getElementById("codeCard");
  if (!card) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!window.matchMedia("(hover: hover)").matches) return;
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
    card.style.setProperty("--rx", (-y * 7).toFixed(2) + "deg");
  });
  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--rx", "0deg");
  });
})();



// ---------- Askly widget: greeting should talk about Mesud, not "us" ----------
(function asklyGreeting() {
  const FROM = /Ask me anything about us\.?/i;
  const TO = "Ask me anything about Mesud.";
  const fix = (sr) => {
    const walker = document.createTreeWalker(sr, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      if (FROM.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(FROM, TO);
    }
  };
  let tries = 0;
  const wait = setInterval(() => {
    const host = document.getElementById("askly-widget");
    const sr = host && host.shadowRoot;
    if (!sr) { if (++tries > 80) clearInterval(wait); return; }
    clearInterval(wait);
    fix(sr);
    new MutationObserver(() => fix(sr)).observe(sr, { childList: true, subtree: true, characterData: true });
  }, 250);
})();
// ---------- Contact form (EmailJS) ----------
(function contactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("cfStatus");
  const btn = document.getElementById("cfSend");
  const COOLDOWN_MS = 30000;

  const say = (msg, kind) => {
    status.textContent = msg;
    status.className = "form-status" + (kind ? " " + kind : "");
  };
  const configured = () =>
    window.emailjs && !/^YOUR_/.test(EMAILJS.publicKey + EMAILJS.serviceId + EMAILJS.templateId);

  if (configured()) emailjs.init({ publicKey: EMAILJS.publicKey });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.website.value) return; // bot filled the hidden field: pretend success
    const name = form.from_name.value.trim();
    const email = form.from_email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) return say("Please fill in your name, email and message.", "error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return say("Please enter a valid email address.", "error");

    try {
      const last = Number(localStorage.getItem("cfLast") || 0);
      if (Date.now() - last < COOLDOWN_MS) return say("Please wait a moment before sending another message.", "error");
    } catch (_) {}

    if (!configured()) return say("The form is not set up yet. Please use the email button below.", "error");

    btn.disabled = true;
    btn.textContent = "Sending...";
    say("");
    try {
      await emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, form);
      try { localStorage.setItem("cfLast", String(Date.now())); } catch (_) {}
      form.reset();
      say("Thanks! Your message was sent. I will reply soon.", "ok");
    } catch (err) {
      say("Sorry, that did not send. Please try again or email me directly.", "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message";
    }
  });
})();