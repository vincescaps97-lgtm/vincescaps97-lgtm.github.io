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

## Palette

Le tre copertine sono disegnate con tre colori e nient'altro: nero
puro `#000000`, il verde acqua del sito `#3CCAB1` e bianco `#FFFFFF`.
Il verde si può schiarire e scurire restando nella sua famiglia
(stessa tinta, diversa luminosità): `#2AA18F`, `#1C7A6D`, `#5FD8C4`,
`#A8E9DC`.

**Niente gradienti.** Le tre versioni precedenti avevano un fondo in
gradiente e una sfumatura propria per disciplina; ora il fondo è
nero puro in tutte e tre e la differenza la fa il disegno, non la
tinta. Il vantaggio è che i tre colori sono davvero tre: le card non
possono più stonare con il resto della pagina.

Il nero e il bianco compaiono **sempre dentro una massa verde**, non
come trattiisolati: fuori dal verde il nero sparisce sul tema scuro e
il bianco sulla card bianca.

Il soggetto sta dentro `x 120–1080`, `y 130–770`: è la parte che
resta anche quando la pagina di dettaglio ritaglia in 16:9. La lente
di `concessionaria.svg` sta per questo sopra la velatura che l'anno
disegna a hover, e le ruote dell'auto non arrivano in fondo.

I `PALETTE` in `js/data.js` restano: ora copre la macchia, cioè il
caso in cui il file non c'è. Se in futuro un progetto ha una
copertina trasparente, il gradiente sotto torna visibile — e in quel
caso il verde del disegno va scelto scuro.
