/* =====================================================================
   cursor.js — カスタムカーソル(dot即追従 + ring慣性) / 磁石ボタン
   reduce / タッチ端末では無効
   ===================================================================== */
(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (reduce || coarse) return;

  const dot = document.createElement("div"); dot.className = "cursor-dot";
  const ring = document.createElement("div"); ring.className = "cursor-ring";
  document.body.append(dot, ring);
  document.body.classList.add("has-cursor");

  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  }, { passive: true });

  const tick = () => {
    rx += (mx - rx) * .16; ry += (my - ry) * .16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // ホバーで拡大
  const hoverSel = "a, button, .hoverable, .tool-card, .btn";
  document.querySelectorAll(hoverSel).forEach((el) => {
    el.addEventListener("mouseenter", () => ring.classList.add("hover"));
    el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
  });
  window.addEventListener("mousedown", () => ring.classList.add("down"));
  window.addEventListener("mouseup", () => ring.classList.remove("down"));
  document.addEventListener("mouseleave", () => { dot.style.opacity = ring.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { dot.style.opacity = ring.style.opacity = "1"; });

  /* ---- 磁石ボタン ---- */
  document.querySelectorAll(".magnetic").forEach((el) => {
    const strength = parseFloat(el.dataset.magnet || ".3");
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });

  /* ---- ツールカードの3Dチルト + グロー追従 ---- */
  document.querySelectorAll(".tool-card[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateY(${(px - .5) * 9}deg) rotateX(${(.5 - py) * 9}deg) translateY(-6px)`;
      card.style.setProperty("--gx", `${px * 100}%`);
      card.style.setProperty("--gy", `${py * 100}%`);
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
})();
