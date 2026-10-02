/* ============================================================
   Helper di rendering. Ogni pagina importa da qui invece di
   ripetere gli stessi template.

   (Shared markup builders — pages import these instead of
   duplicating the same template strings.)
   ============================================================ */

import { readDate, readDateShort } from "./data.js";

// Le virgolette singole si sfuggono perché finiscono dentro
// `url('…')` negli stili inline, dove le doppie chiuderebbero
// l'attributo HTML.
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );

/* ---------- PROJECTS ---------- */

/**
 * Classe di lunghezza per i titoli, 1 (corto) / 2 (medio) / 3 (lungo).
 *
 * Le soglie sono calcolate sull'advance reale del Black
 * (~0.576em per carattere, misurato sul campione) e sulla larghezza
 * della colonna, così il CSS può scegliere un corpo che faccia stare
 * il titolo nel numero di righe giusto invece di lasciarlo andare
 * su tre.
 *
 * @param {string} text
 * @returns {1|2|3}
 */
export function titleLen(text) {
  const n = String(text).replace(/\s+/g, " ").trim().length;
  if (n <= 26) return 1;
  if (n <= 56) return 2;
  return 3;
}

/**
 * Sfondo della media di un progetto.
 *
 * Se il progetto ha `img`, l'immagine sta SOPRA il gradiente:
 * `background-image: url(...), linear-gradient(...)`. Così il
 * gradiente fa da fallback — se il file manca o non si carica,
 * si vede il colore al posto del buco.
 *
 * @param {{img?:string, art:string[]}} p
 */
export function projectBg(p) {
  const grad = `linear-gradient(145deg,${p.art[0]},${p.art[1]})`;
  // apici singoli, non doppi: questa stringa finisce dentro
  // `style="…"`, e una doppia la chiuderebbe.
  return p.img ? `url('${esc(p.img)}'),${grad}` : grad;
}

export function projectCard(p) {
  return `
    <a class="pcard reveal" href="/progetti/${p.slug}/">
      <div class="pcard__media" data-year="${esc(p.year)}"
           style="background-image:${projectBg(p)}"></div>
      <div class="pcard__body">
        <h3 class="pcard__title" data-len="${titleLen(p.title)}">${esc(p.title)}</h3>
        <p class="pcard__excerpt">${esc(p.excerpt)}</p>
        <div class="pcard__cats">${p.cats.map((c) => `<span class="tag">${esc(c)}</span>`).join("")}</div>
        <span class="pcard__cta">Apri progetto</span>
      </div>
    </a>`;
}

/* ---------- JOURNAL ---------- */

export function postRow(p) {
  return `
    <li class="post reveal">
      <div>
        <time datetime="${p.date}">${readDate(p.date)}</time>
        <h3 data-len="${titleLen(p.title)}"><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3>
        <p>${esc(p.excerpt)}</p>
      </div>
      <a class="post__thumb" href="/blog/${p.slug}/"
         style="background-image:linear-gradient(145deg,${p.art[0]},${p.art[1]})"
         aria-label="${esc(p.title)}"></a>
    </li>`;
}

/* Tabella dentro un corpo di articolo o di progetto.

   `head` è la riga di intestazione, `rows` la lista di righe.
   L'ultima colonna di ogni riga è quella che il foglio mette in
   evidenza, quindi va accesa a mano nel CSS. */
function projectTable({ head = [], rows = [] } = {}) {
  return `
    <div class="tablewrap">
      <table class="article__table">
        ${head.length ? `<thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>` : ""}
        <tbody>
          ${rows
            .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`)
            .join("")}
        </tbody>
      </table>
    </div>`;
}

/* Corpo di un articolo.

   `body` è una lista di blocchi: stringa = paragrafo, `{h}` =
   sottotitolo, `{ul}` / `{ol}` = elenchi, `{q}` = box a
   sinistra. vedi POSTS in data.js. */
export function postBody(blocks = []) {
  // un blocco può portare più chiavi insieme (`{h, q}` = un
  // sottotitolo seguito dalla sua citazione): si rendono in ordine.
  return blocks
    .map((b) => {
      if (typeof b === "string") return `<p>${esc(b)}</p>`;
      return [
        b.h && `<h2 class="article__h">${esc(b.h)}</h2>`,
        b.q && `<blockquote class="article__q">${esc(b.q)}</blockquote>`,
        b.ul && `<ul class="article__list">${b.ul.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`,
        b.ol && `<ol class="article__list">${b.ol.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`,
        b.table && projectTable(b.table),
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");
}

/* Corpo di un progetto: stessi blocchi degli articoli, ma con la
   tabella in più per i dati. */
export function projectBody(blocks = []) {
  return blocks
    .map((b) => {
      if (typeof b === "string") return `<p>${esc(b)}</p>`;
      return [
        b.h && `<h2 class="article__h">${esc(b.h)}</h2>`,
        b.q && `<blockquote class="article__q">${esc(b.q)}</blockquote>`,
        b.ul && `<ul class="article__list">${b.ul.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`,
        b.ol && `<ol class="article__list">${b.ol.map((i) => `<li>${esc(i)}</li>`).join("")}</ol>`,
        b.table && projectTable(b.table),
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");
}

/* ---------- MARQUEE ---------- */

/**
 * Trasforma un contenitore pieno di card in una striscia che
 * scorre in orizzontale all'infinito.
 *
 * Come funziona: le card già presenti vengono raggruppate in un
 * "set" (un wrapper), il set viene misurato e ripetuto quante
 * volte serve a coprire il viewport più un set. Poi l'animazione
 * sposta il tracciato di esattamente un set: il ciclo si richiude
 * senza salti e senza buchi, anche se i progetti sono tre.
 *
 * Le copie oltre la prima sono `aria-hidden` e fuori dal tab
 * order: altrimenti ogni progetto sarebbe leggibile e raggiungibile
 * più volte.
 *
 * @param {HTMLElement} root  il contenitore con le card dentro
 */
export function marqueeScroll(root) {
  if (!root || root.dataset.marquee) return;
  root.dataset.marquee = "1";

  const cards = Array.from(root.children);
  if (!cards.length) return;

  const set = document.createElement("div");
  set.className = "marquee__set";
  cards.forEach((c) => set.append(c));

  const track = document.createElement("div");
  track.className = "marquee__track";

  const fill = () => {
    // il set va messo nel documento PRIMA di misurarlo: un
    // elemento staccato ha larghezza zero e il ciclo non parte
    track.replaceChildren(set);
    // il `padding-right` dentro il set serve a contare anche
    // l'ultimo gap: senza, lo scatto sarebbe corto di qualche px
    const setW = Math.round(set.getBoundingClientRect().width);
    if (!setW) return;

    const need = window.innerWidth + setW;
    const copies = Math.max(2, Math.ceil(need / setW));

    track.replaceChildren();
    for (let i = 0; i < copies; i++) {
      const clone = set.cloneNode(true);
      // la prima copia resta per accessibilità e tastiera
      if (i > 0) {
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a, button").forEach((el) => el.setAttribute("tabindex", "-1"));
      }
      track.append(clone);
    }

    track.style.setProperty("--marquee-step", setW + "px");
    // velocità costante: il tempo scala con la lunghezza del set,
    // altrimenti con molte card il moto sembrerebbe più lento
    track.style.setProperty("--marquee-dur", Math.round(setW / 70) + "s");
  };

  root.replaceChildren(track);
  fill();

  let t;
  addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(fill, 180);
  });
}

/* ---------- BLOG (riga tabellare della home) ---------- */

export function blogRow(p) {
  return `
    <a class="brow reveal" href="/blog/${p.slug}/">
      <span class="brow__thumb" aria-hidden="true"
            style="background-image:linear-gradient(145deg,${p.art[0]},${p.art[1]})"></span>
      <span class="brow__title" data-len="${titleLen(p.title)}">${esc(p.title)}</span>
      <span class="brow__cat">${esc(p.topic || "")}</span>
      <time class="brow__date" datetime="${p.date}">${readDateShort(p.date)}</time>
    </a>`;
}

/* ---------- ABOUT ---------- */

export function job(j) {
  return `
    <article class="tl__item reveal${j.current ? " is-current" : ""}">
      <span class="tl__dot" aria-hidden="true"></span>
      <div class="tl__body">
        <h3 class="tl__role">${esc(j.role)}</h3>
        <p class="tl__company">${esc(j.company)}${j.companyNote ? " — " + esc(j.companyNote) : ""}</p>
        <p class="tl__meta">
          <span class="tl__when">${esc(j.from)} — ${esc(j.to)}</span>
          ${j.current ? '<span class="tl__now">In corso</span>' : ""}
          <span class="tl__sep">·</span><span>${esc(j.place)}</span>
        </p>
        <ul class="tl__points">${j.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        ${j.highlight ? `<p class="tl__highlight">${esc(j.highlight)}</p>` : ""}
      </div>
    </article>`;
}

export function edu(e) {
  return `
    <article class="tl__item reveal">
      <span class="tl__dot" aria-hidden="true"></span>
      <div class="tl__body">
        <h3 class="tl__role">${esc(e.field)}</h3>
        <p class="tl__company">${
          e.href
            ? `<a href="${e.href}" target="_blank" rel="noopener">${esc(e.place)}</a>`
            : esc(e.place)
        }</p>
        <p class="tl__meta">
          <span class="tl__kind">${esc(e.kind)}</span>
          <span class="tl__sep">·</span>
          <span class="tl__when">${esc(e.from)}${e.to ? " — " + esc(e.to) : ""}</span>
        </p>
      </div>
    </article>`;
}

export function groupCard(g) {
  return `
    <div class="group reveal" style="--c:${g.color}">
      <h3>${esc(g.name)}</h3>
      <ul>${g.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`;
}

export function toolGroups(tools) {
  const byGroup = tools.reduce((acc, t) => {
    (acc[t.group] ||= []).push(t);
    return acc;
  }, {});

  return Object.entries(byGroup)
    .map(
      ([name, list]) => `
      <div class="toolgroup reveal">
        <h3 class="toolgroup__name" style="--c:${list[0].color}">${esc(name)}</h3>
        <div class="tools">
          ${list
            .map(
              (t) => `<span class="tool" style="--c:${t.color}">
                <span class="tool__mark" aria-hidden="true"></span>${esc(t.name)}
              </span>`
            )
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

export function badges(list) {
  return list.map((b) => `<span class="badge">${esc(b)}</span>`).join("");
}

export function socialLinks(list) {
  return list
    .map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${esc(s.label)}</a>`)
    .join(" · ");
}

