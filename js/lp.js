/* =====================================================================
   lp.js — カウントアップ / 図解スクラブ / 機能の横スクロール
   ハブ・個別LP共通。GSAP があれば滑らか、無ければ縮退。
   ===================================================================== */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const narrow = window.matchMedia("(max-width: 880px)").matches;
  const hasST = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  /* ---------- 数字カウントアップ ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const span = el.querySelector("span") || el;
    if (reduce) { span.textContent = target + suffix; return; }
    const dur = 1400, t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      span.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach(e => { if (e.isIntersecting) { runCount(e.target); io.unobserve(e.target); } });
      }, { threshold: .5 });
      counters.forEach(c => io.observe(c));
    } else counters.forEach(runCount);
  }

  /* ---------- 図解SVGの「データが流れる」スクラブ ---------- */
  document.querySelectorAll("[data-flow]").forEach((wrap) => {
    const nodes = wrap.querySelectorAll(".flow-node");
    if (reduce) { nodes.forEach(n => n.classList.add("lit")); return; }
    if (hasST) {
      window.ScrollTrigger.create({
        trigger: wrap, start: "top 75%", end: "bottom 60%", scrub: false,
        onEnter: () => nodes.forEach((n, i) => setTimeout(() => n.classList.add("lit"), i * 260)),
      });
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach(e => {
        if (e.isIntersecting) { nodes.forEach((n, i) => setTimeout(() => n.classList.add("lit"), i * 260)); io.unobserve(e.target); }
      }), { threshold: .35 });
      io.observe(wrap);
    } else nodes.forEach(n => n.classList.add("lit"));
  });

  /* ---------- 機能パネルの横スクロール（pin + x移動） ---------- */
  const tracks = document.querySelectorAll("[data-hscroll]");
  tracks.forEach((sec) => {
    const track = sec.querySelector(".hscroll-track");
    if (!track) return;
    if (!hasST || reduce || narrow) {
      sec.classList.add("hscroll-stacked"); // 縦積みフォールバック
      return;
    }
    const getScroll = () => track.scrollWidth - sec.clientWidth;
    window.gsap.to(track, {
      x: () => -getScroll(),
      ease: "none",
      scrollTrigger: {
        trigger: sec, start: "top top", end: () => "+=" + getScroll(),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
  });
})();
