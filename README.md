# Vincenzo Capasso — sito

Sito personale in **italiano**, vanilla HTML / CSS / JS. Nessuna build,
nessuna dipendenza: la cartella è il sito.

**In produzione:** <https://vincenzocapasso.com> — GitHub Pages, dominio
registrato su Namecheap.

La struttura delle pagine è quella del template di riferimento:

```
Home · Projects · Gallery · Journal · About · Contact
```

La **Gallery è nascosta**: non compare nel pannello né nella dock, e la
pagina ha `noindex`. La cosa è reversibile in un rigo — togli il campo
`hidden: true` dalla voce `gallery` in `js/nav.js`. `gallery.html`, le sue
icone e `js/three.js` restano sul disco, e funzionano ancora se qualcuno
va all'URL diretto.

I contenuti sono tuoi e vivono tutti in **`js/data.js`**.

Lo sfondo è deliberatamente fermo: carta a quadretti e doodle disegnati a
mano, niente che si muove dietro al contenuto. Gli unici movimenti sono la
dock nell'hero e il pannello del menu.

Lo sfondo è una copia del riferimento in `assets/doodle/`: due layer `fixed`
dietro a tutto — griglia `grid.svg` a tile 126px con `opacity .02`, e i sette
doodle PNG a `opacity .03` ancorati a percentuali del viewport. Posizioni,
dimensioni e rotazioni stanno in `js/background.js`. In dark mode i due layer
si invertono: il riferimento è disegnato in nero su carta bianca, quindi
`filter: invert(1)` porta i tratti bianchi senza toccare le opacità. Sotto
760px sopravvive solo il fulmine, come nel riferimento.

## Avvio

Serve sempre via HTTP, mai con `file://`: le pagine usano i moduli ES e il
protocollo file li blocca per CORS.

```sh
ruby -run -e httpd . -p 8080     # poi apri http://localhost:8080
```

**Dopo una modifica ai `.js` fai un hard refresh** (Cmd+Shift+R). Il server di
sviluppo non manda header di cache, quindi il browser può tenere i moduli
vecchi e la pagina sembra non cambiare.

## Dove modificare i contenuti

**Tutto in `js/data.js`.** Le pagine leggono da lì, non dall'HTML.

```js
export const PROFILE   = { name, photo, role, tagline, location };
export const SOCIALS   = [...];   // pannello, footer, pagina Contatti
export const PROJECTS  = [...];   // → Projects + pagina di dettaglio
export const CATEGORIES = [...];  // i filtri della pagina Projects
export const POSTS     = [...];   // → Journal + pagina di dettaglio
export const JOBS, SKILLS, TOOLS, EDUCATION,
       CERTIFICATIONS, SOFT_SKILLS;   // → About
export const GALLERY_CAPTIONS = [...];
```

### Progetti

Ogni voce ha `cats`, e ogni `cat` deve corrispondere a una voce di
`CATEGORIES` — altrimenti il filtro non la trova. Le pagine di dettaglio
leggono `project.html?slug=<slug>`.

`img` è facoltativa: se la metti, l'immagine finisce sulla card e in cima
alla pagina di dettaglio, e il gradiente `art` resta sotto come fallback.
I file stanno in `assets/project/`, i dettagli di formato in
`assets/project/README.md`.

```js
{ slug, title, year, client, role, cats, art: [colore1, colore2],
  img: "assets/project/flightback.jpg",   // facoltativa
  excerpt, body: [...] }
```

Il `body` dei progetti usa gli stessi blocchi degli articoli, più un
tipo in più per i dati:

```js
{ table: { head: ["Metrica", "2025", "2026"],
           rows: [["Impression", "11.504", "19.437"]] } }
```

L'ultima colonna di ogni riga viene accesa automaticamente: è
quella da mettere in evidenza.

### Journal

Le voci dentro sono i **tre articoli scritti su LinkedIn**, con le date
reali di pubblicazione, dal più recente in giù. Aggiungi, modifica o togli
voci liberamente.

`body` è una lista di blocchi, dove ogni voce è:

```js
"testo"              // paragrafo
{ h: "Titolo" }      // sottotitolo
{ ul: ["a", "b"] }   // elenco puntato
{ ol: ["a", "b"] }   // elenco numerato
{ q: "citazione" }   // box con filetto a sinistra
```

Un blocco può portare più chiavi insieme: `{ h: "...", q: "..." }` rende un
sottotitolo seguito dalla sua citazione. Le frasi che su LinkedIn erano in
evidenza sono diventate `q`.

Se un articolo ha un link all'originale, aggiungi `url` alla voce: in fondo
alla pagina compare "Leggi l'articolo originale su LinkedIn".

## Pagine

| File | Sezione |
|---|---|
| `index.html` | Home — hero centrato col titolo che si scrive da solo (nome → ruoli), dock, lavori selezionati, Servizi (vignetta ancorata a destra al passaggio del cursore), Blogs, CTA |
| `projects.html?cat=...` | Projects pre-filtrata dai link Services |
| `projects.html` | Projects — griglia con filtri per disciplina |
| `project.html?slug=…` | Dettaglio progetto |
| `gallery.html` | Gallery — parete 3D trascinabile *(nascosta)* |
| `journal.html` | Journal — indice degli articoli |
| `post.html?slug=…` | Dettaglio articolo |
| `about.html` | Chi Sono — bio, esperienza, competenze, strumenti, formazione |
| `contact.html` | Contatti — form e link |

Cinque icone nella dock, una per sezione. Le quattro che hai fornito sono
già collegate: vedi `icons/README.md` per i nomi dei file. Projects usa per
ora lo SVG generato.

## File

```
website/
├── *.html          una per pagina; ognuna importa js/site.js e chiama boot()
├── css/style.css   stile di base (hero, dock, pannello)
├── css/content.css stile dei componenti (card, timeline, chip, finestra)
├── icons/          icone SVG della dock
├── assets/doodle/  grid.svg + i sette doodle PNG dello sfondo
├── assets/project/ immagini di anteprima dei progetti
├── assets/category/ un disegno per categoria, su sfondo trasparente
├── favicon.svg
└── js/
    ├── data.js     ← TUTTO IL CONTENUTO
    ├── render.js   helper di markup condivisi
    ├── nav.js      dock + pannello, da un'unica lista NAV
    ├── dock.js     la matematica della magnifica
    ├── background.js  i due layer fissi di sfondo
    ├── three.js    solo la parete della Gallery
    └── site.js     glue condiviso (boot())
```

## La dock

Stile macOS, solo nell'hero (`boot({ dock: true })`).

La barra è **molto traslucida e sfocata**: `blur(20px)`,
`rgba(246,246,246,.36)`, raggio 28px, `gap: 1px`, e un'ombra morbida
`0 0 6px` invece di una drop shadow pesante. I valori sono presi dal sito di
riferimento.

Magnifica, tooltip, rimbalzo e separatore sono il *comportamento*
dell'interfaccia macOS: CSS più ~40 righe di matematica in `js/dock.js`,
nessuna libreria. La magnifica replica la curva vera del dock
(`cos(d/RANGE)²`): l'icona sotto il cursore cresce fino a `MAX_SCALE` e le
vicine sfumano. Va in un unico loop rAF che parte solo al movimento del
puntatore e si ferma quando tutto si è assestato.

## Il pannello

`MENU` in alto a sinistra apre un pannello che scorre da sinistra sopra una
velatura translucida, con i link impilati a sinistra nel font display,
`CHIUDI` al posto di `MENU` e i social in basso. `Esc` o un click sulla
velatura chiudono; il focus entra all'apertura e viene restituito alla
chiusura.

Passando il cursore su `MENU` (o col focus da tastiera) un ellisse
scarabocchiato si disegna intorno alla scritta, come nel riferimento
(tratto SVG con `stroke-dashoffset` animato, `currentColor` così funziona
anche in dark mode).

## Il titolo che si scrive da solo

L'hero è l'unica cosa che cambia da sola, e cambia come una macchina
da scrivere: le lettere entrano una alla volta e si cancellano con il
tasto Canc. Il ciclo è in `index.html`, in cima allo script.

```
"Ciao 👋, io sono" → "Vincenzo"          3,5 secondi
← cancella tutta la riga
"Mi occupo di"    → "Advertising"         2 secondi
                  → "Digital Strategy"    2 secondi
                  → "Funnel"              2 secondi
                  → "Automation & AI"     2 secondi
← cancella anche "Mi occupo di" e si torna al saluto
```

Il dettaglio che regge tutto: dopo il primo ruolo si cancella **solo
la parola**, il prefisso resta a schermo. `cancellaParola()` e
`cancellaPrefisso()` sono due funzioni apposta, e il ciclo dice a
ciascuna delle due quando chiamarle.

Ruoli e tempi sono costanti in cima allo script: aggiungere una riga
in `RUOLI` basta, il resto non si tocca. Il primo passo è scritto
nell'HTML — deve esserlo, altrimenti il titolo parte vuoto e la frase
non si legge senza JavaScript — quindi il ciclo comincia dal tempo di
lettura e riparte davvero dal saluto dalla seconda volta.

Il testo che si vede scriversi è una copia `aria-hidden`: la frase per
screen reader sta in `.hero__sr`, fuori dal flusso, e non cambia mai.
Con `prefers-reduced-motion` il ciclo non parte e la frase resta ferma.
In una scheda in secondo piano il ciclo si ferma e riprende quando la
scheda torna in primo piano.

## Dark mode

Il bottone circolare in alto a destra cambia tema e lo salva in
`localStorage`. Senza scelta salvata il default è il **tema scuro**.
Uno script inline in ogni `<head>` imposta il tema prima del paint,
così non c'è flash del tema sbagliato.

Tecnicamente è un blocco `[data-theme="dark"]` in fondo a
`css/style.css` che ridefinisce le variabili (`--paper`, `--ink`,
`--muted`, `--line`) e le superfici scritte con colori fissi. Lo sfondo
non usa variabili: griglia e doodle si invertono, così le opacità restano
quelle del riferimento. Le icone AVIF e le texture della Gallery restano
invariate.

## Librerie

**GSAP** — solo per gli scroll reveal, lo slide del pannello e la finestra
showreel. Togli le due `<script>` e `js/site.js` ricade su transizioni CSS
e `scrollIntoView`.

**Three.js** — caricata **solo** da `gallery.html`, e solo quando la pagina
ci arriva. Nessun'altra pagina la tocca.

## Font

- **Telegraf** (file locali in `fonts/`, Regular + UltraBold) — titoli e menu in UltraBold, testo normale in Regular
- **Geist** (Google Fonts, fallback) — usato solo se Telegraf non si carica

Niente uppercase forzato: i titoli si scrivono in maiuscolo/minuscolo naturale
(`text-transform:none` globale).

Tutte le icone sono SVG originali; griglia e doodle di sfondo vengono dal
template di riferimento. GSAP è MIT.

## Accessibilità

- Il pannello è un `role="dialog"` etichettato, usabile da tastiera, con
  focus gestito all'apertura e restituito alla chiusura
- La dock è un `<nav>` di link veri; la magnifica è decorativa
- `prefers-reduced-motion` disattiva magnifica, slide e reveal
- Focus visibile via `:focus-visible`; i tooltip della dock compaiono anche al
  focus da tastiera
- I filtri usano `aria-pressed`; la parete 3D è decorativa e ogni didascalia
  è anche in HTML sotto