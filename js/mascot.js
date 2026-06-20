/* =====================================================================
   mascot.js — スクロールで各セクションを旅するアザラシ
   GLB(window.SEAL_GLB)があれば <model-viewer>、無ければ画像のまま。
   GSAP ScrollTrigger コールバック方式（scrub不使用・reset glリ回避）。
   ===================================================================== */
(() => {
  "use strict";
  const m = document.getElementById("mascot");
  if (!m) return;

  /* ---- GLBがあれば model-viewer に差し替え ---- */
  if (window.SEAL_GLB) {
    m.innerHTML = '<model-viewer src="' + window.SEAL_GLB + '" auto-rotate rotation-per-second="18deg" ' +
                  'camera-controls disable-zoom interaction-prompt="none" shadow-intensity="1" exposure="1.05" ' +
                  'environment-image="neutral" alt="遊牧民ラボのアザラシ"></model-viewer>';
  }

  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const narrow = window.matchMedia("(max-width:880px)").matches;
  const hasST = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  // 動きを止める条件：reduce / narrow / GSAP無し → ヒーロー定位置のまま
  if (reduce || narrow || !hasST) {
    if (narrow) m.style.opacity = ".96";
    return;
  }

  const gsap = window.gsap, ST = window.ScrollTrigger;
  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  const go = (x, y, s, a) => gsap.to(m, {
    x: x, y: y, scale: s, autoAlpha: (a == null ? 1 : a),
    duration: .8, ease: "power3.inOut", overwrite: true
  });

  // 各セクションの「定位置」。ヒーローは transform 0（CSSの右下）が定位置。
  const poses = [
    { sel: ".hero",     enterBack: () => go(0, 0, 1, 1) },                    // 戻ってきたらヒーロー定位置
    { sel: "#story",    enter: () => go(-W() * 0.60, -H() * 0.06, .52, 1) },  // 左へ小さく
    { sel: "#tools",    enter: () => go(0, -H() * 0.05, .44, 1) },            // 右の隅へ小さく
    { sel: "#profile",  enter: () => go(-W() * 0.58, -H() * 0.05, .50, 1) },  // 左へ
  ];

  poses.forEach((p) => {
    ST.create({
      trigger: p.sel, start: "top 60%", end: "bottom 40%",
      onEnter: p.enter, onEnterBack: p.enterBack || p.enter,
    });
  });

  // 連絡先/フッターに入ったらフェードアウト（戻ると復帰）
  const contact = document.querySelector("#contact");
  if (contact) {
    ST.create({
      trigger: contact, start: "top 85%",
      onEnter: () => gsap.to(m, { autoAlpha: 0, duration: .5, overwrite: true }),
      onLeaveBack: () => gsap.to(m, { autoAlpha: 1, duration: .5, overwrite: true }),
    });
  }

  // リサイズで座標を再計算（現在のトリガーを作り直す）
  window.addEventListener("resize", () => ST.refresh());
})();
