/* ============================================================
   Sfondo carta a quadretti + doodle.

   Copia del template di riferimento: due layer `position:fixed`
   dietro a tutto il resto, e nient'altro che si muove.

   - griglia: `assets/doodle/grid.svg`, tile 126px, `opacity .02`
   - doodle:  sette PNG a `opacity .03`, posizionati in percentuale
     del viewport (--x / --y), con le dimensioni e le rotazioni
     del riferimento

   In dark mode i due layer vengono invertiti: il riferimento è
   disegnato in nero su carta bianca, quindi `invert(1)` porta i
   tratti bianchi senza toccare le opacità.
   ============================================================ */

/* Percorso ASSOLUTO: le pagine stanno anche dentro /blog/<slug>/ e
   /progetti/<slug>/, dove "assets/doodle/" cercherebbe il file nella
   sottocartella e restituirebbe 404. */
const DOODLE_ASSETS = "/assets/doodle/";

/* Le stesse sette immagini, nelle stesse posizioni del riferimento. */
const DOODLES = [
  { src: "cloud.png", x: "3.806%", y: "3.617%", w: "165px", h: "166px" },
  { src: "lightning.png", x: "66.138%", y: "4.823%", w: "103px", h: "102px", r: "30deg" },
  { src: "leaf.png", x: "22.998%", y: "23.437%", w: "90px", h: "89px", tx: "-50%" },
  { src: "swirl.png", x: "50%", y: "50%", w: "192px", h: "193px", tx: "-50%", ty: "-50%" },
  { src: "paper.png", x: "78.271%", y: "40%", w: "198px", h: "198px", ty: "-50%" },
  { src: "sparkle-left.png", x: "3.806%", y: "86%", w: "165px", h: "164px", ty: "-50%" },
  { src: "sparkle-right.png", x: "66.535%", y: "81.613%", w: "137px", h: "137px", r: "30deg" },
];

/**
 * Monta i due layer fissi in cima al <body>, una volta sola.
 * Chiamato da `boot()`, quindi presente su ogni pagina.
 */
export function mountBackground() {
  if (document.querySelector(".bg")) return;

  const layer = document.createElement("div");
  layer.className = "bg";
  layer.setAttribute("aria-hidden", "true");

  layer.innerHTML =
    `<div class="bg__grid"></div>` +
    `<div class="bg__doodles">` +
    DOODLES.map((d) => {
      const vars = [`--x:${d.x}`, `--y:${d.y}`, `--w:${d.w}`, `--h:${d.h}`];
      if (d.r) vars.push(`--r:${d.r}`);
      if (d.tx) vars.push(`--tx:${d.tx}`);
      if (d.ty) vars.push(`--ty:${d.ty}`);
      return `<img class="bg__doodle" src="${DOODLE_ASSETS}${d.src}" alt="" style="${vars.join(";")}">`;
    }).join("") +
    `</div>`;

  document.body.prepend(layer);
}
