/* =====================================================================
   smooth.js — Lenis 慣性スクロール + GSAP/ScrollTrigger 連携
   CDN(Lenis, gsap, ScrollTrigger)が読めなくても安全に縮退する
   ===================================================================== */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  const hasLenis = typeof window.Lenis !== "undefined";

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  /* ---- Lenis 慣性スクロール（reduce / タッチ端末は無効）---- */
  let lenis = null;
  if (hasLenis && !reduce) {
    lenis = new window.Lenis({
      duration: coarse ? 1.0 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    window.__lenis = lenis;

    if (hasST) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* ---- GSAP リビール（core.js の IO より滑らか。GSAP がある時だけ上書き）---- */
  if (hasST && !reduce) {
    // reveal と mask をまとめて確実なフェードアップで処理
    const items = window.gsap.utils.toArray(".reveal, .mask");
    items.forEach((el) => {
      const dx = el.classList.contains("from-left") ? -48 : el.classList.contains("from-right") ? 48 : 0;
      const sc = el.classList.contains("scale-in") ? .92 : 1;
      let delay = 0;
      ["d1","d2","d3","d4","d5"].forEach((d, i) => { if (el.classList.contains(d)) delay = (i + 1) * .08; });
      window.gsap.set(el, { opacity: 0, y: dx ? 0 : 34, x: dx, scale: sc, transition: "none" });
      el.style.transition = "none";
      window.gsap.to(el, {
        opacity: 1, x: 0, y: 0, scale: 1, duration: .95, ease: "power3.out", delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onStart: () => el.classList.add("visible"),
      });
    });
  }

  // リサイズで再計算
  if (hasST) window.addEventListener("load", () => window.ScrollTrigger.refresh());
})();
