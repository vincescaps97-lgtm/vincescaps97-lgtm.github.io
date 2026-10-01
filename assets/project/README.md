# Immagini dei progetti

Qui ci finiscono le immagini di anteprima dei progetti, una per file.
Non serve rinominare nulla: ogni progetto in `js/data.js` dichiara
quale immagine è la sua con il campo `img`.

## Come si usa

In `js/data.js`, dentro l'oggetto del progetto:

```js
{
  slug: "flightback",
  title: "FlightBack",
  art: ["#be123c", "#fb7185"],   // gradiente di fallback
  img: "assets/project/flightback.jpg",
  ...
}
```

`img` è facoltativo. Se non c'è, la card mostra il gradiente come
prima; se c'è ma il file non si trova, il gradiente copre il buco.
Nessuna delle due cose richiede attenzione.

L'immagine finisce sia nella card della griglia sia nell'immagine
grande in cima alla pagina di dettaglio.

## Formato

- **4:3** è il formato della card, e la pagina di dettaglio la
  ritaglia in 16:9. Scegli la versione 16:9 per il dettaglio, o
  una 4:3 se il soggetto sta al centro.
- **SVG** va benissimo per illustrazioni e schemi: resta nitido a
  qualsiasi dimensione e pesa pochi KB. `mockads.svg` è un esempio
  (1200×900, disegnata inquadrando i tre formati al centro, così
  il ritaglio 16:9 non taglia niente di importante).
- **JPEG o WebP.** Per una griglia, 1200 px di lato bastano: la
  card ne mostra circa 400, il dettaglio non va oltre 1400.
- **Circa 150–250 KB per immagine.** Se il file è molto più grande,
  il sito resta veloce lo stesso, ma conviene ridurlo: le card
  vengono caricate tutte insieme in home.
- Niente testo dentro l'immagine: l'anno è già sovrapposto dalla
  card, e sopra ci passa una velatura scura.
