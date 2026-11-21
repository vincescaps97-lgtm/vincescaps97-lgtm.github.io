/* ============================================================
   Notifica di benvenuto, stile macOS.

   Compare in alto a destra dopo 10 secondi: icona tonda con la
   foto di `PROFILE.photo`, nome dell'app, "ora", mittente e un
   messaggio che invita a fare un giro. Nessun bottone: si chiude
   con la × o con Esc e non torna più per il resto della sessione.

   Non compare su Contatti: lì l'invito non avrebbe senso.

   Montata da `boot()` in js/site.js, quindi vale su ogni pagina
   senza toccare gli HTML.
   ============================================================ */

import { PROFILE } from "./data.js";

const DELAY = 10000; // ms prima che compaia
/* localStorage, non sessionStorage: chi chiude il messaggio non lo
   rivede più, nemmeno in una scheda nuova o dopo un riavvio.
   La versione nella chiave serve a farlo ricomparire quando cambia
   il testo: basta passare a `-v2`. */
const KEY = "greet-dismissed-v1";
const OUT = 560; // durata dell'uscita, uguale alla transizione CSS

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function mountGreeting({ page = "" } = {}) {
  if (page === "contact") return;

  // già chiusa in questa sessione: niente da fare
  try {
    if (localStorage.getItem(KEY)) return;
  } catch (e) {
    /* storage bloccato: si mostra comunque */
  }

  const el = document.createElement("aside");
  el.className = "greet";
  el.hidden = true;
  el.setAttribute("aria-label", "Messaggio di benvenuto");
  el.innerHTML = `
    <button class="greet__close" type="button" aria-label="Chiudi il messaggio">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" fill="none"
              stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      </svg>
    </button>
    <img class="greet__icon" src="${PROFILE.photo}" alt="" width="38" height="38"
         loading="lazy" decoding="async">
    <div class="greet__content">
      <div class="greet__meta">
        <span class="greet__app">Messaggi</span>
        <span class="greet__time">ora</span>
      </div>
      <p class="greet__title">${PROFILE.name}</p>
      <p class="greet__text">Ciao 👋 Fatti un giro: progetti, blog, chi sono. Se ti va, scrivimi.</p>
    </div>
  `;
  document.body.appendChild(el);

  const closeBtn = el.querySelector(".greet__close");

  let shown = false;
  let timer = null;

  function show() {
    if (shown) return;
    shown = true;
    el.hidden = false;
    // un frame di ritardo: senza, il browser applica lo stato
    // finale subito e la transizione non parte
    requestAnimationFrame(() => el.classList.add("is-in"));
  }

  function hide() {
    el.classList.remove("is-in");
    try {
      localStorage.setItem(KEY, "1");
    } catch (e) {}
    if (el.contains(document.activeElement)) document.activeElement.blur();
    setTimeout(() => {
      el.hidden = true;
    }, reduced ? 0 : OUT);
  }

  closeBtn.addEventListener("click", hide);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !el.hidden) hide();
  });

  /* Il timer non corre a scheda nascosta: se i 10 secondi
     scadono mentre l'utente è su un'altra scheda, la notifica
     compare quando torna, non prima. */
  timer = setTimeout(() => {
    if (document.hidden) {
      document.addEventListener(
        "visibilitychange",
        () => {
          if (!document.hidden) show();
        },
        { once: true }
      );
    } else {
      show();
    }
  }, DELAY);

  return { show, hide, el };
}
