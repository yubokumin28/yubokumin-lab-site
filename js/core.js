/* =====================================================================
   core.js — ナビ / モバイルメニュー / リビール / パララックス / アンカー
   （260315 main.js を遊牧民ポートフォリオ向けに再構成）
   ===================================================================== */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  window.__reduceMotion = reduce;

  /* ---- ナビ：スクロールで背景 ---- */
  const nav = document.getElementById("nav");
  const onNav = () => nav && nav.classList.toggle("scrolled", window.scrollY > 40);
  onNav();
  window.addEventListener("scroll", onNav, { passive: true });

  /* ---- スクロール進捗バー（上部） ---- */
  const prog = document.createElement("div");
  prog.className = "scroll-progress";
  prog.innerHTML = "<i></i>";
  document.body.appendChild(prog);
  const bar = prog.firstElementChild;
  const onProg = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, window.scrollY / h) : 0})`;
  };
  onProg();
  window.addEventListener("scroll", onProg, { passive: true });
  window.addEventListener("resize", onProg);

  /* ---- 画面全体を泳ぐアザラシ ---- */
  if (!reduce) {
    const base = location.pathname.includes("/tools/") ? "../" : "";
    const swim = document.createElement("img");
    swim.src = base + "assets/swimming.png";
    swim.className = "swim-seal";
    swim.alt = ""; swim.setAttribute("aria-hidden", "true");
    document.body.appendChild(swim);
  }

  /* ---- モバイルメニュー ---- */
  const toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", () => document.body.classList.toggle("menu-open"));
    document.querySelectorAll(".nav-links a").forEach(a =>
      a.addEventListener("click", () => document.body.classList.remove("menu-open")));
  }

  /* ---- 現在ページをハイライト ---- */
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach(a => {
    if (a.getAttribute("data-page") === path) a.classList.add("is-active");
  });

  /* ---- リビール + マスク見出し（GSAP があれば smooth.js が所有）---- */
  const gsapOwns = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined" && !reduce;
  const reveals = document.querySelectorAll(".reveal, .mask");
  if (gsapOwns) {
    /* GSAP に委譲（smooth.js） */
  } else if ("IntersectionObserver" in window && !reduce) {
    const vh = window.innerHeight;
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } });
    }, { threshold: .14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < vh * 0.95) el.classList.add("visible"); // 初期表示域は即時
      else io.observe(el);
    });
  } else {
    reveals.forEach(el => el.classList.add("visible"));
  }

  /* ---- パララックス：マウス + スクロール + ジャイロ ---- */
  const scenes = document.querySelectorAll("[data-parallax-scene]");
  if (scenes.length && !reduce) {
    let tmx = 0, tmy = 0, mx = 0, my = 0;
    window.addEventListener("mousemove", (e) => {
      tmx = (e.clientX / window.innerWidth - .5) * 2;
      tmy = (e.clientY / window.innerHeight - .5) * 2;
    }, { passive: true });
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma != null) { tmx = Math.max(-1, Math.min(1, e.gamma / 30)); tmy = Math.max(-1, Math.min(1, (e.beta - 45) / 30)); }
    }, { passive: true });
    const tick = () => {
      mx += (tmx - mx) * .06; my += (tmy - my) * .06;
      scenes.forEach(s => { s.style.setProperty("--mx", mx.toFixed(3)); s.style.setProperty("--my", my.toFixed(3)); });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---- スクロールで弾むアザラシ ---- */
  const seals = document.querySelectorAll(".scrollpop");
  if (seals.length && !reduce) {
    let last = window.scrollY;
    window.addEventListener("scroll", () => {
      const vel = Math.min(16, Math.abs(window.scrollY - last) * .22); last = window.scrollY;
      seals.forEach(s => s.style.setProperty("--pop", `-${vel}px`));
    }, { passive: true });
  }

  /* ---- アンカー・スムーススクロール（Lenis 未使用時のフォールバック）---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          if (window.__lenis) window.__lenis.scrollTo(t, { offset: -70 });
          else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        }
      }
    });
  });
})();
