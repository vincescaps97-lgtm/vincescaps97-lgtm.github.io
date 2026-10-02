/* ============================================================
   TUTTO IL CONTENUTO DEL SITO STA QUI.
   Modifica questo file per aggiornare il sito: le pagine
   leggono da qui, non dall'HTML.

   La struttura delle pagine è quella del template di
   riferimento: Home · Projects · Gallery · Journal · About ·
   Contact. Qui sotto trovi i contenuti che le alimentano.
   ============================================================ */

export const PROFILE = {
  name: "Vincenzo Capasso",
  initials: "VC",
  photo: "/assets/vincenzo.jpg",
  email: "vincenzo.capasso1297@gmail.com",
  role: "Performance & Marketing automation",
  roleLine: "Performance & Marketing automation | Paid Media, Tracking & AI",
  tagline: "👋 Ciao, sono Vincenzo.",
  location: "Remote worker 👨🏻‍💻 but human ❤️",
};

export const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/v-capasso" },
  { label: "Learnn", href: "https://learnn.com/profile/vincenzo-capasso/" },
  { label: "MockAds", href: "https://mockads.net" },
];

/* ============================================================
   PROJECTS — la stessa struttura del template: griglia con
   filtri per disciplina, poi una pagina di dettaglio per voce.
   Ogni `cat` deve corrispondere a una voce di CATEGORIES.
   ============================================================ */

export const CATEGORIES = [
  "Advertising & Paid Media",
  "Marketing Automation & AI",
  "Analytics & Tracking",
  "Web & Design",
];

/* ============================================================
   PALETTE DEI PROGETTI

   Il sito ha un solo colore d'accento, il verde acqua di
   `--blue` (#3dcab1). I gradienti dei progetti restano dentro
   quella famiglia: verde, verde-acqua e ciano, con un gradino
   di luminosità e saturazione di differenza per disciplina.

   Il risultato è che le card si distinguono a occhio senza che
   nessuno stoni con il resto della pagina. Fuori da qui i
   colori non entrano: un progetto con `art` fuori palette si
   vede subito.

   Ogni valore è una coppia [da, a] per il gradiente a 145°.

   Attenzione: la variazione va tenuta larga abbastanza da
   distinguersi nella miniatura da 24px della tabella Blog. Con
   coppie troppo vicine le tre righe sembravano la stessa
   immagine.
   ============================================================ */

export const PALETTE = {
  "Advertising & Paid Media": ["#0d9488", "#5eead4"],
  "Marketing Automation & AI": ["#0e7490", "#67e8f9"],
  "Analytics & Tracking": ["#047857", "#6ee7b7"],
  "Web & Design": ["#155e75", "#a5f3fc"],
};

export const PROJECTS = [
  {
    slug: "caso-studio-meta-ads-centri-estetici",
    title: "Meta Ads per centri estetici: caso studio, CPL -57%",
    year: "2026",
    client: "Azienda beauty (cliente anonimo)",
    role: "Paid media, framework creativo, lead generation",
    cats: ["Advertising & Paid Media", "Analytics & Tracking"],
    art: ["#0d9488", "#5eead4"],
    img: "/assets/project/centri-estetici.svg",
    excerpt:
      "Un'azienda beauty che vende un macchinario ai centri estetici ha ridotto il CPL del 57% in meno di 30 giorni su Meta Ads, con un metodo di test modulare.",
    body: [
      "Un'azienda del settore beauty vende un macchinario professionale ai centri estetici. Per oltre 18 mesi ha fatto lead generation su Meta Ads con costi per lead troppo alti e performance altalenanti. Questo caso racconta il metodo con cui il CPL medio è sceso del 57% in meno di 30 giorni, con meno creatività in test e non con più.",
      { q: "Il cliente è anonimo. Per riservatezza riporto la variazione percentuale e non i valori assoluti." },

      { h: "Il punto di partenza" },
      "L'azienda vende a titolari di centri estetici, un target di nicchia. Ogni mese partivano nuovi test: creatività diverse, formati nuovi, offerte e copy variati. Il CPL restava alto e l'andamento irregolare.",
      "Mancava un criterio per decidere cosa testare, quando e perché. Senza quel criterio, anche un annuncio che andava meglio non indicava cosa replicare nel ciclo successivo. Si produceva molto e si imparava poco.",

      { h: "Il metodo" },
      "L'impostazione l'ho ripresa da un webinar di Francesco Maria Errico su Learnn, adattandola al caso. Si articola in tre passaggi.",
      {
        ol: [
          "Pre-analisi di ciò che già funziona. Ho guardato i best performer per leva — social proof, urgenza, vantaggio competitivo — e per contesto d'uso. Quali hook avevano catturato l'attenzione, quali visual avevano spinto all'azione. Il punto di partenza è un archivio di insight, non un'intuizione del momento.",
          "Modularità. Si parte da una combinazione logica: 3 hook per 2 body per 1 CTA, cioè 6 varianti con buone probabilità di funzionare. Cambia un elemento alla volta e puoi isolare l'impatto di ciascuno. I risultati diventano leggibili.",
          "Cambiare solo ciò che non funziona. Se un hook rende poco, il body che converte resta dov'è e si prova un angle diverso: tono narrativo contro tono diretto, un insight provocatorio al posto di una descrizione. Per un macchinario professionale c'è un passaggio in più — spostare il messaggio dalle caratteristiche tecniche ai benefici concreti per chi gestisce il centro. Utenti diversi rispondono a stimoli diversi, e si mescola finché una combinazione regge.",
        ],
      },

      { h: "Cosa è cambiato" },
      "In meno di 30 giorni il CPL medio è sceso del 57%. Le creatività in test sono diventate meno e più mirate. Il processo decisionale è diventato chiaro e replicabile: a ogni ciclo si sa cosa cambia, cosa resta e per quale motivo.",

      { h: "I limiti di questo dato" },
      { q: "Il CPL misura il costo del contatto, non quello della vendita. Per un'azienda che vende macchinari, un lead conta davvero quando arriva a una trattativa." },
      "Il -57% va quindi letto insieme alla qualità dei lead e al tasso di chiusura, che dipendono anche dal processo commerciale del cliente e dal periodo.",

      { h: "Cosa porto con me" },
      "Produrre più annunci dà la sensazione di muoversi. Un test ben impostato produce un'informazione: cosa tenere, cosa cambiare, cosa scartare. Con 6 varianti costruite sulla stessa base ho imparato più che con decine di creatività scollegate tra loro.",
    ],
  },
  {
    slug: "concessionaria-performance-branding",
    title: "Performance branding per una concessionaria locale",
    year: "2026",
    client: "Concessionaria locale (cliente anonimo)",
    role: "Performance branding, analytics, campagne multi-funnel",
    cats: ["Advertising & Paid Media", "Analytics & Tracking"],
    art: ["#0e7490", "#67e8f9"],
    img: "/assets/project/concessionaria.svg",
    excerpt:
      "Le ricerche mensili di brand passano da 700 a 1.600 tra il 2023 e il 2026. A budget invariato, +69% di impression e +145% di click sulle query di brand organiche.",
    body: [
      "Nel 2023 cercavano il nome della concessionaria 700 volte al mese. Oggi sono 1.600.",
      "Non è successo in una settimana.",
      { q: "Nell'ultimo anno, a budget invariato, le query di brand organiche sono cresciute del 69% nelle impression e del 145% nei click." },

      { h: "Perché misurare le ricerche di brand" },
      "Chi gestisce campagne per una concessionaria ragiona in lead, costo per lead, appuntamenti. Metriche giuste. Arrivano tutte a valle.",
      "Le ricerche per nome stanno a monte. Contano le persone che scrivono su Google il nome dell'attività in un dato mese.",
      "Dietro ogni ricerca di brand c'è una persona che ha già in mente il nome. Prima può aver visto un video, sentito parlare dell'attività o incrociato un annuncio. Poi l'ha scritto su Google. È un comportamento, e il volume ti dice quante persone lo ripetono ogni mese.",
      "Una ricerca di brand può nascere da una campagna, da un video, dal passaparola. Se il numero cresce in modo stabile per anni, qualcosa nella notorietà locale si è mosso. Ma capire cosa, e quanto è merito delle campagne, richiede cautela.",

      { h: "Il punto di partenza: 700 ricerche al mese nel 2023" },
      "Nel 2023 la media delle ricerche mensili di brand era di 700. Il lavoro sul brand ha avuto una sola priorità: diventare riconoscibili, coerenti e memorabili nel tempo.",
      "Per impression e click uso le definizioni di Search Console. Un'impression è un link al sito che l'utente ha visto o potenzialmente visto nei risultati; un click viene conteggiato quando l'utente clicca un link che lo porta fuori da Google. I dati più recenti sono talvolta preliminari e possono cambiare nelle ore successive: per questo confronto solo periodi chiusi.",
      "Le ricerche mensili di brand e le impression sono due serie diverse. Le tengo separate in tutto il caso.",

      { h: "I numeri: tre anni, e un anno su anno" },
      { h: "Tre anni" },
      "Da 700 a 1.600 ricerche mensili: +128,6%, cioè 2,29 volte. Sono 900 ricerche in più in tre anni, circa 300 l'anno, con un tasso annuo composto del 31,7%.",
      "Per una concessionaria locale il bacino di persone è limitato dal territorio. Passare da 700 a 1.600 ricerche al mese vuol dire che molte più persone cercano il nome dell'attività.",
      { h: "L'ultimo anno" },
      "Il confronto più pulito è quello tra periodi omologhi: ultimi sei mesi del 2026 contro lo stesso periodo del 2025, sulle query di brand organiche. Il budget pubblicitario è rimasto invariato, e lo stesso semestre toglie dal confronto la stagionalità che si ripete ogni anno.",
      {
        table: {
          head: ["Metrica", "Stesso periodo 2025", "Ultimi 6 mesi 2026", "Variazione"],
          rows: [
            ["Impression", "11.504", "19.437", "+69%"],
            ["Click", "1.408", "3.446", "+145%"],
            ["CTR (calcolato)", "12,2%", "17,7%", "+5,5 punti"],
          ],
        },
      },
      "Va letto anche il valore assoluto. In sei mesi ci sono 7.933 impression e 2.038 click in più, cioè circa 1.322 impression e 340 click in più al mese. In media si passa da circa 1.917 a circa 3.240 impression mensili, e da circa 235 a circa 574 click mensili.",
      { q: "Il +145% sui click parte da una base piccola. La percentuale amplifica un incremento che in numeri assoluti resta quello di un'attività locale." },
      "I tre numeri raccontano cose diverse. Le impression dicono quante volte il nome compare nei risultati. I click dicono quante volte qualcuno lo sceglie. Il CTR mette in rapporto le due cose.",
      "I click crescono più delle impression: il CTR delle query di brand passa dal 12,2% al 17,7%, circa 1,45 volte. A ogni comparsa del nome, la probabilità che qualcuno lo scelga è più alta. È una lettura compatibile con un brand più riconosciuto. Il dato da solo non la dimostra.",

      { h: "Le tre leve usate" },
      "La strategia ha seguito tre direzioni, tenute ferme nel tempo.",
      {
        ol: [
          "Posizionamento chiaro e ripetuto. Un'identità che risponde a chi siamo, cosa offriamo e perché siamo diversi, ripetuta con coerenza per mesi.",
          "Video che raccontano il brand con il giusto tono di voce. L'obiettivo era un'esperienza di marca coerente e umana, per lavorare su percezione, fiducia e ricordo del brand.",
          "Campagne multi-funnel. Un percorso che accompagna l'utente dalla scoperta del brand alla considerazione e infine all'azione, senza limitarsi a campagne di conversione isolate.",
        ],
      },
      "Le tre leve lavorano insieme: il posizionamento dà il contenuto da ripetere, i video lo rendono riconoscibile, le campagne multi-funnel lo portano davanti alla stessa persona nelle diverse fasi del percorso.",
    ],
  },
  {
    slug: "mockup-ads-mockads",
    title: "Mockup ads: perché ho costruito un tool per farli",
    year: "2025",
    client: "Progetto personale",
    role: "Prodotto, design, sviluppo",
    cats: ["Web & Design", "Marketing Automation & AI"],
    art: ["#047857", "#6ee7b7"],
    img: "/assets/project/mockads.svg",
    url: "https://mockads.net",
    excerpt:
      "Come ho ridotto il tempo dei mockup ads nelle proposte ai clienti: perché ho costruito MockAds, dove lo uso e cosa non risolve.",
    body: [
      "Quando presento una strategia ads a un cliente, c'è un momento preciso in cui la conversazione cambia. Succede quando smette di ascoltare una descrizione e inizia a vedere la creatività dentro un feed.",
      "Prima di quel momento, «carosello con angolo prezzo» è solo una frase. Dopo, è qualcosa che può approvare, correggere o scartare. Se la vede, decide. Se deve immaginarla, rimanda.",
      "Per anni ho preparato i mockup ads nel modo più lento possibile. Strategia definita, copy scritto, angoli chiari. Poi aprivo Canva, adattavo uno screenshot e passavo il tempo a sistemare padding e proporzioni. Un lavoro che il cliente non vede e che non cambia le performance della campagna. Serve solo a rendere visibile qualcosa che esiste già.",
      "A un certo punto ho iniziato a notare quante volte lo ripetevo: a ogni proposta, a ogni variante, a ogni revisione.",

      { h: "Un generatore di mockup ads per le proposte ai clienti" },
      { q: "MockAds l'ho scritto in vibe coding: ho deciso io cosa doveva fare e mi sono fatto aiutare dall'AI per il codice." },
      "Carichi la creatività, scegli il formato e ottieni un mockup social realistico, pronto da mostrare. Facebook, Instagram, TikTok.",
      "Ha una funzione sola, e preferisco dirlo chiaramente. Il suo valore sta nell'attrito che toglie tra l'idea e la sua presentazione.",

      { h: "Dove lo uso: presentare le creatività ai clienti" },
      "Soprattutto in fase di proposta. Posso mostrare l'idea mentre ne parlo, invece di promettere di prepararla per la prossima call. Il cliente reagisce a qualcosa di concreto, e una reazione a una creatività visibile è più facile da lavorare di una perplessità generica.",

      { h: "Cosa non risolve" },
      { q: "Un mockup realistico rende credibile anche un'idea debole. Per questo va usato dopo aver deciso l'angolo, mai per sceglierlo." },
      "Se la strategia è sbagliata, un'anteprima curata la rende solo più convincente.",
      "L'analisi del target, il copy e i test restano lavoro da fare a monte. MockAds si occupa di un solo pezzo manuale, quello tra l'idea e la sua presentazione, e a me bastava questo.",

      { h: "Provalo" },
      "Lo trovi su mockads.net. Se lo provi e ti manca qualcosa, scrivimi cosa.",
    ],
  },
];

/* ============================================================
   JOURNAL — indice + pagina di dettaglio.

   Qui sotto ci sono i tre articoli scritti su LinkedIn, con le
   date reali di pubblicazione, dal più recente in giù.

   Il formato di `body` è una lista di blocchi:

     "testo"              → paragrafo
     { h: "Titolo" }      → sottotitolo
     { ul: ["a", "b"] }   → elenco puntato
     { ol: ["a", "b"] }   → elenco numerato
     { q: "citazione" }   → box a sinistra

   Modifica, aggiungi o togli voci liberamente: la home e la
   pagina di dettaglio leggono da qui, non dall'HTML.
   ============================================================ */

export const POSTS = [
  {
    url: "https://www.linkedin.com/posts/v-capasso_adfatigue-advertising-performance-ugcPost-7395480426414243841-3VfF",
    slug: "ad-fatigue",
    title: "Ad fatigue: il killer silenzioso delle tue campagne",
    date: "2026-04-28",
    topic: "Advertising",
    art: ["#047857", "#6ee7b7"],
    excerpt:
      "Il lento deterioramento che nessuno nota finché non è troppo tardi: CTR in calo, CPC in rialzo e budget che si brucia da solo.",
    body: [
      "Se sei un advertiser o un marketer che gestisce campagne social, sai bene che uno dei nemici più insidiosi non è sempre evidente: parlo di ad fatigue, ovvero quel lento ma implacabile deterioramento delle performance causato dalla sovraesposizione delle inserzioni.",

      { h: "Perché l'ad fatigue è un problema reale" },
      "Quando le persone vedono lo stesso annuncio troppe volte, smettono di prestare attenzione. Le metriche lo confermano: CTR in discesa, aumento del CPC, calo delle conversioni. Non è solo una questione di noia: è un segnale che stai letteralmente bruciando il tuo budget su creatività che hanno perso efficacia.",

      { h: "Come riconoscerla: i segnali da monitorare" },
      {
        ul: [
          "Frequenza media molto alta: molti utenti vedono l'annuncio troppe volte.",
          "Calo del CTR, oppure stabilizzazione su valori bassi.",
          "Costo per acquisizione che sale mentre il volume di conversioni cala.",
          "Engagement social in calo: meno commenti, meno condivisioni, meno reazioni.",
          "Tassi di hide ad e segnalazioni crescenti sui social.",
        ],
      },

      { h: "Le leve per combatterla" },
      {
        ol: [
          "Rotazione creativa. Non aspettare che le performance scendano drasticamente: pianifica una rotazione regolare degli annunci. Diverse varianti di visual, copy e CTA mantengono vivo l'interesse.",
          "Audience segmentation e frequency cap.",
          "Diversifica i formati. Non restare su uno solo: alterna immagini statiche, video, caroselli e ads interattivi. Combatte direttamente la sensazione di ripetitività.",
          "Storytelling sequenziale. Racconta una storia su più touchpoint invece di ripetere lo stesso messaggio: costruisci un percorso narrativo.",
          "Contenuti interattivi. Quiz, sondaggi e form interattivi coinvolgono l'utente e raccolgono dati utili per futuri segmenti.",
          "Analisi continua e testing.",
          "Strategia omnicanale. Non puntare tutto su un solo canale paid: integra advertising pagato con owned ed earned, così eviti di saturare un singolo touchpoint.",
        ],
      },

      { h: "La mentalità da abbracciare: essere proattivi, non reattivi" },
      "Ad fatigue non è inevitabile se la gestisci bene. Ma è un errore aspettare che le performance franino prima di intervenire.",
      {
        ul: [
          "Costruisci un motore creativo che produca varianti costanti.",
          "Prevedi momenti di refresh nella pianificazione delle campagne.",
          "Usa dati reali per guidare le decisioni, non solo la sensazione che stia calando.",
          "Sii pronto ad abbandonare formati consolidati se mostrano segni di affaticamento.",
        ],
      },

      { h: "In conclusione" },
      { q: "L'ad fatigue è il killer silenzioso delle campagne digitali: difficile da vedere, ma quando colpisce può erodere ROI, engagement e risultati." },
      "Se vuoi mantenere le tue campagne performanti a lungo termine devi mettere in piedi un sistema di monitoraggio, testing e creatività che non si adagia. La ricompensa? Budget che lavora meglio, campagne più sostenibili nel tempo e un ROI più sano.",
    ],
  },

  {
    url: "https://www.linkedin.com/pulse/come-smontare-la-narrazione-dominante-per-vendere-meglio-capasso-rhthf/",
    slug: "contro-narrazione",
    title: "Smontare la narrazione dominante per vendere",
    date: "2026-04-20",
    topic: "Strategia",
    art: ["#155e75", "#a5f3fc"],
    excerpt:
      "Per vendere la tua soluzione non devi raccontare la tua storia: devi smontare quella che il cliente si racconta già.",
    body: [
      "Ogni nicchia ha una narrazione dominante. Frasi che girano da anni, cose che si fanno così. Quella narrazione non è neutra: sta educando il tuo cliente contro di te.",

      { h: "Il problema delle convinzioni già formate" },
      "Quando un cliente arriva sul tuo sito o legge la tua proposta, non parte da zero. Arriva con idee già formate su come funziona il tuo settore, e quelle idee decidono cosa legge, cosa ignora, cosa trova credibile.",
      "La maggior parte delle aziende costruisce il messaggio così: ecco cosa facciamo, ecco perché siamo diversi. Ma il cliente non sta valutando la tua proposta in uno spazio vuoto: la sta confrontando con quello che crede già essere vero.",
      { q: "Nel software per gestire i clienti, per anni il messaggio è stato: più funzioni automatizzi, più tempo risparmi. Chi cerca una soluzione pensa quindi che automatizzare tutto sia sempre un vantaggio." },
      "Ora provi a proporre qualcosa di diverso: automatizza meno passaggi, ma personalizza meglio quelli importanti. La prima reazione non è curiosità, è resistenza — ma se automatizzo meno, perdo tempo. Quella obiezione non nasce dalla tua proposta: nasce da quello che il cliente credeva già.",
      { q: "Se non decostruisci prima le convinzioni su cui il cliente si regge, stai parlando sopra una storia più forte della tua." },

      { h: "Da dove arriva la storia ufficiale di un settore" },
      {
        h: "I grandi player del mercato",
        q: "Chi ha budget per fare pubblicità ha anche il potere di definire come si fa. Le piattaforme spingono messaggi tipo testa più versioni possibili non perché sia sempre la strategia migliore, ma perché serve al loro modello di business.",
      },
      {
        h: "I contenuti formativi",
        q: "Corsi, articoli, video. Quando migliaia di persone insegnano lo stesso metodo, quel metodo diventa la norma. E quei contenuti semplificano per essere accessibili: quelle semplificazioni diventano convinzioni rigide.",
      },
      {
        h: "L'esperienza diretta",
        q: "Se un cliente ha già provato altre soluzioni, si è formato un'opinione su cosa funziona. Spesso un'opinione sbagliata. Ma radicata.",
      },
      "Il cliente medio entra nel tuo processo di vendita con convinzioni già strutturate. Non cerca una soluzione nuova: cerca conferme a quello che pensa già. Se il tuo messaggio non si allinea, viene filtrato fuori. Non perché il cliente sia chiuso, ma perché il cervello umano protegge le idee esistenti.",

      { h: "Cosa significa contro-narrazione, e cosa non è" },
      "La contro-narrazione serve a rendere fragile quello che prima sembrava ovvio. Non a fare polemica, non a dire il contrario per principio. Ma a creare un dubbio strategico, basato su evidenze.",
      { q: "La storia ufficiale dice: se il tuo sito non vende, devi cambiare testi, colori dei pulsanti, layout. Quindi il cliente pensa che il problema sia sempre lì." },
      "Tu arrivi con un approccio diverso: il problema è spesso il traffico sbagliato, persone che cercano altro. Se dici solo questo, suona come una scusa.",
      "Ma se decostruisci prima, tutto cambia: la maggior parte dei siti che non vendono riceve visite da persone non interessate, che cliccano su un annuncio che promette una cosa e atterrano su una pagina che ne offre un'altra. Puoi testare cento versioni di testi, ma se la persona non trova quello che cercava nei primi tre secondi se ne va. Il problema non è il testo: è il disallineamento tra annuncio e pagina.",
      "Ora la storia ufficiale inizia a scricchiolare. Il cliente pensa: ok, forse ho sempre guardato nel posto sbagliato. Questo è il momento in cui la tua soluzione diventa interessante. Non prima.",

      { h: "Caso reale: Basecamp contro la complessità" },
      "Uno dei casi più chiari è quello di Basecamp, un software per gestire progetti e team.",
      { q: "La storia ufficiale del settore, anni 2010-2020: più funzioni hai, meglio è. Un buon software deve fare tutto. Ogni nuovo lancio aggiungeva funzionalità, ogni concorrente diceva noi facciamo più cose, e il cliente assorbiva il messaggio: se non ha tutte queste funzioni, non è un software serio." },
      "La contro-narrazione di Basecamp è stata l'esatto opposto: invece di competere sul numero di funzioni, ha smontato l'idea di base. Sul sito compare ancora oggi l'idea di software semplice e organizzato, niente funzioni superflue, solo quello che serve per lavorare.",
      "Una contro-narrazione si sostiene con azioni concrete, non con frasi:",
      {
        ul: [
          "Il libro It Doesn't Have to Be Crazy at Work, pubblicato nel 2018 dai fondatori Jason Fried e David Heinemeier Hansson, che smonta il mito della produttività attraverso strumenti complessi.",
          "Un prezzo fisso con utenti illimitati, mentre tutti fanno pagare per ogni persona del team: un modello che sfida la logica più persone uguale più costi.",
          "Una lista di funzioni limitata per scelta. Sul sito non trovi nuove funzioni in arrivo, trovi questo fa e questo non fa.",
        ],
      },
      { q: "Basecamp non è mai diventato il software più grande del mercato. Ma ha costruito una base di clienti estremamente fedele: persone stanche della complessità, che vedevano non uno strumento limitato ma uno strumento essenziale." },
      "La loro soluzione ha smesso di sembrare diversa e ha iniziato a sembrare quella giusta per chi cercava semplicità. In una intervista del 2019 a The Tim Ferriss Show, Jason Fried ha detto esplicitamente: la nostra strategia è sottrazione, non addizione. Il nostro vantaggio è dire di no.",

      { h: "Quando la contro-narrazione fallisce" },
      {
        h: "Mancanza di sostanza",
        q: "Dire il contrario di tutti non basta. Se non hai evidenze, dati o casi concreti, sembra solo marketing vuoto.",
      },
      {
        h: "Timing sbagliato",
        q: "Se la storia ufficiale è ancora troppo forte, la contro-narrazione viene ignorata. Basecamp ha funzionato perché molti team erano già frustrati dalla complessità: il dubbio esisteva già, loro gli hanno dato voce.",
      },
      {
        h: "Target troppo ampio",
        q: "Funziona su gruppi specifici, non su tutti. Basecamp non ha mai provato a convincere le grandi aziende con progetti complessi: ha parlato a team piccoli e medi stanchi di strumenti complicati.",
      },

      { h: "Come cambia il processo di vendita" },
      {
        h: "All'inizio del percorso",
        q: "I contenuti che smontano la storia ufficiale attirano persone già predisposte. Non stai cercando chiunque: stai selezionando.",
      },
      {
        h: "Nel mezzo del percorso",
        q: "Il cliente arriva alla chiamata con una mentalità diversa. Non sta valutando se sei migliore degli altri sullo stesso terreno: sta valutando se il suo approccio attuale ha ancora senso. Cambiano le domande, le obiezioni e il modo in cui percepisce il valore.",
      },
      {
        h: "Alla fine del percorso",
        q: "Se hai fatto bene il lavoro all'inizio, vendere diventa conferma. Non devi convincere da zero: stai solo rispondendo a una domanda che il cliente si stava già facendo.",
      },

      { h: "Tre errori da evitare" },
      {
        h: "Distruggere senza ricostruire",
        q: "Se smonti la storia ufficiale ma non offri un'alternativa crei solo confusione, e la confusione blocca le decisioni.",
      },
      {
        h: "Attaccare i concorrenti",
        q: "Non serve screditare altri: serve mettere in discussione un'idea radicata. Diventa un attacco personale e il cliente si mette sulla difensiva.",
      },
      {
        h: "Essere contrarian per moda",
        q: "Funziona quando tocca un problema che il cliente sta già vivendo, anche se non lo aveva ancora formulato a parole.",
      },

      { h: "Come applicarlo al tuo business" },
      "Prima di costruire una contro-narrazione devi capire quale storia ufficiale stai affrontando. Osserva cosa promettono i tuoi concorrenti principali, quali domande ricevi spesso nelle chiamate di vendita, cosa dicono le recensioni negative della tua categoria, quali idee vengono date per scontate nei contenuti del settore. Quelle ripetizioni sono la storia che il cliente assorbe, e quella è la storia che devi smontare.",
      "Poi chiediti dove quella storia non funziona: in quali situazioni crea problemi invece di risolverli, e quale eccezione nessuno menziona. Quel punto debole è il tuo punto di ingresso. Non cercare di convincere tutti: parla a chi ha già il dubbio, ma non aveva ancora le parole per dirlo.",
    ],
  },

  {
    slug: "framework-creativita",
    title: "Non ti servono più Ads, ti serve un framework",
    date: "2025-09-01",
    topic: "Creatività",
    art: ["#0e7490", "#67e8f9"],
    excerpt:
      "CPL ridotti del 57% in 30 giorni non grazie a più creatività, ma a un metodo che ti dice cosa testare, quando e perché.",
    body: [
      "Spesso, per noi advertiser e marketer, il problema non è che manchino le idee: è che manca un criterio solido per decidere cosa testare, quando e perché.",
      "Ogni settimana nuovi hook, nuovi formati, nuove varianti. Ma se non c'è un sistema di pre-analisi e modularità, è solo rumore creativo.",

      { h: "La falsa promessa della creatività continua" },
      "Nella mia routine di formazione quotidiana mi sono imbattuto in un webinar di Francesco Maria Errico su Learnn. Un'ora per ripassare quei fondamentali che, troppo spesso, diamo per scontati.",
      "Una slide in particolare mi ha colpito nella sua semplicità e potenza: ci convinciamo che serva un lavoro enorme, decine di asset, notti passate a ideare varianti infinite. La verità è che bastano pochi elementi ben strutturati e un framework solido per ottenere varianti davvero performanti.",
      { q: "Continuare a produrre ads ci dà una sensazione di movimento, ma rischia di trasformarsi in un overload inefficiente senza un framework." },
      "Senza un framework decisionale finisci per testare combinazioni irrilevanti, bruciare budget su messaggi deboli e ignorare segnali chiave che potrebbero guidare le scelte. Il risultato è performance altalenante, team sotto stress, zero apprendimento reale.",

      { h: "La chiave: framework + dati" },
      "Non ci serve creare 30 asset per avere varianza creativa: ci serve un metodo che permetta di scalare il processo creativo.",
      {
        h: "Pre-analisi di ciò che funziona",
        q: "Guarda i best performer in base alle leve — social proof, urgenza, vantaggio competitivo — e al contesto di utilizzo. Quali hook hanno catturato l'attenzione? Quali visual hanno spinto all'azione? Serve un archivio di insight da cui partire, anziché affidarsi al caso.",
      },
      {
        h: "Modularità",
        q: "Parti da una combinazione logica: 3 hook × 2 body × 1 CTA = 6 varianti ad alto potenziale. Così isoli l'impatto di ogni elemento e scopri cosa funziona davvero. Meno rumore, più chiarezza nei risultati.",
      },
      {
        h: "Cambia ciò che non funziona",
        q: "Se un hook non funziona, non buttare via l'intero annuncio: mantieni il body che già converte e gioca con nuovi angle. Passa da un tono narrativo a uno diretto, aggiungi emozione o un insight provocatorio, sposta il focus dalle caratteristiche tecniche ai benefici concreti. Non tutti gli utenti rispondono allo stesso stimolo: mescola e abbina finché non trovi la combinazione che fa breccia.",
      },

      { h: "Dai CPL alle stelle a campagne che respirano" },
      "Un cliente combatteva con costi per lead alle stelle da oltre 18 mesi su Meta Ads. Ogni mese si testavano nuove creatività, si investiva su nuovi formati, si variavano offerte e copy. Il risultato era sempre lo stesso: lead troppo costosi e performance altalenante.",
      { q: "Il problema non era la mancanza di idee: era l'assenza di un criterio solido per capire cosa testare, quando e perché." },
      "Una volta applicato il framework di cui parlavo sopra — pre-analisi, modularità e interpretazione dei dati — la situazione è cambiata drasticamente. In meno di 30 giorni:",
      {
        ul: [
          "CPL medio ridotto del 57%.",
          "Creatività semplificata, non moltiplicata.",
          "Processo decisionale chiaro e replicabile.",
        ],
      },

      { h: "Scalare non è fare di più, è fare meglio" },
      "La vera differenza non la fa il volume di asset, ma la precisione con cui li generi, testi e impari da ciò che accade. Non servono 40 creatività a settimana: serve un sistema che ti dica quali fare, quando farle e perché.",
      "Continuare a produrre senza un criterio chiaro significa fare solo rumore creativo con l'illusione di essere efficaci. La creatività diventa utile quando è guidata da dati, contesto e consapevolezza, quando ogni test è progettato per farti fare un passo avanti e non per riempire un foglio di varianti.",
      { q: "Non ti serve più roba: ti serve un processo che trasformi ogni asset in un passo consapevole. Il resto? Solo frenesia con zero direzione." },
    ],
  },
];

/* ============================================================
   CONTENUTI DELLA PAGINA ABOUT
   ============================================================ */

export const SKILLS = [
  {
    name: "Advertising & Paid Media",
    color: "#3dcab1",
    desc: "Campagne a performance su Google, Meta, TikTok e LinkedIn. Visual, messaggi e budget collegati ai KPI, in un'unica strategia.",
    items: ["Google Ads", "Meta Ads", "TikTok Ads", "LinkedIn Ads", "Performance Marketing"],
  },
  {
    name: "Marketing Automation & AI",
    color: "#7c3aed",
    desc: "Funnel e workflow che girano da soli con Zapier e Make, più AI applicata dove fa davvero la differenza.",
    items: ["Zapier", "Make", "Funnel Marketing", "Marketing Automation", "AI Tools"],
  },
  {
    name: "Analytics & Tracking",
    color: "#0d9488",
    desc: "Setup di misurazione con GA4, Tag Manager e Conversion API: pochi dati affidabili invece di tanti inutili.",
    items: ["Google Analytics 4", "Tag Manager", "Pixel", "Conversion API", "KPI Analysis"],
  },
  {
    name: "Web & Development",
    color: "#ea580c",
    desc: "Siti WordPress con focus su UX e conversione, SEO/SEM e contenuti che portano al contatto.",
    items: ["WordPress", "UX Design", "SEO/SEM", "Copywriting", "Email Marketing"],
  },
];

export const SOFT_SKILLS = [
  "Data-Driven Decision Making",
  "Strategic Planning",
  "Team Work",
  "Problem Solving",
];

export const CERTIFICATIONS = [
  "Ads AI",
  "Facebook Ads 2.0",
  "Marketing Analysis AI",
  "Growth Hacking",
  "Google Ads",
];

export const TOOLS = [
  { name: "Google Ads", group: "Advertising", color: "#4285F4" },
  { name: "Meta Ads", group: "Advertising", color: "#0866FF" },
  { name: "TikTok Ads", group: "Advertising", color: "#FE2C55" },
  { name: "LinkedIn Ads", group: "Advertising", color: "#0A66C2" },
  { name: "Google Analytics", group: "Analytics", color: "#F9AB00" },
  { name: "Tag Manager", group: "Analytics", color: "#8AB4F8" },
  { name: "Looker Studio", group: "Analytics", color: "#4285F4" },
  { name: "WordPress", group: "Web", color: "#21759B" },
  { name: "Zapier", group: "Automation", color: "#FF4A00" },
  { name: "n8n", group: "Automation", color: "#EA4B71" },
  { name: "ManyChat", group: "Automation", color: "#00A8E1" },
  { name: "ChatGPT", group: "AI", color: "#10A37F" },
  { name: "Claude AI", group: "AI", color: "#D97757" },
];

export const JOBS = [
  {
    role: "Performance & Marketing Automation",
    company: "EWAKE",
    companyNote: "Performance Branding Agency",
    from: "Novembre 2023",
    to: "Presente",
    place: "Verona, Veneto, Italia",
    current: true,
    points: [
      "Gestione e ottimizzazione di campagne Paid Media su Google Ads, Meta Ads, TikTok Ads e LinkedIn Ads",
      "Implementazione e monitoraggio del tracking (GA4, Tag Manager, Pixel, Conversion API)",
      "Sviluppo di workflow automatizzati con Zapier, Make e simili",
      "Analisi dei dati e creazione di report per ottimizzare KPI e performance",
      "Applicazione di soluzioni AI per il marketing e implementazione di strumenti di automazione intelligente",
    ],
  },
  {
    role: "Digital Marketing Specialist",
    company: "FlightBack",
    from: "Febbraio 2022",
    to: "Novembre 2023",
    place: "Napoli, Campania, Italia",
    points: [
      "Ideazione e gestione del Brand Design e dell'identità visiva aziendale",
      "Progettazione e sviluppo del sito web su WordPress, con focus su UX e conversione",
      "Strutturazione di funnel di acquisizione e nurturing, integrati con sistemi di marketing automation",
      "Consulenza strategica per allineare obiettivi di marketing, comunicazione e performance",
    ],
    highlight: "+300 clienti nel primo anno di attività, senza Advertising",
  },
  {
    role: "Digital Marketing Specialist",
    company: "Geis Management Group S.r.l.",
    from: "Dicembre 2021",
    to: "Novembre 2023",
    place: "Napoli, Campania, Italia",
    points: [
      "Gestione di campagne pubblicitarie data-driven SEO/SEM e Social Ads",
      "Implementazione di funnel di lead generation e strategie di conversion rate optimization",
      "Gestione e ottimizzazione di siti WordPress",
      "Copywriting e email marketing con analisi costante dei KPI",
    ],
  },
];

export const EDUCATION = [
  {
    place: "Learnn",
    kind: "Formazione Professionale",
    field: "Digital Marketing & Growth",
    from: "Settembre 2021",
    to: "in corso",
    href: "https://learnn.com/profile/vincenzo-capasso/",
  },
  {
    place: "Luiss Guido Carli University",
    kind: "Laurea Magistrale LM",
    field: "Marketing",
    from: "Gennaio 2019",
    to: "Luglio 2021",
  },
  {
    place: "Università degli Studi di Napoli 'Parthenope'",
    kind: "Laurea breve",
    field: "Scienze Economiche - Economia e Commercio",
    from: "2016",
    to: "2019",
  },
  {
    place: "Ovingdean Hall College",
    kind: "Certificazione",
    field: "Lingua Inglese",
    from: "2014",
    to: "",
  },
];

/* ---------- Gallery: didascalie ---------- */

export const GALLERY_CAPTIONS = [
  "Prima call", "Impostazioni", "Dati", "Test A/B", "Report", "Funnel",
  "Keyword", "Landing", "Creative", "Audience", "Budget", "KPI",
  "Automazione", "Analytics", "Riunione", "Checklist", "Preventivi", "Setup",
  "Scaling", "Retargeting", "Naming", "Dashboard", "A/B", "Notte",
];

export const byslug = (list, slug) => list.find((p) => p.slug === slug);

export const readDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

/* Data corta in stile "Nov 19, 2025" per le righe della tabella Blog. */
export const readDateShort = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });