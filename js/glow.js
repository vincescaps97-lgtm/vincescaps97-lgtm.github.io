/* ============================================================
   SFUMATURA CHE SEGUE IL CURSORE

   La sfumatura verde acqua delle slide, portata sul sito: un alone
   morbido che vive dietro ai contenuti e si sposta con il puntatore.

   Sono due aloni, non uno:
   - `wide`  grande, insegue lento: dà profondità, si muove come se
             avesse massa;
   - `core`  piccolo e più chiaro, arriva prima: è il "fuoco" sotto
             il dito e fa percepire il puntatore come una fonte di
             luce, non come un puntatore che trascina un riquadro.

   Perché due velocità diverse: con un alone solo il movimento si
   legge come un oggetto appiccicato al mouse. Con due che inseguono
   a velocità diverse si legge come luce che si adatta — è la stessa
   differenza che c'è fra un riflettore mosso a mano e uno che
   insegue.

   Regole:
   - solo con puntatore preciso e hover (`(hover:hover)` +
     `(pointer:fine)`): su touch non esiste un "dove" prima del
     tocco, e il movimento è scroll;
   - niente con `prefers-reduced-motion`: è decorazione pura, non
     deve muoversi per chi ha chiesto che nulla si muova;
   - `aria-hidden` e `pointer-events:none`: non esiste per screen
     reader e non intercetta click;
   - un solo elemento con `transform` in `translate3d` e un blur
     contenuto: gli aloni sono piccoli, il costo è una composizione
     GPU per frame, non un ricalcolo del layout.
   ============================================================ */

const FINE = matchMedia("(hover: hover) and (pointer: fine)");
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)");

export function mountGlow() {
  if (document.querySelector(".glow")) return;

  const layer = document.createElement("div");
  layer.className = "glow";
  layer.setAttribute("aria-hidden", "true");
  document.body.append(layer);

  /* L'alone d'ambiente in alto a destra è fermo, quindi resta anche
     su touch e con "riduci il movimento": è colore, non animazione.
     Quello che si spegne è il movimento — gli aloni che inseguono il
     cursore non vengono nemmeno creati: nel DOM resta solo il layer
     con il suo `::before`. */
  if (!FINE.matches || REDUCED.matches) return;

  layer.innerHTML =
    `<span class="glow__orb glow__orb--wide"></span>` +
    `<span class="glow__orb glow__orb--core"></span>`;

  const wide = layer.querySelector(".glow__orb--wide");
  const core = layer.querySelector(".glow__orb--core");

  /* Posizione del puntatore e posizione addolcita dei due aloni.
     Partono dal centro dell'area utile, ma il primo `pointermove`
     li porta subito sotto il cursore: nessun alone che attraversa
     lo schermo all'ingresso. */
  let px = innerWidth / 2;
  let py = innerHeight * 0.45;
  let wx = px, wy = py;
  let cx = px, cy = py;

  let raf = 0;
  let idle = 0;
  let started = false;

  /* Il "core" si stringe di un soffio alla pressione del tasto:
     il click si sente anche nella luce, non solo nel bottone. */
  let press = 1;
  let scale = 1;

  const disegna = () => {
    wx += (px - wx) * 0.08;
    wy += (py - wy) * 0.08;
    cx += (px - cx) * 0.19;
    cy += (py - cy) * 0.19;
    scale += (press - scale) * 0.2;

    wide.style.transform =
      `translate3d(${wx}px, ${wy}px, 0) translate(-50%, -50%)`;
    core.style.transform =
      `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${scale})`;

    /* Ci si ferma quando la distanza è sotto la soglia del pixel
       visibile: un ciclo che gira a vuoto per sempre scalda la
       batteria per niente. Riparte al prossimo movimento. */
    const fermo =
      Math.abs(px - wx) < 0.35 && Math.abs(py - wy) < 0.35 &&
      Math.abs(px - cx) < 0.35 && Math.abs(py - cy) < 0.35 &&
      Math.abs(press - scale) < 0.002;

    raf = fermo ? 0 : requestAnimationFrame(disegna);
  };

  /* L'alone si accende al primo movimento e si spegne da solo dopo
     un paio di secondi di quiete: una pagina ferma che continua a
     brillare sotto un cursore fermo diventa rumore. */
  const sveglia = () => {
    layer.classList.add("is-live");
    clearTimeout(idle);
    idle = setTimeout(() => layer.classList.remove("is-live"), 2600);
  };

  /* ---------- dentro le card ---------- */

  /* Stesso principio, scala più piccola: la card sotto il cursore
     prende una macchia di luce che segue il puntatore. È un
     `radial-gradient` sul fondo della card, non un elemento in più:
     niente DOM, niente z-index da sistemare, e resta sotto al testo
     perché è il `background` della card stessa. */
  let lit = null;
  let rect = null;

  const misura = () => {
    if (lit) rect = lit.getBoundingClientRect();
  };

  const puntaLuce = (e) => {
    const card = e.target instanceof Element ? e.target.closest(".pcard") : null;

    if (card !== lit) {
      if (lit) {
        /* riporta il centro del gradiente fuori schermo: la luce
           non deve restare accesa dove il cursore è passato */
        lit.style.removeProperty("--mx");
        lit.style.removeProperty("--my");
      }
      lit = card;
      rect = lit ? lit.getBoundingClientRect() : null;
    }

    if (!lit || !rect) return;
    lit.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    lit.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  addEventListener("pointermove", (e) => {
    /* su touch il movimento è uno scroll, non un puntamento */
    if (e.pointerType === "touch") return;

    px = e.clientX;
    py = e.clientY;

    if (!started) {
      started = true;
      wx = cx = px;
      wy = cy = py;
    }

    sveglia();
    puntaLuce(e);
    if (!raf) raf = requestAnimationFrame(disegna);
  }, { passive: true });

  addEventListener("pointerdown", (e) => {
    if (e.pointerType === "touch") return;
    press = 1.22;
    if (!raf) raf = requestAnimationFrame(disegna);
  }, { passive: true });

  const rilascia = () => {
    press = 1;
    if (!raf) raf = requestAnimationFrame(disegna);
  };
  addEventListener("pointerup", rilascia, { passive: true });
  addEventListener("pointercancel", rilascia, { passive: true });
  addEventListener("blur", rilascia, { passive: true });

  /* La card si sposta con lo scroll sotto un cursore fermo: la
     misura va rifatta, altrimenti la luce resta indietro. */
  addEventListener("scroll", misura, { passive: true });
  addEventListener("resize", misura, { passive: true });
}
