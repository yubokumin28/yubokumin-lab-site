/* =====================================================================
   spline-hero.js — Spline水シーンの遅延ロード / WebGL検出 / fallback
   重い 3D はトップが見えてから挿入。失敗・低スペックは静止ヒーローへ。
   ===================================================================== */
(() => {
  "use strict";
  const stage = document.getElementById("heroStage");
  const fallback = document.getElementById("heroFallback");
  if (!stage) return;

  const SCENE = stage.dataset.scene;
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  function webglOK() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (e) { return false; }
  }
  function lowSpec() {
    return window.innerWidth < 880
      || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
      || (navigator.deviceMemory && navigator.deviceMemory <= 2);
  }

  function showFallback() {
    if (fallback) fallback.style.display = "block";
    stage.style.display = "none";
  }

  if (reduce || !webglOK() || lowSpec() || !SCENE) { showFallback(); return; }

  // トップは初手で見えるので、初回ペイント後アイドル時に挿入
  const insert = () => {
    const loader = document.createElement("script");
    loader.type = "module";
    loader.src = "https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js";
    loader.onerror = showFallback;
    document.head.appendChild(loader);

    const viewer = document.createElement("spline-viewer");
    viewer.setAttribute("url", SCENE);
    viewer.setAttribute("events-target", "global");
    viewer.setAttribute("loading-anim-type", "none");
    viewer.style.opacity = "0";
    stage.appendChild(viewer);

    let done = false;
    const reveal = () => { if (done) return; done = true; stage.classList.add("ready"); viewer.style.opacity = "1"; };
    viewer.addEventListener("load", reveal);
    // 8秒で来なければ fallback
    setTimeout(() => { if (!done) showFallback(); }, 8000);
    // load が拾えない実装向けの保険
    setTimeout(reveal, 2600);
  };

  if ("requestIdleCallback" in window) requestIdleCallback(insert, { timeout: 1200 });
  else setTimeout(insert, 400);
})();
