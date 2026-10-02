#!/usr/bin/env ruby
# frozen_string_literal: true

# ============================================================
#   GENERATORE DELLE PAGINE STATICHE
#
#   Perché esiste
#   ------------
#   Il sito è costruito come pagine .html che il browser riempie
#   con JavaScript, leggendo i contenuti da js/data.js. Va bene
#   per chi naviga, ma Google indicizza il testo solo se lo trova
#   già nell'HTML: il contenuto costruito dal browser viene
#   indicizzato in ritardo, e male.
#
#   Le URL annidate (vincenzocapasso.com/blog/ad-fatigue/)
#   peggiorano la cosa. Un file dentro /blog/ad-fatigue/ che
#   chiede "css/style.css" lo cerca in /blog/ad-fatigue/css/, che
#   non esiste: servono percorsi assoluti (/css/style.css).
#
#   Cosa fa
#   -------
#   1. legge js/data.js con il motore JavaScript di sistema e ne
#      ricava i dati in JSON
#   2. per ogni articolo scrive  blog/<slug>/index.html
#      per ogni progetto scrive progetti/<slug>/index.html
#   3. scrive anche gli indici blog/index.html e progetti/index.html
#   4. scrive sitemap.xml e robots.txt
#
#   I file generati sono veri file su disco, non un trucco: GitHub
#   Pages li serve senza sapere che esistono. Il generatore si
#   riesegue solo quando cambiano i contenuti in js/data.js.
#
#   Uso:  ruby tools/generate.rb
# ============================================================

require "json"
require "fileutils"
require "tmpdir"
require "time"

ROOT = File.expand_path("..", __dir__)
SITE = "https://vincenzocapasso.com"
CACHE_BUST = File.read(File.join(ROOT, "index.html"))[/style\.css\?v=(\d+)/, 1] || "1"

# ------------------------------------------------------------
# 1. Dati
# ------------------------------------------------------------

# js/data.js è un modulo ES. Tolgo la parola `export` così diventa
# uno script che il motore di sistema può valutare, e gli chiedo
# di stampare i dati che servono in JSON.
#
# NAV sta in js/nav.js, non qui: ne prendo solo la dichiarazione per
# avere l'icona della mail, che è l'unica cosa che mi serve da lì.
# Non riuso NAV per il menu: quello resta costruito dal browser.
def read_data
  src = File.read(File.join(ROOT, "js", "data.js"))
  plain = src.gsub(/export\s+const\s+/, "const ").gsub(/export\s+/, "")

  nav_src = File.read(File.join(ROOT, "js", "nav.js"))
  nav_plain = nav_src[/export const NAV = \[.*?\n\];/m].to_s.gsub(/export\s+const\s+/, "const ")

  probe = <<~JS
    #{nav_plain}
    #{plain}
    JSON.stringify({
      posts: POSTS.map(p => ({
        slug: p.slug, title: p.title, date: p.date, topic: p.topic,
        excerpt: p.excerpt, url: p.url || null, art: p.art, body: p.body
      })),
      projects: PROJECTS.map(p => ({
        slug: p.slug, title: p.title, year: p.year, client: p.client,
        role: p.role, cats: p.cats, art: p.art, img: p.img,
        excerpt: p.excerpt, body: p.body
      })),
      categories: CATEGORIES, profile: PROFILE, socials: SOCIALS,
      skills: SKILLS, tools: TOOLS, jobs: JOBS,
      education: EDUCATION, certifications: CERTIFICATIONS,
      softSkills: SOFT_SKILLS,
      // la stessa icona che usa la dock, presa da NAV: una sola sorgente
      mailIcon: (typeof NAV !== "undefined" ? NAV : []).find(n => n.id === "contact").icon
    });
  JS

  tmp = File.join(Dir.tmpdir, "vc_data_probe.js")
  File.write(tmp, probe)
  out = `osascript -l JavaScript #{tmp} 2>/dev/null`
  raise "non riesco a leggere js/data.js" unless $?.success? && !out.strip.empty?

  JSON.parse(out)
ensure
  File.delete(tmp) if tmp && File.exist?(tmp)
end

# ------------------------------------------------------------
# 2. Helper
# ------------------------------------------------------------

def esc(s)
  s.to_s
   .gsub("&", "&amp;").gsub("<", "&lt;").gsub(">", "&gt;")
   .gsub('"', "&quot;")
end

# Stessa soglia di lunghezza usata dal CSS per i titoli display
# (0.396em/char sul Regular): sotto i 40 caratteri il titolo può
# salire di corpo, sopra i 52 scende.
def title_len(t)
  n = t.length
  return 1 if n <= 40
  return 2 if n <= 52
  3
end

def read_date(iso)
  y, m, d = iso.split("-")
  mesi = %w[gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre]
  "#{d.to_i} #{mesi[m.to_i - 1]} #{y}"
end

def read_date_iso(iso)
  d = Time.parse(iso)
  d.strftime("%Y-%m-%d")
rescue StandardError
  iso
end

# Stessa logica di projectBg() in js/render.js: l'illustrazione
# PRIMA e il gradiente dopo, così se il file manca si vede il
# colore al posto del buco. Senza questo, `img` non arrivava mai
# alle pagine e le tre copertine restavano file a terra.
def project_bg(p)
  grad = "linear-gradient(145deg,#{Array(p['art']).join(',')})"
  p["img"] ? "url('#{esc(p['img'])}'),#{grad}" : grad
end

# Stesso blocco di apertura di tutte le pagine: temi, font,
# fogli di stile. I percorsi sono ASSOLUTI (/css/...) perché
# questa pagina potrebbe stare in /blog/<slug>/.
def head(title:, desc:, canonical:, type: "website", extra: "")
  <<~HTML
    <!doctype html>
    <html lang="it">
    <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>#{esc(title)}</title>
    <meta name="description" content="#{esc(desc)}">
    <link rel="canonical" href="#{esc(canonical)}">
    <meta property="og:type" content="#{type}">
    <meta property="og:title" content="#{esc(title)}">
    <meta property="og:description" content="#{esc(desc)}">
    <meta property="og:url" content="#{esc(canonical)}">
    <meta property="og:site_name" content="Vincenzo Capasso">
    <meta property="og:locale" content="it_IT">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="#{esc(title)}">
    <meta name="twitter:description" content="#{esc(desc)}">
    #{extra}<link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Geist:wght@400;500;600&display=swap" rel="stylesheet">
    <script>(function(){try{var t=localStorage.getItem("theme");if(!t){t="dark";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();</script>
    <link rel="stylesheet" href="/css/style.css?v=#{CACHE_BUST}">
    <link rel="stylesheet" href="/css/content.css?v=#{CACHE_BUST}">
    </head>
    <body>
  HTML
end

# SCRIPT DI AVVIO
#   Delega tutto a boot() come fanno le altre pagine: sfondo,
#   menu, dock, animazioni. Il testo della pagina è già
#   nell'HTML, qui non c'è niente da costruire.
def shell_scripts(page)
  <<~HTML
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
    <script type="module">
      import { boot } from "/js/site.js";
      boot({ page: "#{page}" });
    </script>
  HTML
end

def footer
  <<~HTML
    <footer class="foot">
      <p>&copy; <span data-year></span> Vincenzo Capasso. Tutti i diritti riservati.</p>
      <p id="footlinks"></p>
    </footer>
  HTML
end

# ------------------------------------------------------------
# 3. Resa dei blocchi di corpo
#    Stessa struttura di js/render.js, ma in Ruby e in HTML
#    definitivo: qui non verrà eseguito nessun JavaScript.
# ------------------------------------------------------------

def render_blocks(blocks)
  out = +""
  Array(blocks).each do |b|
    if b.is_a?(String)
      out << "<p>#{esc(b)}</p>\n"
    elsif b.is_a?(Hash)
      if b[:h] || b["h"]
        out << %(<h2 class="article__h">#{esc(b[:h] || b['h'])}</h2>\n)
      elsif b[:q] || b["q"]
        out << %(<blockquote class="article__q">#{esc(b[:q] || b['q'])}</blockquote>\n)
      elsif b[:ul] || b["ul"]
        items = (b[:ul] || b["ul"]).map { |i| "<li>#{esc(i)}</li>" }.join
        out << %(<ul class="article__list">#{items}</ul>\n)
      elsif b[:ol] || b["ol"]
        items = (b[:ol] || b["ol"]).map { |i| "<li>#{esc(i)}</li>" }.join
        out << %(<ol class="article__list">#{items}</ol>\n)
      elsif b[:table] || b["table"]
        t = b[:table] || b["table"]
        head = Array(t["head"] || t[:head])
        rows = Array(t["rows"] || t[:rows])
        thead = head.empty? ? "" : "<thead><tr>#{head.map { |h| "<th>#{esc(h)}</th>" }.join}</tr></thead>"
        tbody = rows.map do |r|
          cells = Array(r).map { |c| "<td>#{esc(c)}</td>" }.join
          "<tr>#{cells}</tr>"
        end.join
        out << %(<div class="tablewrap"><table class="article__table">#{thead}<tbody>#{tbody}</tbody></table></div>\n)
      end
    end
  end
  out
end

# Testo semplice per il sommario: quanto del corpo sta nel
# sommario che finisce nel meta description.
def summary(text, n = 155)
  s = text.to_s.gsub(/\s+/, " ").strip
  return s if s.length <= n
  "#{s[0, n - 1].rstrip}…"
end

# ------------------------------------------------------------
# 3b. Componenti di "Chi Sono"
#     Le stesse strutture di js/render.js, in HTML definitivo.
# ------------------------------------------------------------

def job_html(j)
  pts = Array(j["points"]).map { |p| "<li>#{esc(p)}</li>" }.join
  <<~HTML
    <article class="tl__item reveal#{j['current'] ? ' is-current' : ''}">
      <span class="tl__dot" aria-hidden="true"></span>
      <div class="tl__body">
        <h3 class="tl__role">#{esc(j['role'])}</h3>
        <p class="tl__company">#{esc(j['company'])}#{j['companyNote'] ? ' — ' + esc(j['companyNote']) : ''}</p>
        <p class="tl__meta">
          <span class="tl__when">#{esc(j['from'])} — #{esc(j['to'])}</span>
          #{j['current'] ? '<span class="tl__now">In corso</span>' : ''}
          <span class="tl__sep">·</span><span>#{esc(j['place'])}</span>
        </p>
        <ul class="tl__points">#{pts}</ul>
        #{j['highlight'] ? %(<p class="tl__highlight">#{esc(j['highlight'])}</p>) : ''}
      </div>
    </article>
  HTML
end

def edu_html(e)
  place = e["href"] ? %(<a href="#{esc(e['href'])}" target="_blank" rel="noopener">#{esc(e['place'])}</a>) : esc(e["place"])
  <<~HTML
    <article class="tl__item reveal">
      <span class="tl__dot" aria-hidden="true"></span>
      <div class="tl__body">
        <h3 class="tl__role">#{esc(e['field'])}</h3>
        <p class="tl__company">#{place}</p>
        <p class="tl__meta">
          <span class="tl__kind">#{esc(e['kind'])}</span>
          <span class="tl__sep">·</span>
          <span class="tl__when">#{esc(e['from'])}#{e['to'] ? ' — ' + esc(e['to']) : ''}</span>
        </p>
      </div>
    </article>
  HTML
end

def group_html(g)
  items = Array(g["items"]).map { |i| "<li>#{esc(i)}</li>" }.join
  %(<div class="group reveal" style="--c:#{esc(g['color'])}">\n  <h3>#{esc(g['name'])}</h3>\n  <ul>#{items}</ul>\n</div>)
end

def tool_groups_html(tools)
  grouped = Array(tools).group_by { |t| t["group"] }
  grouped.map do |name, list|
    tags = list.map do |t|
      %(<span class="tool" style="--c:#{esc(t['color'])}"><span class="tool__mark" aria-hidden="true"></span>#{esc(t['name'])}</span>)
    end.join("\n      ")
    <<~HTML
      <div class="toolgroup reveal">
        <h3 class="toolgroup__name" style="--c:#{esc(list[0]['color'])}">#{esc(name)}</h3>
        <div class="tools">
          #{tags}
        </div>
      </div>
    HTML
  end.join("\n")
end

def badges_html(list)
  Array(list).map { |b| %(<span class="badge">#{esc(b)}</span>) }.join
end

def about_page(data)
  prof = data["profile"]
  socials = data["socials"]

  links = Array(socials).map do |s|
    %(<a href="#{esc(s['href'])}" target="_blank" rel="noopener">#{esc(s['label'])}</a>)
  end.join("")

  # Niente width/height: il CSS ha gia' `aspect-ratio:1` e un
  # attributo height vince su quello, stirando la foto in un
  # rettangolo alto. Il riquadro di riserva con le iniziali resta
  # il fallback se il file non c'e'.
  portrait = if prof["photo"]
               %(<img class="portrait" src="#{esc(prof['photo'])}" alt="Vincenzo Capasso" decoding="async" fetchpriority="high">)
             else
               %(<img class="portrait" alt="Vincenzo Capasso" decoding="async" fetchpriority="high">)
             end

  desc = "Performance &amp; Marketing automation: paid media, tracking e automazione applicata al marketing. Eserienza, competenze e strumenti."

  <<~HTML
    #{head(title: "Chi Sono — Vincenzo Capasso", desc: desc, canonical: "#{SITE}/chi-sono/")}
    <header class="pagehead">
      <h1 class="pagehead__title">Chi Sono</h1>
    </header>

    <main class="page">
      <section class="sec sec--tight">
        <div class="about">
          <div class="about__text">
            <p class="lede reveal" id="tagline">#{esc(prof['tagline'])}</p>
            <p class="reveal">
              Trasformo dati e insight in strategie, funnel e campagne che
              performano. Quando non performano, scopro perché. Quando il cliente
              dice «sarà la creatività», di solito no. 🫠
            </p>
            <p class="reveal">
              Lavoro su Meta, Google, TikTok e LinkedIn, con un approccio
              data-driven che mette insieme advertising, tracking, marketing
              automation e AI. Cioè passo le giornate a guardare CPL, CPA, ROAS e
              conversion rate, e a chiedermi cosa stiano cercando di dirmi.
            </p>
            <p class="reveal">
              Il mio obiettivo è capire cosa spinge davvero la performance e
              intervenire dove l'impatto è reale. Non dove il report viene meglio.
              😌
            </p>
            <p class="reveal">Nel mio lavoro mi occupo di tre cose:</p>
            <ol class="about__points reveal">
              <li>
                <strong>Capire perché le persone fanno quello che fanno.</strong>
                Dati e psicologia comportamentale, perché sono più prevedibili di
                quanto vorrebbero. 🧠
              </li>
              <li>
                <strong>Togliere attrito dai funnel.</strong>
                Ogni click in più per arrivare al form è un utente che se ne va, e
                di solito non torna a salutare. 🚪
              </li>
              <li>
                <strong>Automatizzare e usare l'AI.</strong>
                Ma solo dopo aver capito dove sto andando. ⚙️
              </li>
            </ol>
            <p class="reveal">
              Mi diverto a sperimentare funnel nuovi, a costruire automazioni che
              ascoltano prima di agire e a trasformare i numeri in decisioni.
            </p>
            <p class="reveal">
              Se le cose non vanno come dovrebbero, sei nel posto giusto. Se va
              benissimo, vediamo comunque perché i miracoli non mi convincono mai.
              🤨
            </p>
          </div>

          <aside class="about__side">
            #{portrait}
            <p class="about__name">#{esc(prof['name'])}</p>
            <p class="about__role">#{esc(prof['roleLine'])}</p>
            <p class="about__place">#{esc(prof['location'])}</p>
            <div class="about__links">#{links}</div>
          </aside>
        </div>
      </section>

      <section class="sec">
        <div class="sec__head"><h2 class="sec__title">Esperienza</h2></div>
        <div class="tl">#{Array(data['jobs']).map { |j| job_html(j) }.join("\n")}</div>
      </section>

      <section class="sec">
        <div class="sec__head"><h2 class="sec__title">Competenze</h2></div>
        <div class="groups">#{Array(data['skills']).map { |g| group_html(g) }.join("\n")}</div>
      </section>

      <section class="sec">
        <div class="sec__head"><h2 class="sec__title">Strumenti</h2></div>
        <div>#{tool_groups_html(data['tools'])}</div>
      </section>

      <section class="sec">
        <div class="sec__head"><h2 class="sec__title">Formazione</h2></div>
        <div class="tl">#{Array(data['education']).map { |e| edu_html(e) }.join("\n")}</div>
      </section>

      <section class="sec" style="padding-top:0">
        <div class="sec__head"><h2 class="sec__title">Certificazioni</h2></div>
        <div class="badges reveal">#{badges_html(data['certifications'])}</div>
      </section>

      <section class="sec" style="padding-top:0">
        <div class="sec__head"><h2 class="sec__title">Soft Skills</h2></div>
        <div class="badges reveal">#{badges_html(data['softSkills'])}</div>
      </section>
    </main>

    #{footer}
    #{shell_scripts("projects")}
    </body>
    </html>
  HTML
end

def contact_page(data)
  prof = data["profile"]
  desc = "Contatti diretti: scrivimi per paid media, tracking e marketing automation. Risposta personale, senza form."

  # L'indirizzo non compare come testo da nessuna parte: esiste solo
  # dentro l'href del bottone, quindi non è leggibile con un copia e
  # incolla e non finisce in un indice.
  mailto = "mailto:#{prof['email']}"

  jsonld = {
    "@context" => "https://schema.org",
    "@type" => "Person",
    "name" => prof["name"],
    "jobTitle" => prof["roleLine"],
    "url" => SITE,
    "email" => prof["email"],
    "knowsAbout" => "Advertising, tracking, marketing automation"
  }.to_json
  ld = %(<script type="application/ld+json">#{esc(jsonld)}</script>\n)

  rows = [{ k: "Posizione", v: prof["location"] }] +
         Array(data["socials"]).map { |s| { k: s["label"], v: s["href"], href: s["href"] } }

  contacts = rows.map do |r|
    val = if r[:href]
            %(<a href="#{esc(r[:href])}" target="_blank" rel="noopener">#{esc(r[:v].sub(%r{^https?://}, ''))}</a>)
          else
            esc(r[:v])
          end
    <<~HTML
      <li class="post">
        <div>
          <time>#{esc(r[:k])}</time>
          <h3>#{val}</h3>
        </div>
      </li>
    HTML
  end.join("\n")

  <<~HTML
    #{head(title: "Contatti — Vincenzo Capasso", desc: desc, canonical: "#{SITE}/contatti/", extra: ld)}
    <main class="contact">
      <p class="scribble scribble--l">Connettiamoci</p>
      <p class="scribble scribble--r">Disponibile per nuove collaborazioni</p>

      <!-- Niente form: su un sito statico non invierebbe nulla. Il
           contatto è la mail, quindi il bottone è la mail. -->
      <div class="mailcta">
        <h1 class="mailcta__title">Scrivimi</h1>
        <a class="mailcta__btn" href="#{esc(mailto)}">
          <img class="mailcta__icon" src="#{esc(data['mailIcon'])}" alt="" aria-hidden="true" width="160" height="160">
        </a>
        <p class="mailcta__sub">Raccontami di cosa ti occupi e cosa vuoi costruire.</p>
      </div>
    </main>

    <section class="sec" style="padding-top:0">
      <div class="sec__head"><h2 class="sec__title">Trovami anche qui</h2></div>
      <ul class="posts">#{contacts}</ul>
    </section>

    #{footer}
    #{shell_scripts("journal")}
    </body>
    </html>
  HTML
end

# ------------------------------------------------------------
# 4. Pagine dei progetti
# ------------------------------------------------------------

def project_page(p, cats)
  url = "#{SITE}/progetti/#{p['slug']}/"
  d = read_date("#{p['year']}-01-01")
  desc = summary(p["excerpt"])
  cats_html = Array(p["cats"]).map { |c| %(<span class="tag">#{esc(c)}</span>) }.join(" ")

  jsonld = {
    "@context" => "https://schema.org",
    "@type" => "CreativeWork",
    "name" => p["title"],
    "headline" => p["title"],
    "description" => p["excerpt"],
    "inLanguage" => "it",
    "url" => url,
    "datePublished" => "#{p['year']}-01-01",
    "author" => { "@type" => "Person", "name" => "Vincenzo Capasso" },
    "keywords" => Array(p["cats"]).join(", ")
  }.to_json
  ld = %(<script type="application/ld+json">#{esc(jsonld)}</script>\n)

  <<~HTML
    #{head(title: "#{p['title']} — Vincenzo Capasso", desc: desc, canonical: url, extra: ld)}
    <main class="page" id="app">
      <header class="pagehead">
        <a class="backlink" href="/progetti/">&larr; Tutti i progetti</a>
        <h1 class="pagehead__title" data-len="#{title_len(p['title'])}">#{esc(p['title'])}</h1>
      </header>

      <section class="sec sec--tight">
        <!-- L'illustrazione è lo SFONDO del riquadro (project_bg), non
             un <img> dentro: metterla due volte la faceva sovrapporre.
             role/aria sul div tengono la descrizione per chi non la vede. -->
        <div class="heroimg" role="img" style="background-image:#{project_bg(p)}"
             aria-label="Illustrazione del progetto: #{esc(p['title'])}"></div>
        <div class="article">
          <div class="article__meta">
            <span><b>Cliente</b> #{esc(p['client'])}</span>
            <span><b>Anno</b> #{esc(p['year'])}</span>
            <span><b>Ruolo</b> #{esc(p['role'])}</span>
          </div>
          <div class="pcard__cats" style="margin:1.25rem 0">#{cats_html}</div>
          <p class="lede">#{esc(p['excerpt'])}</p>
          #{render_blocks(p['body'])}
        </div>
      </section>

      <section class="sec" style="border-top:1px solid var(--line)">
        <div class="sec__head"><h2 class="sec__title">Parliamo del tuo caso</h2></div>
        <a class="pcard reveal" href="/contatti/" style="max-width:420px">
          <div class="pcard__body">
            <h3 class="pcard__title" data-len="2">Se ti riconosci in questo caso, scrivimi</h3>
            <span class="pcard__cta">Contatti</span>
          </div>
        </a>
      </section>
    </main>
    #{footer}
    #{shell_scripts("about")}
    </body>
    </html>
  HTML
end

# ------------------------------------------------------------
# 5. Pagina di un articolo
# ------------------------------------------------------------

def post_page(p, next_post)
  url = "#{SITE}/blog/#{p['slug']}/"
  desc = summary(p["excerpt"])
  art = Array(p["art"])

  jsonld = {
    "@context" => "https://schema.org",
    "@type" => "BlogPosting",
    "headline" => p["title"],
    "description" => p["excerpt"],
    "inLanguage" => "it",
    "url" => url,
    "datePublished" => read_date_iso(p["date"]),
    "author" => { "@type" => "Person", "name" => "Vincenzo Capasso" },
    "articleSection" => p["topic"]
  }.to_json
  ld = %(<script type="application/ld+json">#{esc(jsonld)}</script>\n)

  src_link = if p["url"]
               %(<p class="article__src"><a href="#{esc(p['url'])}" target="_blank" rel="noopener">Leggi l'articolo originale su LinkedIn &nearr;</a></p>)
             else
               ""
             end

  next_card = if next_post
                <<~HTML
                  <section class="sec" style="border-top:1px solid var(--line)">
                    <div class="sec__head"><h2 class="sec__title">Prossimo articolo</h2></div>
                    <a class="pcard reveal" href="/blog/#{next_post['slug']}/" style="max-width:420px">
                      <div class="pcard__media" style="background-image:linear-gradient(145deg,#{Array(next_post['art']).join(',')})"></div>
                      <div class="pcard__body">
                        <h3 class="pcard__title" data-len="#{title_len(next_post['title'])}">#{esc(next_post['title'])}</h3>
                        <span class="pcard__cta">Leggi</span>
                      </div>
                    </a>
                  </section>
                HTML
              end

  <<~HTML
    #{head(title: "#{p['title']} — Vincenzo Capasso", desc: desc, canonical: url, type: "article", extra: ld)}
    <main class="page" id="app">
      <header class="pagehead">
        <a class="backlink" href="/blog/">&larr; Tutti gli articoli</a>
        <h1 class="pagehead__title" data-len="#{title_len(p['title'])}">#{esc(p['title'])}</h1>
        <p class="article__meta"><span><b>Pubblicato</b> #{read_date(p['date'])}</span><span>#{esc(p['topic'])}</span></p>
      </header>

      <section class="sec sec--tight">
        <div class="article">
          <p class="lede">#{esc(p['excerpt'])}</p>
          #{render_blocks(p['body'])}
          #{src_link}
        </div>
      </section>
      #{next_card}
    </main>
    #{footer}
    #{shell_scripts("contact")}
    </body>
    </html>
  HTML
end

# ------------------------------------------------------------
# 6. Elenchi
# ------------------------------------------------------------

def post_index(posts, cats)
  # Stessa struttura di postRow() in js/render.js, che è quella
  # con il CSS già calibrato: .brow è la tabola compatta della home,
  # non l'elenco degli articoli.
  rows = posts.map do |p|
    art = Array(p["art"]).join(",")
    <<~HTML
      <li class="post reveal">
        <div>
          <time datetime="#{esc(p['date'])}">#{read_date(p['date'])}</time>
          <h3 data-len="#{title_len(p['title'])}"><a href="/blog/#{p['slug']}/">#{esc(p['title'])}</a></h3>
          <p>#{esc(p['excerpt'])}</p>
        </div>
        <a class="post__thumb" href="/blog/#{p['slug']}/"
           style="background-image:linear-gradient(145deg,#{art})"
           aria-label="#{esc(p['title'])}"></a>
      </li>
    HTML
  end.join("\n")

  <<~HTML
    #{head(title: "Blog — Vincenzo Capasso", desc: "Articoli su advertising, tracking, strategia e creatività: #{posts.length} pezzi scritti da Vincenzo Capasso.", canonical: "#{SITE}/blog/")}
    <main class="page" id="app">
      <header class="pagehead">
        <h1 class="pagehead__title" data-len="1">Blog</h1>
        <p class="pagehead__lede">#{posts.length} articoli su advertising, strategia e creatività.</p>
      </header>
      <section class="sec sec--tight">
        <ul class="posts">#{rows}</ul>
      </section>
    </main>
    #{footer}
    #{shell_scripts("journal")}
    </body>
    </html>
  HTML
end

def project_index(projects, categories)
  cards = projects.map do |p|
    tags = Array(p["cats"]).map { |c| %(<span class="tag">#{esc(c)}</span>) }.join
    <<~HTML
      <a class="pcard reveal" href="/progetti/#{p['slug']}/" data-cats="#{esc(Array(p['cats']).join('|'))}">
        <div class="pcard__media" data-year="#{esc(p['year'])}" style="background-image:#{project_bg(p)}"></div>
        <div class="pcard__body">
          <h3 class="pcard__title" data-len="#{title_len(p['title'])}">#{esc(p['title'])}</h3>
          <p class="pcard__excerpt">#{esc(p['excerpt'])}</p>
          <div class="pcard__cats">#{tags}</div>
          <span class="pcard__cta">Apri progetto</span>
        </div>
      </a>
    HTML
  end.join("\n")

  chips = (["All"] + categories).map do |c|
    %(<button class="chip" data-cat="#{esc(c)}" aria-pressed="#{c == 'All'}">#{esc(c)}</button>)
  end.join("\n    ")

  # Il filtro è in JavaScript, ma le card sono tutte nell'HTML: anche
  # con lo script bloccato i progetti si vedono e Google li legge.
  filter_script = <<~JS
    <script>
    (function () {
      var grid = document.getElementById("grid");
      var chips = document.getElementById("chips");
      var count = document.getElementById("count");
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".pcard"));
      var fromUrl = new URLSearchParams(location.search).get("cat");
      if (!fromUrl) fromUrl = history.replaceState && location.hash.replace(/^#/, "");
      var attivo = fromUrl || "All";

      function filtra(cat) {
        var n = 0;
        cards.forEach(function (c) {
          var cats = (c.getAttribute("data-cats") || "").split("|");
          var mostra = cat === "All" || cats.indexOf(cat) > -1;
          c.hidden = !mostra;
          if (mostra) n++;
        });
        chips.querySelectorAll(".chip").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.cat === cat));
        });
        count.textContent = n === cards.length
          ? cards.length + " progetti"
          : n + " progetti in " + cat;
      }

      chips.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (!b) return;
        filtra(b.dataset.cat);
        history.replaceState(null, "", b.dataset.cat === "All" ? "/progetti/" : "/progetti/?cat=" + encodeURIComponent(b.dataset.cat));
      });

      filtra(attivo);
    })();
    </script>
  JS

  <<~HTML
    #{head(title: "Progetti — Vincenzo Capasso", desc: "Casi di studio su paid media, tracking e marketing automation: #{projects.length} progetti con numeri e metodo.", canonical: "#{SITE}/progetti/")}
    <main class="page" id="app">
      <header class="pagehead">
        <h1 class="pagehead__title" data-len="1">Progetti</h1>
        <p class="pagehead__lede">#{projects.length} casi di studio, con il metodo e i numeri.</p>
      </header>
      <section class="sec sec--tight">
        <div class="chips" id="chips" role="group" aria-label="Filtra i progetti per disciplina">
          #{chips}
        </div>
        <p class="sec__note" id="count" style="margin-bottom:1.5rem">#{projects.length} progetti</p>
        <div class="pgrid" id="grid">#{cards}</div>
      </section>
    </main>
    #{footer}
    #{filter_script}
    #{shell_scripts("projects")}
    </body>
    </html>
  HTML
end

# ------------------------------------------------------------
# 7. Sitemap e robots
# ------------------------------------------------------------

def sitemap(posts, projects)
  today = Time.now.strftime("%Y-%m-%d")
  urls = []
  %w[/ /chi-sono/ /blog/ /progetti/ /contatti/].each do |path|
    urls << { loc: "#{SITE}#{path}", priority: path == "/" ? "1.0" : "0.8", lastmod: today }
  end
  posts.each { |p| urls << { loc: "#{SITE}/blog/#{p['slug']}/", priority: "0.7", lastmod: read_date_iso(p["date"]) } }
  projects.each { |p| urls << { loc: "#{SITE}/progetti/#{p['slug']}/", priority: "0.7", lastmod: today } }

  body = urls.map do |u|
    <<~XML
      <url>
        <loc>#{esc(u[:loc])}</loc>
        <lastmod>#{u[:lastmod]}</lastmod>
        <priority>#{u[:priority]}</priority>
      </url>
    XML
  end.join("\n")

  %(<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n#{body}\n</urlset>\n)
end

def robots
  <<~TXT
    User-agent: *
    Allow: /

    Sitemap: #{SITE}/sitemap.xml
  TXT
end

# ------------------------------------------------------------
# 8. Scrittura
# ------------------------------------------------------------

data = read_data
posts = data["posts"]
projects = data["projects"]

written = []

write = lambda do |rel, content|
  path = File.join(ROOT, rel)
  FileUtils.mkdir_p(File.dirname(path))
  File.write(path, content)
  written << rel
end

posts.each_with_index do |p, i|
  nxt = posts[(i + 1) % posts.length]
  write.call("blog/#{p['slug']}/index.html", post_page(p, nxt))
end
write.call("blog/index.html", post_index(posts, data["categories"]))

projects.each do |p|
  write.call("progetti/#{p['slug']}/index.html", project_page(p, data["categories"]))
end
write.call("progetti/index.html", project_index(projects, data["categories"]))

write.call("chi-sono/index.html", about_page(data))
write.call("contatti/index.html", contact_page(data))

write.call("sitemap.xml", sitemap(posts, projects))
write.call("robots.txt", robots)

puts "#{written.length} file generati (cache-busting v=#{CACHE_BUST}):"
written.each { |w| puts "  #{w}" }