# Icone di categoria

Un disegno per ciascuna categoria di `CATEGORIES` in `js/data.js`, nello
stile delle copertine dei progetti: forme semplici, due tonalità,
niente testo dentro. Restano mockup piatti, non icone a tratti.

| File | Categoria in `data.js` |
|---|---|
| `advertising-paid-media.svg` | Advertising & Paid Media |
| `marketing-automation-ai.svg` | Marketing Automation & AI |
| `analytics-tracking.svg` | Analytics & Tracking |
| `web-design.svg` | Web & Design |

## Formato

- **1200×900 (4:3)**, come `mockads.svg` e le altre copertine. Il
  soggetto sta dentro `x 120–1080`, `y 130–770`: è la parte che resta
  anche quando la pagina di dettaglio ritaglia in 16:9.
- **Sfondo trasparente**, come richiesto. Sotto non c'è nessun
  `<rect>` a pieno: il file si appoggia a qualunque fondo.
- **Niente testo** dentro, per la regola di `assets/project/README.md`.
- SVG puro: nessun gradiente, nessun filtro, nessun `<defs>`.

## Palette

Tre colori e nient'altro. Il verde è l'unico che si può alleggerire o
scureggiare, e solo restando nella sua famiglia — stessa tinta, cioè
stesso colore con diversa luminosità:

| | hex | uso |
|---|---|---|
| nero | `#000000` | fori e ombre dentro le masse verdi |
| verde pieno | `#3CCAB1` | il colore del sito: masse e tratti |
| bianco | `#FFFFFF` | dettagli dentro le masse verdi |
| verde scuro | `#1C7A6D` | la massa "pesante" del file |
| verde medio | `#2AA18F` | passaggi intermedi |
| verde chiaro | `#5FD8C4` | dettagli e fondali |
| verde tenuissimo | `#A8E9DC` | i piani più lontani |

Tutte le tonalità hanno la stessa tinta del verde pieno (169° ± 2°):
cambia la luminosità, non il colore. Fuori da qui non si esce.

## La regola che rende i file leggibili ovunque

**Nero e bianco compaiono solo dentro una massa verde.** Fuori dal
verde, il nero sparisce sul tema scuro del sito e il bianco sparisce
sulla card bianca. Il verde invece si vede su entrambi i fondi, e per
questo le linee sottili e i tratti sono tutti verdi.

Per questo ogni file ha una forma piena al centro e i dettagli ci
stanno dentro.

## Dove vanno bene e dove no

- **Bene** su fondo scuro (hero, sezioni) e su fondo bianco (card,
  pagine interne).
- **Male** sul gradiente verde delle card di progetto: verde su verde
  non si stacca. Se serve una copertina di categoria dentro la griglia,
  o si mette sopra una velatura scura, o si tiene la copertina
  dedicata del progetto.

## Come usarle

Come copertina di un progetto che non ha un'immagine sua:

```js
{
  slug: "nuovo-progetto",
  cats: ["Analytics & Tracking"],
  art: ["#047857", "#6ee7b7"],
  img: "/assets/category/analytics-tracking.svg",
}
```

`projectBg()` mette l'immagine **sopra** il gradiente di fallback, con
la grandezza della cover: se il file manca si vede il gradiente, non un
buco. Nient'altro da toccare.