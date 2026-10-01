# Icone della dock

## Le quattro che devi aggiungere

Metti questi file in questa cartella, con **esattamente** questi nomi:

| file | icona | sezione |
|---|---|---|
| `finder.png` | Finder | Chi Sono |
| `photos.png` | Photos | Gallery |
| `notes.png` | Notes | Journal |
| `mail.png` | Mail | Contatti |

La dock li cerca a quei percorsi. Finché i file non ci sono mostra
automaticamente l'SVG di riserva corrispondente (`about.svg`,
`gallery.svg`, `journal.svg`, `contact.svg`), quindi **non vedrai immagini
rotte** — solo icone diverse da quelle definitive.

Per cambiare i nomi, edita `icon` in `NAV` dentro `js/nav.js`.

Projects non ha un'icona tua, quindi usa ancora `projects.svg`. Se vuoi
anche quella, basta mettere `projects.png` in questa cartella e cambiare la
riga in `nav.js`:

```js
{ id: "projects", label: "Projects", href: "projects.html",
  icon: "icons/projects.png", fallback: "icons/projects.svg" }
```

## Come vengono mostrate

Il dock non mette un riquadro sotto l'icona: il disegno porta già con sé la
forma squircle, quindi aggiunge solo un'ombra leggera
(`box-shadow: 0 3px 9px -2px rgba(0,0,0,.3)`).

Le icone macOS hanno fondo pieno e angoli già arrotondati, quindi funzionano
così come sono. Se un'immagine avesse fondo trasparente o bordi vivi, dal
momento che la usi le conviene dargli lei la forma — altrimenti qui
apparirebbe un quadrato dentro lo squircle.

## Le SVG di riserva

Sono disegnate per questo progetto in stile macOS Big Sur: superellisse,
gradiente, riflesso in alto a sinistra, glifo bianco. **Non sono icone di
Apple.** Sono originali e servono solo come fallback.

Ogni file sta su un `viewBox="0 0 100 100"`:

- `path` con `fill="url(#g)"` — lo squircle
- `path` con `fill="url(#s)"` — il riflesso lucido
- i glifi bianchi sottostanti

Cambia le tappe del gradiente `#g` per il colore, sostituisci i glifi con i
tuoi path.

## Nota sui diritti

Le icone macOS sono artwork di Apple. Sei stato tu a fornire i file e hai
detto che l'uso è personale: per un sito personale o offline va bene. Vale
la pena ricordare che quel margine non si estende a un sito monetizzato, né
a un cliente o a un datore di lavoro. Se il sito resta tuo e personale,
-nessun problema.