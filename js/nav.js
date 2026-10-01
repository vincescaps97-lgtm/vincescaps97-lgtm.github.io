/* ============================================================
   Navigazione condivisa.

   Due pezzi, entrambi generati da qui:

   mountMenu()  il pannello che scorre da sinistra
   mountDock()  la dock in stile macOS, nell'hero

   Entrambi leggono la stessa lista NAV, che segue la struttura
   del template di riferimento: About · Projects · Gallery ·
   Blog · Contact.
   ============================================================ */

/**
 * Le icone sono AVIF 512×512 in `icons/`. Il nome del file corrisponde
 * all'`id`: `about`, `projects`, `gallery`, `journal`, `contact`.
 *
 * Aggiungere una sezione = una riga qui più il file in icons/.
 * `fallback` è opzionale: serve solo se vuoi un'icona di riserva.
 */
export const NAV = [
  {
    id: "about",
    label: "Chi Sono",
    href: "about.html",
    icon: "icons/about.avif",
  },
  {
    id: "projects",
    label: "Projects",
    href: "projects.html",
    icon: "icons/projects.avif",
  },
  {
    id: "gallery",
    label: "Gallery",
    href: "gallery.html",
    icon: "icons/gallery.avif",
    // nascosta per ora: togli questo campo per rimetterla nel
    // pannello e nella dock. `gallery.html` resta sul disco.
    hidden: true,
  },
  {
    id: "journal",
    label: "Blog",
    href: "journal.html",
    icon: "icons/journal.avif",
  },
  {
    id: "contact",
    label: "Contatti",
    href: "contact.html",
    icon: "icons/contact.avif",
    separator: true,
  },
];

import { SOCIALS } from "./data.js";
export { SOCIALS };

/** Home è solo nel pannello: non ha un'icona nella dock. */
const HOME_ITEM = { id: "home", label: "Home", href: "index.html" };

/** Le voci visibili: una sezione con `hidden` non finisce né nel
    pannello né nella dock, ma la pagina continua a esistere. */
const VISIBLE = NAV.filter((i) => !i.hidden);

const iconMarkup = (i) =>
  i.fallback
    ? `<img src="${i.icon}" data-fallback="${i.fallback}" alt="" loading="lazy">`
    : `<img src="${i.icon}" alt="" loading="lazy">`;

/* ------------------------------------------------------------
   drawer
   ------------------------------------------------------------ */

export function mountMenu(currentId) {
  const order = [HOME_ITEM, ...VISIBLE];
  const current = VISIBLE.find((n) => n.id === currentId);

  const openBtn = document.createElement("button");
  openBtn.className = "topbar__btn";
  openBtn.id = "menuOpen";
  openBtn.setAttribute("aria-expanded", "false");
  openBtn.setAttribute("aria-controls", "menu");
  openBtn.innerHTML = `
    <span class="topbar__label">Menu</span>
    <svg class="menu-ring" viewBox="0 0 577 298" aria-hidden="true">
      <path d="M 468 34 C 442 19 364 -3 252 3 C 108 11 -2 90 1 156 C 4 221 137 254 233 251 C 329 248 528 207 536 142 C 543 47 370 9 284 31"
            fill="none" stroke="currentColor" stroke-width="10"
            stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  const closeBtn = document.createElement("button");
  closeBtn.className = "topbar__btn topbar__close";
  closeBtn.id = "menuClose";
  closeBtn.setAttribute("aria-label", "Close menu");
  closeBtn.textContent = "Close";

  const bar = document.createElement("div");
  bar.className = "topbar";
  bar.append(openBtn, closeBtn);
  document.body.prepend(bar);

  // theme toggle — top-right, above everything including the drawer
  const themeBtn = document.createElement("button");
  themeBtn.className = "topbar__theme";
  themeBtn.id = "themeToggle";
  themeBtn.setAttribute("aria-label", "Cambia tema chiaro/scuro");
  themeBtn.innerHTML = `
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
    </svg>
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5"/>
      <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19"/>
    </svg>`;
  document.body.append(themeBtn);

  // menu ring: misura il tratto e preparalo per l'animazione di
  // disegno all'hover (dashoffset da lunghezza a zero)
  const ringPath = openBtn.querySelector(".menu-ring path");
  if (ringPath && ringPath.getTotalLength) {
    const len = ringPath.getTotalLength();
    ringPath.style.strokeDasharray = String(len);
    ringPath.style.strokeDashoffset = String(len);
  }

  const menu = document.createElement("div");
  menu.className = "drawer";
  menu.id = "menu";
  menu.hidden = true;
  menu.setAttribute("role", "dialog");
  menu.setAttribute("aria-modal", "true");
  menu.setAttribute("aria-label", "Site menu");
  menu.innerHTML = `
    <div class="drawer__scrim"></div>
    <div class="drawer__panel">
      <nav class="drawer__list">
        ${order
          .map(
            (i) => `<a href="${i.href}" class="drawer__link${
              i.id === currentId ? " is-current" : ""
            }">${i.label}</a>`
          )
          .join("\n        ")}
      </nav>
      <ul class="drawer__social">
        ${SOCIALS.map((s) => `<li><a href="${s.href}" rel="noopener">${s.label}</a></li>`).join("")}
      </ul>
    </div>`;
  document.body.append(menu);

  return { menu, openBtn, closeBtn, current };
}

/* ------------------------------------------------------------
   dock
   ------------------------------------------------------------ */

export function mountDock(currentId) {
  const host = document.getElementById("dock");
  if (!host) return null;

  host.className = "dock";
  host.setAttribute("role", "navigation");
  host.setAttribute("aria-label", "Sections");

  const items = VISIBLE.map((i) => `
    ${i.separator ? '<span class="dock__sep" role="separator"></span>' : ""}
    <a class="dock__item${i.id === currentId ? " is-current" : ""}"
       href="${i.href}" data-id="${i.id}" data-label="${i.label}">
      <span class="dock__icon">${iconMarkup(i)}</span>
      <span class="dock__tip" aria-hidden="true">${i.label}</span>
    </a>`).join("");

  host.innerHTML = `<div class="dock__inner">${items}</div>`;

  // If an icon file is missing, fall back to the bundled SVG rather
  // than showing a broken image. One swap, then stop listening.
  host.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        if (img.dataset.fallback) {
          img.src = img.dataset.fallback;
          img.removeAttribute("data-fallback");
        }
      },
      { once: true }
    );
  });

  return host;
}