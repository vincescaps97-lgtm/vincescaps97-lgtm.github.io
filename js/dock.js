/* ============================================================
   macOS-style dock behaviour — vanilla, no library.

   Two effects:
   1. Magnification. Icons near the cursor grow and lift, on a
      bell curve, the way the real dock does. Pure transform maths
      in one rAF loop, so it costs nothing while the pointer is
      still.
   2. Bounce on click, the small "the app is launching" hop.
   ============================================================ */

const MAX_SCALE = 1.65;   // how big the nearest icon grows
const LIFT = 14;           // px it rises at full magnification
const RANGE = 78;          // px of influence either side
const EASE = 0.28;         // per-frame lerp, lower = snappier

export function initDock(dock) {
  const inner = dock.querySelector(".dock__inner");
  if (!inner) return;

  const items = [...inner.querySelectorAll(".dock__item")];
  if (!items.length) return;

  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return; // static dock is fine

  let pointerX = null;
  let raf = 0;

  const state = items.map(() => ({ scale: 1, lift: 0 }));

  function tick() {
    let moving = false;

    items.forEach((el, i) => {
      const s = state[i];
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;

      let target = 1;
      if (pointerX !== null) {
        const d = Math.abs(pointerX - cx);
        if (d < RANGE) {
          // bell curve: full size at the cursor, easing to 0 at RANGE
          const f = Math.cos((d / RANGE) * (Math.PI / 2)) ** 2;
          target = 1 + (MAX_SCALE - 1) * f;
        }
      }

      // lift is proportional to how magnified this icon is
      const targetLift = ((target - 1) / (MAX_SCALE - 1)) * LIFT;

      const nextScale = s.scale + (target - s.scale) * EASE;
      const nextLift = s.lift + (targetLift - s.lift) * EASE;

      // stop writing transforms once everything has settled
      if (Math.abs(target - s.scale) > 0.001) moving = true;

      s.scale = Math.abs(nextScale - 1) < 0.001 ? 1 : nextScale;
      s.lift = Math.abs(nextLift) < 0.05 ? 0 : nextLift;

      el.style.transform = `translateY(${-s.lift}px) scale(${s.scale})`;
    });

    raf = moving ? requestAnimationFrame(tick) : 0;
  }

  function start() {
    if (!raf) raf = requestAnimationFrame(tick);
  }

  inner.addEventListener(
    "pointermove",
    (e) => {
      pointerX = e.clientX;
      start();
    },
    { passive: true }
  );

  inner.addEventListener("pointerleave", () => {
    pointerX = null;
    start();
  });

  // touch: no hover, so just pop the pressed icon
  inner.addEventListener(
    "pointerdown",
    (e) => {
      const el = e.target.closest(".dock__item");
      if (!el || matchMedia("(hover: none)").matches) return;
      el.classList.add("is-pressed");
    },
    { passive: true }
  );
  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
    inner.addEventListener(ev, () =>
      inner.querySelectorAll(".is-pressed").forEach((n) => n.classList.remove("is-pressed"))
    )
  );

  // keyboard focus should preview the icon too
  items.forEach((el) => {
    el.addEventListener("focus", () => el.classList.add("is-focus"));
    el.addEventListener("blur", () => el.classList.remove("is-focus"));
  });
}