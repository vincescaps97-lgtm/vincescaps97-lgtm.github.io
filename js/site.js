/* ============================================================
   Shared page glue. Every page imports `boot()` once:

     import { boot } from "./js/site.js";
     boot({ page: "projects" });

   Handles the paper background, the drawer menu, the hero dock,
   scroll reveals and the footer year.

   No Three.js here on purpose: the background is meant to sit
   still, so the only 3D left on the site is the gallery wall,
   which that page loads itself.
   ============================================================ */

import { mountMenu, mountDock } from "./nav.js";
import { mountBackground } from "./background.js";
import { initDock } from "./dock.js";

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = typeof window.gsap !== "undefined";

/* ScrollTrigger va REGISTRATO: caricarlo dalla CDN non basta.
   Senza questa riga l'opzione `scrollTrigger:` dentro gsap.from()
   resta inerte, l'animazione non parte e l'elemento si ferma a
   opacity 0: contenti che spariscono e non tornano più. */
if (hasGSAP && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

export function boot({ page = "", dock = false } = {}) {
  /* ---------- sfondo carta + doodle ---------- */

  mountBackground();

  /* ---------- drawer ---------- */

  const { menu, openBtn, closeBtn } = mountMenu(page);
  let lastFocus = null;

  function setMenu(open) {
    menu.hidden = false; // need it in the tree to animate out again
    document.body.classList.toggle("menu-open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    // keep the drawer out of the tab order while it is closed
    menu.setAttribute("aria-hidden", String(!open));

    if (open) {
      lastFocus = document.activeElement;
      closeBtn.focus();
    } else if (lastFocus) {
      lastFocus.focus();
    }

    const done = () => {
      if (!open) menu.hidden = true;
    };
    // reduced motion: no slide, so close immediately
    if (reduced || !hasGSAP) return done();

    gsap.killTweensOf([".drawer__panel", ".drawer__scrim"]);
    if (open) {
      gsap.fromTo(
        ".drawer__panel",
        { xPercent: -100 },
        { xPercent: 0, duration: 0.55, ease: "power3.out", onComplete: done }
      );
      gsap.fromTo(".drawer__scrim", { opacity: 0 }, { opacity: 1, duration: 0.35 });
    } else {
      gsap.to(".drawer__panel", {
        xPercent: -100,
        duration: 0.4,
        ease: "power2.in",
        onComplete: done,
      });
      gsap.to(".drawer__scrim", { opacity: 0, duration: 0.3 });
    }
  }

  openBtn.addEventListener("click", () => setMenu(true));
  closeBtn.addEventListener("click", () => setMenu(false));

  // click the scrim, or any link, to dismiss
  menu.addEventListener("click", (e) => {
    if (e.target.closest(".drawer__link") || e.target.closest(".drawer__scrim")) {
      setMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden && document.body.classList.contains("menu-open")) {
      setMenu(false);
    }
  });

  /* ---------- hero dock ---------- */

  if (dock) {
    const el = mountDock(page);
    if (el) initDock(el);
  }

  /* ---------- theme toggle ---------- */

  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  /* ---------- scroll reveals ---------- */

  if (hasGSAP && !reduced) {
    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.from(el, {
        y: 44,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    // anything already on screen at load
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) return;
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    });
  }

  /* ---------- footer year ---------- */

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  return { setMenu };
}
