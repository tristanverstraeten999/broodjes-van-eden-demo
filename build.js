#!/usr/bin/env node
/**
 * build.js — index.html voor Broodjes van Eden. Eigen, unieke layout
 * (asymmetrische hero + two-pane menu). Bouw: node build.js
 */
const fs = require("fs");
const path = require("path");
const menu = JSON.parse(fs.readFileSync(path.join(__dirname, "menu.json"), "utf8"));

const ICON = {
  "Broodjes": "🥪", "Smos Broodjes": "🥖", "Speciale broodjes": "⭐", "Croques": "🧀",
  "Koude schotels": "🍱", "Salades": "🥗", "Warme gerechten": "🍽️",
  "Klassieke Snacks": "🌭", "Speciale Snacks": "🔥", "Snacks": "🍗", "Bicky burgers": "🍔",
  "Verse Brochetten": "🍢", "Kroketten": "🥐", "Vegetarische Snacks": "🥦",
  "Frieten": "🍟", "Speciale Frieten": "🍟", "Sauzen": "🥫", "Warme sauzen": "🍯",
  "Frisdranken": "🥤", "Melkdrankjes": "🥛", "Bieren": "🍺",
  "Koffiekoeken": "🥐", "Taartjes": "🍰", "Brownies / Muffins": "🧁",
};
const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const cats = Object.keys(menu);
const totaal = cats.reduce((n, c) => n + menu[c].length, 0);

// uitgelichte items voor de hero-kaart
const feat = (menu["Broodjes"] || cats.map(c => menu[c]).flat()).slice();
const hero1 = feat.find(i => /gezond/i.test(i.naam)) || feat[0];
const hero2 = feat.find(i => /club/i.test(i.naam)) || feat[1];

// linker categorie-nav (verticaal)
const catNav = cats.map((c) => `<a href="#${slug(c)}" class="cnav-item"><span class="ci">${ICON[c] || "🍴"}</span><span class="cn">${esc(c)}</span><span class="cc">${menu[c].length}</span></a>`).join("");

// rechter menu-kolom
const menuMain = cats.map((c, i) => {
  const items = menu[c].map((it) => `
          <li class="item">
            <span class="item-name">${esc(it.naam)}</span>
            <span class="item-dots"></span>
            <span class="item-price">€${esc(it.prijs)}</span>
          </li>`).join("");
  return `
        <section class="cat" id="${slug(c)}">
          <div class="cat-bar"><span class="cat-ico">${ICON[c] || "🍴"}</span><h3>${esc(c)}</h3><span class="cat-n">${String(i + 1).padStart(2, "0")}</span></div>
          <ul class="items">${items}</ul>
        </section>`;
}).join("");

const tickerWords = ["Vers belegd", "Dagverse broodjes", "Knapperige frieten", "Met liefde gemaakt", "Ambachtelijk", "Smos & club", "Tot zo in Wilrijk"];
const ticker = [...tickerWords, ...tickerWords].map((w) => `<span class="tk">${esc(w)}</span><span class="tk-dot">★</span>`).join("");

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Broodjes van Eden — Vers & ambachtelijk in Wilrijk</title>
<meta name="description" content="Broodjes van Eden in Wilrijk: dagverse broodjes, smos, club, croques, frieten, snacks en meer. Vers bereid. Bestel online of kom langs aan het Edenplein.">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap" rel="stylesheet">
<style>
  :root{
    --paper:#FBF0DC; --card:#FFFBF1; --ink:#221A11; --ink-2:#6c5d48; --ink-3:#9b8b72;
    --green:#1E7A47; --green-d:#155C35; --green-soft:#DDEFE0;
    --tomato:#E0492C; --tomato-d:#c23a20; --mustard:#F3B43C;
    --line:rgba(34,26,17,.12); --line-2:rgba(34,26,17,.22);
    --ease:cubic-bezier(.22,.61,.36,1); --spring:cubic-bezier(.34,1.56,.64,1);
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth;scroll-padding-top:140px}
  body{font-family:"DM Sans",system-ui,sans-serif;background:var(--paper);color:var(--ink);line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden;
    background-image:radial-gradient(rgba(34,26,17,.04) 1px,transparent 1px);background-size:22px 22px}
  a{color:inherit;text-decoration:none}
  h1,h2,h3,.dz{font-family:"Bricolage Grotesque",sans-serif;font-weight:800;letter-spacing:-.02em;line-height:1}
  ::selection{background:var(--mustard)}
  ::-webkit-scrollbar{height:8px;width:8px}::-webkit-scrollbar-thumb{background:var(--ink-3);border-radius:8px}

  /* header */
  header{position:sticky;top:0;z-index:50;background:var(--paper);border-bottom:3px solid var(--ink)}
  .bar{display:flex;align-items:center;justify-content:space-between;padding:13px 26px;max-width:1180px;margin:0 auto}
  .logo{display:flex;align-items:center;gap:11px}
  .hdr-logo{height:52px;width:auto;display:block}
  .logo .mark{width:42px;height:42px;border-radius:13px;background:var(--green);color:#fff;display:flex;align-items:center;justify-content:center;font-size:22px;transform:rotate(-6deg);box-shadow:3px 3px 0 var(--ink)}
  .logo .nm{font-family:"Bricolage Grotesque";font-weight:800;font-size:19px;line-height:.95}
  .logo .nm small{display:block;font-family:"DM Sans";font-weight:600;font-size:10px;letter-spacing:2px;color:var(--green);text-transform:uppercase}
  .htop{display:flex;align-items:center;gap:24px;font-weight:600;font-size:14.5px}
  .htop a:not(.order):hover{color:var(--green)}
  .order{background:var(--tomato);color:#fff;padding:11px 20px;border-radius:30px;font-weight:700;font-size:14px;border:2px solid var(--ink);box-shadow:3px 3px 0 var(--ink);transition:.15s var(--ease)}
  .order:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--ink);background:var(--tomato-d)}
  @media(max-width:820px){.htop a:not(.order){display:none}}

  /* ===== ASYMMETRISCHE HERO ===== */
  .hero{max-width:1180px;margin:0 auto;padding:60px 26px 30px}
  .hero-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:54px;align-items:center}
  @media(max-width:900px){.hero-grid{grid-template-columns:1fr;gap:34px}}
  .kick{display:inline-flex;align-items:center;gap:9px;background:var(--card);border:2px solid var(--ink);padding:7px 15px;border-radius:30px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;box-shadow:3px 3px 0 var(--ink);animation:pop .6s var(--spring) both}
  .kick .d{width:8px;height:8px;border-radius:50%;background:var(--tomato);animation:blink 1.5s infinite}
  @keyframes blink{50%{opacity:.3}} @keyframes pop{from{opacity:0;transform:scale(.85)}to{opacity:1}}
  .hero h1{font-size:clamp(46px,7vw,84px);margin:22px 0 0;text-align:left}
  .hero h1 .row{display:block;overflow:hidden}
  .hero h1 .row span{display:inline-block;animation:up .7s var(--ease) both}
  .hero h1 .green{color:var(--green)} .hero h1 .tom{color:var(--tomato)}
  @keyframes up{from{transform:translateY(105%)}to{transform:translateY(0)}}
  .hero p{font-size:clamp(16px,1.8vw,19px);color:var(--ink-2);max-width:440px;margin:24px 0 30px;font-weight:500;animation:fade .8s .5s both}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  .hero-cta{display:flex;gap:13px;flex-wrap:wrap;animation:fade .8s .6s both}
  .btn{display:inline-flex;align-items:center;gap:9px;padding:14px 26px;border-radius:32px;font-weight:700;font-size:15px;cursor:pointer;font-family:inherit;border:2px solid var(--ink);transition:.15s var(--ease)}
  .btn-primary{background:var(--green);color:#fff;box-shadow:4px 4px 0 var(--ink)}
  .btn-primary:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 var(--ink)}
  .btn-primary:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--ink)}
  .btn-ghost{background:var(--card);box-shadow:4px 4px 0 var(--ink)}
  .btn-ghost:hover{transform:translate(-1px,-1px);box-shadow:5px 5px 0 var(--ink)}
  .hero-meta{display:flex;gap:22px;margin-top:34px;flex-wrap:wrap;animation:fade .8s .7s both}
  .hero-meta div b{font-family:"Bricolage Grotesque";font-size:21px;color:var(--ink);display:block}
  .hero-meta div span{font-size:12.5px;font-weight:600;color:var(--ink-2)}

  /* hero visual rechts */
  .hero-visual{position:relative;height:420px}
  @media(max-width:900px){.hero-visual{height:340px}}
  .fcard{position:absolute;background:var(--card);border:3px solid var(--ink);border-radius:20px;padding:18px 20px;box-shadow:6px 6px 0 var(--ink);animation:floaty 7s ease-in-out infinite}
  .fcard .ft{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--tomato)}
  .fcard .fn{font-family:"Bricolage Grotesque";font-weight:800;font-size:19px;margin:3px 0}
  .fcard .fp{font-family:"Bricolage Grotesque";font-weight:800;font-size:22px;color:var(--green)}
  .fcard.a{top:8%;left:2%;transform:rotate(-5deg);width:215px;z-index:3}
  .fcard.b{bottom:6%;right:0;transform:rotate(5deg);width:215px;z-index:3;animation-delay:1.5s}
  .femoji{position:absolute;font-size:62px;filter:drop-shadow(4px 6px 8px rgba(34,26,17,.2));animation:floaty 6s ease-in-out infinite}
  .femoji.e1{top:0;right:24%;animation-delay:.4s} .femoji.e2{bottom:14%;left:14%;font-size:50px;animation-delay:1.1s}
  @keyframes floaty{0%,100%{translate:0 0}50%{translate:0 -14px}}
  .logo-sign{position:absolute;top:48%;left:50%;transform:translate(-50%,-50%) rotate(-3deg);width:90%;background:var(--card);border:3px solid var(--ink);border-radius:24px;padding:30px 26px;box-shadow:8px 8px 0 var(--ink);z-index:2;animation:floaty 8s ease-in-out infinite}
  .logo-sign img{width:100%;display:block}
  .seal{position:absolute;top:38%;left:50%;width:128px;height:128px;margin:-64px 0 0 -64px;z-index:4}
  .seal .ring{width:100%;height:100%;animation:spin 16s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .seal .mid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:34px}
  @media(max-width:520px){.seal{display:none}}

  /* ticker */
  .ticker{background:var(--ink);color:var(--paper);overflow:hidden;white-space:nowrap;padding:11px 0;margin-top:30px;border-top:3px solid var(--ink);border-bottom:3px solid var(--ink)}
  .ticker-track{display:inline-block;animation:scroll 26s linear infinite}
  .ticker:hover .ticker-track{animation-play-state:paused}
  @keyframes scroll{to{transform:translateX(-50%)}}
  .tk{font-family:"Bricolage Grotesque";font-weight:700;font-size:15px;text-transform:uppercase;padding:0 6px}
  .tk-dot{padding:0 16px;color:var(--mustard)}

  /* ===== TWO-PANE MENU ===== */
  .menu{max-width:1180px;margin:0 auto;padding:64px 26px 40px}
  .lead{display:flex;align-items:flex-start;gap:18px;margin-bottom:34px}
  .lead .bignum{font-family:"Bricolage Grotesque";font-weight:800;font-size:clamp(40px,6vw,72px);color:var(--mustard);line-height:.8;-webkit-text-stroke:2px var(--ink)}
  .lead .kick2{display:inline-block;background:var(--tomato);color:#fff;font-weight:700;font-size:12px;letter-spacing:1px;text-transform:uppercase;padding:5px 13px;border-radius:20px;border:2px solid var(--ink)}
  .lead h2{font-size:clamp(32px,5vw,54px);margin-top:10px}
  .layout{display:grid;grid-template-columns:248px 1fr;gap:40px;align-items:start}
  @media(max-width:820px){.layout{grid-template-columns:1fr;gap:18px}}
  .cnav{position:sticky;top:96px;display:flex;flex-direction:column;gap:3px;max-height:calc(100vh - 120px);overflow-y:auto;padding-right:4px}
  .cnav::-webkit-scrollbar{width:5px}
  .cnav-item{display:flex;align-items:center;gap:11px;padding:9px 13px;border-radius:12px;font-weight:600;font-size:14px;color:var(--ink-2);border:2px solid transparent;transition:.14s var(--ease)}
  .cnav-item .ci{font-size:16px;width:20px;text-align:center}
  .cnav-item .cn{flex:1}
  .cnav-item .cc{font-size:11px;font-weight:700;color:var(--ink-3)}
  .cnav-item:hover{background:var(--card);color:var(--ink)}
  .cnav-item.active{background:var(--green);color:#fff;border-color:var(--ink);box-shadow:3px 3px 0 var(--ink)}
  .cnav-item.active .cc{color:#bfe6cb}
  @media(max-width:820px){
    .cnav{position:sticky;top:75px;z-index:20;flex-direction:row;overflow-x:auto;background:var(--paper);padding:10px 0;border-bottom:2px solid var(--ink);max-height:none}
    .cnav-item{white-space:nowrap;border:2px solid var(--ink);background:var(--card)}
    .cnav-item .cn{flex:none}.cnav-item .cc{display:none}
  }
  .menu-main{min-width:0}
  .cat{display:none;scroll-margin-top:150px}
  .cat.show{display:block;animation:catin .4s var(--ease)}
  @keyframes catin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .cat-bar{display:flex;align-items:center;gap:12px;padding-bottom:13px;margin-bottom:8px;border-bottom:3px solid var(--ink)}
  .cat-ico{width:44px;height:44px;border-radius:13px;background:var(--green-soft);border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font-size:23px;transform:rotate(-4deg)}
  .cat-bar h3{font-size:26px;flex:1}
  .cat-n{font-family:"Bricolage Grotesque";font-weight:800;font-size:22px;color:var(--mustard);-webkit-text-stroke:1.5px var(--ink)}
  .items{list-style:none;columns:260px;column-gap:46px}
  .item{display:flex;align-items:flex-end;gap:8px;padding:11px 10px;border-radius:10px;break-inside:avoid;transition:background .14s var(--ease),transform .14s var(--ease)}
  .item:hover{background:var(--green-soft);transform:translateX(3px)}
  .item-name{font-weight:600;font-size:15px}
  .item-dots{flex:1;border-bottom:2px dotted var(--line-2);transform:translateY(-4px);min-width:14px}
  .item-price{font-family:"Bricolage Grotesque";font-weight:700;font-size:15.5px;color:var(--green-d);white-space:nowrap}

  /* info — overlappende band */
  .info{max-width:1180px;margin:30px auto;padding:0 26px}
  .info-inner{background:var(--green);border:3px solid var(--ink);border-radius:26px;box-shadow:8px 8px 0 var(--ink);padding:44px;display:grid;grid-template-columns:1fr 1fr;gap:36px;color:#fff}
  @media(max-width:760px){.info-inner{grid-template-columns:1fr;padding:30px}}
  .info-inner h2{font-size:32px;grid-column:1/-1;margin-bottom:6px}
  .info-block h4{font-family:"Bricolage Grotesque";font-size:16px;text-transform:uppercase;letter-spacing:1px;color:var(--mustard);margin-bottom:14px}
  .hours{list-style:none}
  .hours li{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.18);font-size:15px;font-weight:500}
  .hours li:last-child{border:0}.hours .cl{color:var(--mustard);font-weight:700}
  .addr{font-size:16px;line-height:1.9;color:#dcefe1;font-weight:500}
  .addr .big{font-family:"Bricolage Grotesque";font-size:24px;color:#fff;font-weight:800;display:block;margin-bottom:6px}
  .maplink{display:inline-flex;gap:8px;margin-top:16px;background:#fff;color:var(--green-d);font-weight:700;padding:11px 18px;border-radius:24px;border:2px solid var(--ink);box-shadow:3px 3px 0 var(--ink);font-size:14px;transition:.15s var(--ease)}
  .maplink:hover{transform:translate(-1px,-1px);box-shadow:4px 4px 0 var(--ink)}

  /* cta */
  .cta{max-width:1180px;margin:60px auto 90px;padding:0 26px}
  .cta-band{background:var(--tomato);border:3px solid var(--ink);border-radius:28px;padding:54px 30px;color:#fff;box-shadow:9px 9px 0 var(--ink);text-align:center;position:relative;overflow:hidden}
  .cta-band::after{content:"🍟🥪🍔🥖🧀";position:absolute;bottom:-6px;right:18px;font-size:38px;opacity:.22;letter-spacing:7px}
  .cta-band h2{font-size:clamp(30px,4.5vw,46px);margin-bottom:12px}
  .cta-band p{font-size:17px;margin-bottom:26px;font-weight:500;opacity:.95}
  .cta-band .btn{background:#fff;color:var(--tomato-d)}

  footer{background:var(--ink);color:#e9ddc9;padding:44px 0;text-align:center}
  footer .ft-logo{height:92px;width:auto;display:block;margin:0 auto 10px}
  footer .cr{margin-top:14px;font-size:12.5px;opacity:.6}

  .reveal{opacity:0;transform:translateY(26px);transition:.6s var(--ease)}
  .reveal.in{opacity:1;transform:none}
  @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.reveal{opacity:1;transform:none}}
</style>
</head>
<body>

<header>
  <div class="bar">
    <a href="#top" class="logo"><img src="logo-dark.png" class="hdr-logo" alt="Broodjes van Eden — Wilrijk"></a>
    <nav class="htop">
      <a href="#menu">Menu</a><a href="#info">Openingsuren</a><a href="#info">Locatie</a>
      <a href="https://www.one2three.app/broodjesvaneden/menu" class="order">Bestel online →</a>
    </nav>
  </div>
</header>

<a id="top"></a>
<section class="hero">
  <div class="hero-grid">
    <div class="hero-left">
      <span class="kick"><span class="d"></span>Broodjeszaak · Edenplein, Wilrijk</span>
      <h1>
        <span class="row"><span style="animation-delay:.05s">Dagvers.</span></span>
        <span class="row"><span class="green" style="animation-delay:.15s">Ambachtelijk.</span></span>
        <span class="row"><span class="tom" style="animation-delay:.25s">Gewoon lekker.</span></span>
      </h1>
      <p>Verse broodjes, smos, club & croques — plus knapperige frieten en snacks. Elke dag met liefde klaargemaakt.</p>
      <div class="hero-cta">
        <a href="#menu" class="btn btn-primary">🍽️ Bekijk de kaart</a>
        <a href="https://www.one2three.app/broodjesvaneden/menu" class="btn btn-ghost">Bestel online</a>
      </div>
      <div class="hero-meta">
        <div><b>${totaal}+</b><span>gerechten</span></div>
        <div><b>100%</b><span>vers bereid</span></div>
        <div><b>Ma–Vr</b><span>07:30–15:00</span></div>
      </div>
    </div>
    <div class="hero-visual">
      <span class="femoji e1">🥪</span><span class="femoji e2">🍟</span>
      <div class="logo-sign"><img src="logo-dark.png" alt="Broodjes van Eden"></div>
      <div class="fcard b"><div class="ft">Populair</div><div class="fn">${esc(hero1 ? hero1.naam : "Broodje gezond")}</div><div class="fp">€${esc(hero1 ? hero1.prijs : "3.60")}</div></div>
    </div>
  </div>
</section>

<div class="ticker"><div class="ticker-track">${ticker}</div></div>

<div class="menu" id="menu">
  <div class="lead reveal">
    <span class="bignum">01</span>
    <div><span class="kick2">Onze kaart</span><h2>Wat lust je vandaag?</h2></div>
  </div>
  <div class="layout">
    <nav class="cnav">${catNav}</nav>
    <div class="menu-main">${menuMain}</div>
  </div>
</div>

<section class="info" id="info">
  <div class="info-inner reveal">
    <h2>Kom langs in Wilrijk</h2>
    <div class="info-block">
      <h4>⏰ Openingsuren</h4>
      <ul class="hours">
        <li><b>Maandag</b><span>07:30 – 15:00</span></li>
        <li><b>Dinsdag</b><span>07:30 – 15:00</span></li>
        <li><b>Woensdag</b><span>07:30 – 15:00</span></li>
        <li><b>Donderdag</b><span>07:30 – 15:00</span></li>
        <li><b>Vrijdag</b><span>07:30 – 14:30</span></li>
        <li><b>Zaterdag</b><span class="cl">Gesloten</span></li>
        <li><b>Zondag</b><span class="cl">Gesloten</span></li>
      </ul>
    </div>
    <div class="info-block">
      <h4>📍 Locatie</h4>
      <div class="addr"><span class="big">Broodjes van Eden</span>Edenplein 15<br>2610 Wilrijk<br>België</div>
      <a class="maplink" href="https://www.google.com/maps/search/?api=1&query=Edenplein+15+2610+Wilrijk" target="_blank">🗺️ Open in Maps</a>
    </div>
  </div>
</section>

<div class="cta">
  <div class="cta-band reveal">
    <h2>Honger gekregen?</h2>
    <p>Bestel in een paar klikken online — klaar wanneer jij langskomt.</p>
    <a href="https://www.one2three.app/broodjesvaneden/menu" class="btn">🛒 Bestel nu online</a>
  </div>
</div>

<footer>
  <div class="wrap">
    <img src="logo-white.png" class="ft-logo" alt="Broodjes van Eden">
    <div>Edenplein 15, 2610 Wilrijk · Ma–Vr geopend</div>
    <div class="cr">Website ontworpen door Tristan Webstudio</div>
  </div>
</footer>

<script>
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.1});
  document.querySelectorAll(".reveal").forEach(e=>io.observe(e));

  // Categorie-filter: toon één categorie tegelijk (veel minder scrollen)
  const navItems=[...document.querySelectorAll(".cnav-item")];
  const sections=[...document.querySelectorAll(".cat")];
  function toon(id,scroll){
    sections.forEach(s=>s.classList.toggle("show",s.id===id));
    navItems.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id));
    if(scroll){const t=document.querySelector(".layout");if(t)t.scrollIntoView({behavior:"smooth",block:"start"});}
  }
  navItems.forEach(a=>a.addEventListener("click",e=>{e.preventDefault();toon(a.getAttribute("href").slice(1),true);}));
  if(sections[0])toon(sections[0].id,false);   // eerste categorie standaard tonen
</script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log(`✅ index.html herbouwd (nieuwe layout) — ${cats.length} categorieën, ${totaal} gerechten.`);
