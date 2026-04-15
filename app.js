/* De Broad Street Zaak — app logic. M2: happy path. */

const DATA_FILES = {
  deaths: "data/snow-deaths.json",
  pumps: "data/snow-pumps.json",
  streets: "data/snow-streets.json",
  poi: "data/soho-poi.json",
  density: "data/soho-density.json",
  timeline: "data/outbreak-timeline.json",
  menu: "content/menu-content.json",
  rh_causes: "data/red-herring-causes.json",
  rh_demographics: "data/red-herring-demographics.json",
  rh_previous: "data/red-herring-previous-outbreaks.json",
  rh_europe: "data/red-herring-europe.json",
  rh_class: "data/red-herring-class.json",
  rh_water: "data/red-herring-water-analysis.json",
  rh_pumps_test: "data/red-herring-other-pumps.json",
};

const DEATHS_PER_DAY_ADVANCE = {
  2: 85, 3: 120, 4: 110, 5: 80, 6: 55, 7: 35, 8: 25, 9: 18, 10: 12,
};
const START_DEATHS = 56;

const SVG_NS = "http://www.w3.org/2000/svg";

const state = {
  data: null,
  day: 1,
  deaths: START_DEATHS,
  unlockedLayers: new Set(),
  currentStageIdx: 0,
  chosenOptions: [],       // volgorde van keuzes = volgorde van tabbladen
  activeTabId: null,       // id van momenteel geopend tabblad
  menuOpen: true,          // true = menu uitgeklapt, false = ingeklapt
  endChoice: null,
};

function setMenuOpen(open) {
  state.menuOpen = open;
  const block = $("menu-block");
  if (!block) return;
  block.classList.toggle("menu-open", open);
  block.classList.toggle("menu-collapsed", !open);
  const toggle = $("menu-toggle");
  if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
}

// Subset van sterfgevallen die tot NU toe zijn gevallen. snow-deaths.json
// is gesorteerd op datum, dus slice(0, state.deaths) geeft de correcte
// historisch-plausibele snapshot op elke spel-dag.
function deathsSoFar() {
  return state.data.deaths.slice(0, state.deaths);
}

async function loadData() {
  const entries = await Promise.all(
    Object.entries(DATA_FILES).map(async ([k, path]) => {
      const r = await fetch(path);
      if (!r.ok) throw new Error(`failed to load ${path}: ${r.status}`);
      return [k, await r.json()];
    })
  );
  return Object.fromEntries(entries);
}

/* ---------- DOM helpers ---------- */

function $(id) { return document.getElementById(id); }

function html(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function svg(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}

function svgText(tag, attrs, text) {
  const node = svg(tag, attrs);
  node.textContent = text;
  return node;
}

function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

function replaceChildren(node, ...kids) {
  clear(node);
  for (const k of kids.flat()) if (k) node.appendChild(k);
}

/* ---------- Rendering ---------- */

function updateDashboard() {
  const dayEl = $("day-value");
  const deathsEl = $("deaths-value");
  const oldDay = dayEl.textContent;
  const newDay = String(state.day);
  dayEl.textContent = newDay;
  deathsEl.textContent = String(state.deaths);
  const remaining = Math.max(0, state.data.menu.hardStopDay - state.day);
  $("remaining-value").textContent = String(remaining);
  if (oldDay !== newDay) {
    for (const el of [dayEl, deathsEl]) {
      el.classList.remove("flash");
      void el.offsetWidth; // retrigger animation
      el.classList.add("flash");
    }
  }
}

function renderStreets() {
  const g = $("layer-streets");
  clear(g);
  for (const pl of state.data.streets.polylines) {
    const pts = pl.points.map(([x, y]) => `${x},${y}`).join(" ");
    g.appendChild(svg("polyline", { points: pts, class: "street-line" }));
  }
}

function renderDeaths() {
  const g = $("layer-deaths");
  clear(g);
  if (!state.unlockedLayers.has("deaths")) return;
  for (const d of deathsSoFar()) {
    g.appendChild(svg("circle", { cx: d.x, cy: d.y, r: 4, class: "death-dot" }));
  }
  // Hampstead marker als die is vrijgespeeld
  if (state.unlockedLayers.has("hampstead")) {
    g.appendChild(svg("circle", { cx: 60, cy: 40, r: 6, fill: "#8b2a1f", stroke: "#3a0f0a", "stroke-width": 1.5 }));
    g.appendChild(svgText("text", { x: 75, y: 45, class: "pump-label" }, "Mevr. Eley, Hampstead"));
  }
}

function renderPumps() {
  const g = $("layer-pumps");
  clear(g);
  for (const p of state.data.pumps) {
    g.appendChild(svg("rect", {
      x: p.x - 7, y: p.y - 7, width: 14, height: 14,
      class: p.isBroadStreet ? "pump-marker broad" : "pump-marker",
    }));
    if (p.isBroadStreet) {
      g.appendChild(svgText("text", { x: p.x + 12, y: p.y + 4, class: "pump-label" }, p.name));
    }
  }
}

function poiMarker(category, x, y) {
  // Elk POI-type krijgt een eigen vorm + verzadigde kleur, herkenbaar op afstand.
  const specs = {
    schools: { color: "#2d7a2d", shape: "triangle" },       // groen driehoek
    workhouses: { color: "#c9a227", shape: "diamond" },     // geel diamant
    markets: { color: "#b5651d", shape: "triangle-down" },  // bruin omgekeerde driehoek
    slaughterhouses: { color: "#6a1b9a", shape: "cross" },  // paars kruis
    breweries: { color: "#3a7a9a", shape: "hex" },          // blauwgroen zeshoek
  };
  const { color, shape } = specs[category] || { color: "#333", shape: "triangle" };
  const r = 11;

  if (shape === "triangle") {
    return svg("polygon", {
      points: `${x},${y - r} ${x + r * 0.9},${y + r * 0.6} ${x - r * 0.9},${y + r * 0.6}`,
      fill: color, stroke: "#fff", "stroke-width": 1.5,
    });
  }
  if (shape === "triangle-down") {
    return svg("polygon", {
      points: `${x},${y + r} ${x + r * 0.9},${y - r * 0.6} ${x - r * 0.9},${y - r * 0.6}`,
      fill: color, stroke: "#fff", "stroke-width": 1.5,
    });
  }
  if (shape === "diamond") {
    return svg("polygon", {
      points: `${x},${y - r} ${x + r * 0.9},${y} ${x},${y + r} ${x - r * 0.9},${y}`,
      fill: color, stroke: "#3b2f1e", "stroke-width": 1.5,
    });
  }
  if (shape === "cross") {
    // Rood kruis: twee gekruiste rechthoeken
    const group = svg("g", {});
    const arm = 2.5;
    group.appendChild(svg("rect", { x: x - r, y: y - arm, width: r * 2, height: arm * 2, fill: color, stroke: "#fff", "stroke-width": 1 }));
    group.appendChild(svg("rect", { x: x - arm, y: y - r, width: arm * 2, height: r * 2, fill: color, stroke: "#fff", "stroke-width": 1 }));
    return group;
  }
  if (shape === "hex") {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      pts.push(`${(x + r * Math.cos(a)).toFixed(1)},${(y + r * Math.sin(a)).toFixed(1)}`);
    }
    return svg("polygon", { points: pts.join(" "), fill: color, stroke: "#fff", "stroke-width": 1.5 });
  }
}

function renderPOI(category) {
  const g = $("layer-poi");
  const items = state.data.poi[category] || [];
  for (const it of items) {
    const marker = poiMarker(category, it.x, it.y);
    marker.setAttribute("data-poi-category", category);
    marker.setAttribute("class", "poi-marker");
    g.appendChild(marker);
    g.appendChild(svgText("text", { x: it.x + 12, y: it.y + 5, class: "pump-label" }, it.name));
  }
}

function renderDensity() {
  const g = $("layer-density");
  clear(g);
  for (const cell of state.data.density) {
    const opacity = Math.min(0.6, (cell.density - 60) / 200);
    if (opacity <= 0) continue;
    g.appendChild(svg("rect", {
      x: cell.x - 32, y: cell.y - 32, width: 64, height: 64,
      class: "density-cell", opacity: opacity.toFixed(2),
    }));
  }
}

function renderMenu() {
  const menu = $("menu");
  clear(menu);
  const stage = state.data.menu.stages[state.currentStageIdx];
  if (!stage) return;
  $("menu-prompt").textContent = stage.isFinal ? "Uw eindbesluit, assistent." : "Wat heb je nu nodig, assistent?";

  const options = MODE_M2_ONLY_KEY_CHOICES
    ? stage.options.filter(o => o.keyChoice)
    : stage.options;

  for (const opt of options) {
    const btn = html("button", {
      class: "menu-btn",
      onclick: () => handleChoice(opt),
    }, opt.label);
    if (state.chosenOptions.includes(opt.id)) btn.setAttribute("disabled", "");
    menu.appendChild(btn);
  }
}

function renderTabs() {
  const tabs = $("tabs");
  clear(tabs);
  const allOpts = state.data.menu.stages.flatMap(s => s.options);
  for (const id of state.chosenOptions) {
    const opt = allOpts.find(o => o.id === id);
    if (!opt) continue;
    const isActive = id === state.activeTabId;
    const label = opt.label.length > 28 ? opt.label.slice(0, 26) + "…" : opt.label;
    const btn = html("button", {
      class: "tab" + (isActive ? " active" : ""),
      title: opt.label,
      role: "tab",
      "aria-selected": isActive ? "true" : "false",
      onclick: () => {
        state.activeTabId = id;
        const viz = vizHandlers()[opt.viz];
        if (viz) viz();
        renderTabs();
      },
    }, label);
    tabs.appendChild(btn);
  }
}

function setPlaceholderVisible(v) {
  $("map-placeholder").style.display = v ? "flex" : "none";
  $("map-svg").style.visibility = v ? "hidden" : "visible";
}

function render() {
  updateDashboard();
  renderDeaths();
  renderMenu();
  renderTabs();
  setPlaceholderVisible(!state.unlockedLayers.has("map"));
}

/* ---------- Viz builders (DOM, geen innerHTML) ---------- */

function showVizNode(title, ...contentNodes) {
  const panel = $("viz");
  panel.classList.remove("hidden");
  clear(panel);
  if (title) panel.appendChild(html("h3", { text: title }));
  for (const c of contentNodes) if (c) panel.appendChild(c);
}

function tableNode(rows, cols, headers) {
  if (!rows || !rows.length) return html("p", { text: "Geen data." });
  const thead = html("thead", {},
    html("tr", {}, ...cols.map((c, i) => html("th", { text: headers?.[i] ?? c })))
  );
  const tbody = html("tbody", {},
    ...rows.map(r => html("tr", {}, ...cols.map(c => html("td", { text: String(r[c] ?? "") }))))
  );
  return html("table", {}, thead, tbody);
}

function addressTableNode(deaths, sorted) {
  const rows = sorted ? [...deaths].sort((a, b) => a.address.localeCompare(b.address)) : deaths;
  const shown = rows.slice(0, 60);
  const table = tableNode(
    shown.map(d => ({ Naam: d.name, Adres: d.address, Datum: d.date })),
    ["Naam", "Adres", "Datum"],
  );
  const scroll = html("div", { class: "scroll-rows" }, table);
  const note = html("p", {}, html("em", { text: `Eerste 60 van ${deaths.length} regels getoond.` }));
  return html("div", {}, scroll, note);
}

function demographicsChartNode(rows) {
  // Horizontale staafdiagram per leeftijdsgroep, M/F gestapeld naast elkaar.
  const width = 360, rowH = 22, pad = 70;
  const groups = [...new Set(rows.map(r => r.ageRange))];
  const max = Math.max(...rows.map(r => r.count));
  const height = groups.length * rowH * 2 + 30;
  const root = svg("svg", { viewBox: `0 0 ${width} ${height}`, width: "100%" });

  let y = 10;
  for (const age of groups) {
    for (const g of ["M", "F"]) {
      const row = rows.find(r => r.ageRange === age && r.gender === g);
      if (!row) continue;
      const barW = (row.count / max) * (width - pad - 40);
      root.appendChild(svgText("text", { x: 0, y: y + 14, "font-size": 11, fill: "#6b5a3e" }, `${age} ${g}`));
      root.appendChild(svg("rect", { x: pad, y, width: barW, height: rowH - 4, fill: g === "M" ? "#8b2a1f" : "#b9583f", opacity: 0.85 }));
      root.appendChild(svgText("text", { x: pad + barW + 4, y: y + 14, "font-size": 11, fill: "#3b2f1e" }, String(row.count)));
      y += rowH;
    }
    y += 4;
  }
  const cap = html("p", {}, html("em", { text: `Totaal ${rows.reduce((s, r) => s + r.count, 0)} sterfgevallen, gecategoriseerd naar leeftijd en geslacht.` }));
  return html("div", {}, root, cap);
}

function europeMapNode(rows) {
  // Schematische Europa-kaart met city-markers. Grove geografische posities.
  const cities = {
    Paris: { x: 200, y: 200 },
    Hamburg: { x: 280, y: 130 },
    Naples: { x: 330, y: 300 },
    Copenhagen: { x: 290, y: 90 },
    London: { x: 180, y: 140 },
  };
  const w = 480, h = 360;
  const root = svg("svg", { viewBox: `0 0 ${w} ${h}`, width: "100%" });
  // Achtergrond
  root.appendChild(svg("rect", { width: w, height: h, fill: "#ede3c9" }));
  // Grove landgrenzen (gestileerd silhouet Europa)
  const europeShape = "M60,220 L120,180 L150,150 L180,130 L210,110 L260,100 L300,80 L340,90 L390,120 L420,170 L430,230 L410,280 L380,310 L340,330 L290,340 L240,335 L200,320 L160,290 L120,260 Z";
  root.appendChild(svg("path", { d: europeShape, fill: "#f4ecd8", stroke: "#6b5a3e", "stroke-width": 1.5, opacity: 0.9 }));
  // Londen als referentie
  root.appendChild(svg("circle", { cx: cities.London.x, cy: cities.London.y, r: 5, fill: "#1e3a5f", stroke: "#fff", "stroke-width": 1.5 }));
  root.appendChild(svgText("text", { x: cities.London.x + 8, y: cities.London.y + 4, "font-size": 11, fill: "#1e3a5f", "font-weight": "bold" }, "London (Soho)"));
  for (const row of rows) {
    const pos = cities[row.city];
    if (!pos) continue;
    const r = Math.max(4, Math.sqrt(row.deaths) / 10);
    root.appendChild(svg("circle", {
      cx: pos.x, cy: pos.y, r, fill: "#8b2a1f", stroke: "#3a0f0a", "stroke-width": 1, opacity: 0.8,
    }));
    root.appendChild(svgText("text", { x: pos.x + r + 4, y: pos.y + 4, "font-size": 11, fill: "#3b2f1e" }, `${row.city} (${row.deaths})`));
  }
  const caption = html("p", {}, html("em", { text: "Cirkel-oppervlak proportioneel aan dodental. Cholera-uitbraken in 1853-1854 volgden geen geografisch patroon onderling — elke stad had zijn eigen bronnen." }));
  return html("div", {}, root, caption);
}

function parishNode(deaths) {
  const counts = {};
  for (const d of deaths) {
    const street = d.address.split(" ").slice(1).join(" ");
    counts[street] = (counts[street] || 0) + 1;
  }
  const rows = Object.entries(counts)
    .map(([street, count]) => ({ street, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  return tableNode(rows, ["street", "count"], ["Straat", "Aantal"]);
}

function computeDemographics(deaths) {
  const bins = [[0, 5], [6, 14], [15, 29], [30, 44], [45, 59], [60, 999]];
  const out = [];
  for (const [lo, hi] of bins) {
    for (const g of ["M", "F"]) {
      const count = deaths.filter(d => d.age >= lo && d.age <= hi && d.gender === g).length;
      out.push({ ageRange: hi < 999 ? `${lo}-${hi}` : `${lo}+`, gender: g, count });
    }
  }
  return out;
}

function computeClasses(deaths) {
  const counts = {};
  for (const d of deaths) counts[d.class] = (counts[d.class] || 0) + 1;
  // Behoud originele volgorde uit CLASS_BASE voor herkenbare tabel
  const order = ["Ambachtsman", "Dagloner", "Dienstbode", "Winkelier", "Geestelijke", "Gegoede burger", "Onbekend"];
  return order.filter(c => counts[c]).map(c => ({ class: c, count: counts[c] }));
}

function computeCauses(soFar, totalAll, ref) {
  const scale = totalAll > 0 ? soFar / totalAll : 0;
  return ref.map(row =>
    row.cause.startsWith("Cholera")
      ? { cause: row.cause, count: soFar }
      : { cause: row.cause, count: Math.round(row.count * scale) }
  );
}

function narrativeNode(paragraphs, findings = []) {
  const wrap = html("div", { class: "viz-narrative" });
  for (const f of findings) wrap.appendChild(html("div", { class: "finding" }, f));
  for (const p of paragraphs) wrap.appendChild(html("p", {}, p));
  return wrap;
}

function waterAnalysisNode(w) {
  const findings = w.findings.map(f => document.createTextNode(f));
  const wrap = html("div", { class: "viz-narrative" });
  wrap.appendChild(html("p", {}, html("strong", { text: "Bron: " }), w.source));
  wrap.appendChild(html("p", {}, html("strong", { text: "Analist: " }), w.analyst));
  for (const f of w.findings) wrap.appendChild(html("div", { class: "finding", text: f }));
  wrap.appendChild(html("p", {}, html("em", { text: w.conclusion_1854 })));
  return wrap;
}

function interviewsNode() {
  const brewery = html("div", { class: "finding" },
    html("strong", { text: "Lion Brewery, Huggins & Co. " }),
    "— 70+ arbeiders wonen in het cluster. Niemand ziek. ",
    html("em", { text: "\"Wij drinken alleen ons eigen bier,\"" }),
    " zegt de meester-brouwer. ",
    html("em", { text: "\"Het water uit de pomp raken we niet aan.\"" })
  );
  const workhouse = html("div", { class: "finding" },
    html("strong", { text: "St James's Workhouse, Poland Street " }),
    "— 535 bewoners midden in het cluster. Slechts 5 sterfgevallen. Het werkhuis heeft een ",
    html("em", { text: "eigen bron" }),
    " in de kelder; geen water van Broad Street."
  );
  return html("div", { class: "viz-narrative" }, brewery, workhouse);
}

function hampsteadNode() {
  const eley = html("div", { class: "finding" },
    html("strong", { text: "Mevrouw Susannah Eley" }),
    ", Hampstead — ver buiten Soho. Overleden 2 september. Onderzoek wijst uit: zij had haar knecht elke dag een fles water laten halen uit de Broad Street pomp, ",
    html("em", { text: "\"omdat zij vroeger in Soho woonde en de smaak gewend was.\"" })
  );
  return html("div", { class: "viz-narrative" },
    eley,
    html("p", { text: "Haar nicht, die bij haar op bezoek kwam en van datzelfde water dronk, stierf een dag later. Geen andere sterfgevallen in Hampstead." }),
    html("p", {}, html("em", { text: "Het sterftepatroon volgt dus het water, niet de wijk." }))
  );
}

function boardMeetingNode() {
  return html("div", { class: "viz-narrative" },
    html("p", { text: "Vergaderzaal van de Board of Guardians, St James's Parish. Zeven heren rond een eikenhouten tafel." }),
    html("p", { text: "U presenteert de kaart. Het cluster rond de pomp. De anomalieën bij de brouwerij en het werkhuis. Mevrouw Eley in Hampstead." }),
    html("p", {}, "Stilte. Dan de voorzitter: ",
      html("em", { text: "\"Jongeman, u vraagt ons een publieke waterbron uit te schakelen op grond van stippen op een kaart. Zonder bewezen mechanisme. Zonder microscopisch bewijs.\"" })
    ),
    html("p", { text: "Uw laatste beslissing wacht." })
  );
}

function lancetNode() {
  return html("div", { class: "viz-narrative" },
    html("p", {}, "Publicatie-traject in ", html("em", { text: "The Lancet" }),
      ": peer review (4 weken), revisie (2 weken), drukwerk (3 weken). Verwachte verschijning: eind november. De uitbraak woedt nu.")
  );
}

function moreDataNode() {
  return html("div", { class: "viz-narrative" },
    html("p", { text: "Data-verzameling loopt. Statistische significantie wordt verwacht binnen 3 weken. Sterfgevallen in die periode: geschat 200-400." })
  );
}

function pamphletNode() {
  return html("div", { class: "viz-narrative" },
    html("p", { text: "Pamfletten verspreid. Geletterden lezen de waarschuwing; analfabeten niet. Circa 40% van Soho bereikt. Broad Street pomp blijft operationeel." })
  );
}

/* ---------- Viz dispatch ---------- */

const MODE_M2_ONLY_KEY_CHOICES = false;

function vizHandlers() {
  const d = state.data;
  return {
    causesTable: () => showVizNode(
      "Doodsoorzaken (gemeld tot nu)",
      tableNode(computeCauses(state.deaths, d.deaths.length, d.rh_causes), ["cause", "count"], ["Doodsoorzaak", "Aantal"]),
    ),
    demographicsChart: () => showVizNode(
      "Demografie (slachtoffers tot nu)",
      demographicsChartNode(computeDemographics(deathsSoFar())),
    ),
    previousOutbreaksTable: () => showVizNode("Eerdere uitbraken", tableNode(d.rh_previous, ["year", "city", "deaths", "duration_weeks"], ["Jaar", "Stad", "Doden", "Duur (wk)"])),
    europeMap: () => showVizNode("Cholera elders in Europa 1854", europeMapNode(d.rh_europe)),
    addressesTable: () => showVizNode(
      `Namen en adressen (${state.deaths} tot nu)`,
      addressTableNode(deathsSoFar(), false),
    ),

    addressesTableSorted: () => showVizNode(
      "Adressen alfabetisch (tot nu)",
      addressTableNode(deathsSoFar(), true),
    ),
    parishGrouping: () => showVizNode("Gegroepeerd per parochie (tot nu)", parishNode(deathsSoFar())),
    classTable: () => showVizNode(
      "Beroep / sociale klasse (tot nu)",
      tableNode(computeClasses(deathsSoFar()), ["class", "count"], ["Klasse", "Aantal"]),
    ),
    mapDeaths: () => {
      state.unlockedLayers.add("map");
      state.unlockedLayers.add("deaths");
      renderDeaths();
      showVizNode("Kaart van Londen — Soho",
        html("p", { text: `Alle ${state.deaths} tot nu toe gemelde sterfgevallen zijn op de kaart van Soho geplot.` })
      );
    },

    mapDensity: () => {
      state.unlockedLayers.add("density"); renderDensity();
      showVizNode("Bevolkingsdichtheid Soho", html("p", { text: "Bevolkingsdichtheid-laag toegevoegd aan de kaart." }));
    },
    mapSchools: () => {
      state.unlockedLayers.add("poi_schools"); renderPOI("schools");
      showVizNode("Scholen in Soho", html("p", { text: "Scholen gemarkeerd op de kaart." }));
    },
    mapMarkets: () => {
      state.unlockedLayers.add("poi_markets"); renderPOI("markets"); renderPOI("slaughterhouses");
      showVizNode("Markten en slachthuizen", html("p", { text: "Markten en slachthuizen gemarkeerd (miasma-verdachte locaties)." }));
    },
    mapWorkhouses: () => {
      state.unlockedLayers.add("poi_workhouses"); renderPOI("workhouses");
      showVizNode("Werkhuizen", html("p", { text: "Werkhuizen en armenhuizen gemarkeerd." }));
    },
    mapPumps: () => {
      state.unlockedLayers.add("pumps"); renderPumps();
      showVizNode("Waterpompen Soho", html("p", { text: "De 13 waterpompen in de buurt staan nu op de kaart." }));
    },

    waterAnalysisPanel: () => showVizNode("Analyse pompwater", waterAnalysisNode(d.rh_water)),
    otherPumpsTable: () => showVizNode("Andere pompen getest", tableNode(d.rh_pumps_test, ["pump", "result"], ["Pomp", "Resultaat"])),
    interviewsPanel: () => {
      state.unlockedLayers.add("poi_breweries"); renderPOI("breweries");
      showVizNode("Interviews in het cluster", interviewsNode());
    },
    hampsteadPanel: () => {
      state.unlockedLayers.add("hampstead"); renderDeaths();
      showVizNode("Sterfgeval buiten Soho", hampsteadNode());
    },

    lancetPreview: () => showVizNode("Publicatie in The Lancet", lancetNode()),
    moreDataProgress: () => showVizNode("Meer data verzamelen", moreDataNode()),
    pamphletResults: () => showVizNode("Pamflet-verspreiding", pamphletNode()),
    boardMeeting: () => showVizNode("Board of Guardians", boardMeetingNode()),

    endingSuccess: () => showEnding("handleRemoved"),
    endingFailure: () => showEnding("moreEvidence"),
  };
}

/* ---------- Ending ---------- */

function mapSnapshotNode(snowStyle = false) {
  const s = svg("svg", { viewBox: "0 0 1024 768", xmlns: SVG_NS });
  s.appendChild(svg("rect", { width: 1024, height: 768, fill: "#f4ecd8" }));
  for (const pl of state.data.streets.polylines) {
    const pts = pl.points.map(([x, y]) => `${x},${y}`).join(" ");
    s.appendChild(svg("polyline", { points: pts, fill: "none", stroke: "#6b5a3e", "stroke-width": 1 }));
  }
  for (const d of deathsSoFar()) {
    s.appendChild(svg("circle", { cx: d.x, cy: d.y, r: 4, fill: snowStyle ? "#222" : "#8b2a1f", opacity: 0.75 }));
  }
  for (const p of state.data.pumps) {
    s.appendChild(svg("rect", {
      x: p.x - 6, y: p.y - 6, width: 12, height: 12,
      fill: "#1e3a5f", stroke: p.isBroadStreet ? "#8b2a1f" : "#fff",
      "stroke-width": p.isBroadStreet ? 2.5 : 1.2,
    }));
  }
  return s;
}

function endingStats(cells) {
  const wrap = html("div", { class: "ending-stats" });
  for (const [label, value] of cells) {
    wrap.appendChild(html("div", {},
      html("div", { class: "ending-stat-label", text: label }),
      html("div", { class: "ending-stat-value", text: String(value) }),
    ));
  }
  return wrap;
}

function reloadBtn(label = "Opnieuw") {
  return html("button", { class: "secondary", onclick: () => location.reload() }, label);
}

function printBtn() {
  return html("button", { class: "secondary", onclick: () => window.print() }, "Printbaar dossier");
}

function showEnding(kind) {
  state.endChoice = kind;
  const overlay = $("ending-overlay");
  const card = $("ending-card");
  overlay.classList.remove("hidden");
  clear(card);

  if (kind === "handleRemoved") {
    const prevented = Math.max(0, 600 - state.deaths);
    card.appendChild(html("div", { class: "stamp", text: "BOARD OF GUARDIANS — 8 SEPTEMBER 1854" }));
    card.appendChild(html("h1", { text: "De pomphendel verwijderd" }));
    card.appendChild(html("p", { text: "De hendel van de Broad Street pomp is om 15:00 uur vanmiddag door een smid losgeschroefd. Bewoners moeten water halen uit andere pompen in de buurt." }));
    card.appendChild(endingStats([
      ["Doden bij pomphendel-actie", state.deaths],
      ["Dag van actie", state.day],
      ["Geschat voorkomen", `~${prevented}`],
    ]));
    card.appendChild(html("p", { text: "Binnen enkele dagen dalen nieuwe sterfgevallen in Soho tot nul. De uitbraak stopt." }));
    const historicalMap = html("img", { src: "data/img/old-soho-1500.jpg", alt: "Historische kaart van Soho, ~1854" });
    historicalMap.style.width = "100%";
    historicalMap.style.border = "1px solid var(--rule)";
    card.appendChild(html("div", { class: "ending-grid" },
      html("figure", {}, mapSnapshotNode(false), html("figcaption", { text: `Uw kaart, ${state.day} dagen onderzoek` })),
      html("figure", {}, historicalMap, html("figcaption", { text: "Historische kaart van Soho, midden 19e eeuw. Broad Street centraal; St Anne's, Westminster parochie." })),
    ));
    card.appendChild(html("p", {}, html("em", { text: "Dr. John Snow publiceerde dit onderzoek in 1855. Hij had geen kiemtheorie tot zijn beschikking — Louis Pasteur bewees het bestaan van ziekteverwekkende micro-organismen pas in 1861-1884. Snow handelde op patroon, anomalie, en de moed om zonder mechanisme te concluderen." })));
    card.appendChild(html("p", { class: "transfer-question", text: "Welke pomphendel staat in uw vakgebied nog te wachten op iemand die de kaart tekent?" }));
    card.appendChild(printBtn());
    card.appendChild(reloadBtn());
  } else if (kind === "moreEvidence") {
    card.appendChild(html("div", { class: "stamp", text: "ST JAMES'S PARISH — 18 SEPTEMBER 1854" }));
    card.appendChild(html("h1", { text: "Meer bewijs geëist — de uitbraak zette door" }));
    card.appendChild(html("p", { text: "De Board achtte uw bewijs onvoldoende. De pomp bleef open. U werd verzocht nader onderzoek te doen en over drie weken terug te rapporteren." }));
    card.appendChild(endingStats([
      ["Uiteindelijk doden in Soho", "~616"],
      ["Doden na uw rapportage", `~${616 - state.deaths}`],
      ["Dagen tot uitbraak eindigde", "~30"],
    ]));
    card.appendChild(html("p", { text: "Historische werkelijkheid: Dr. Snow slaagde er op 7 september 1854 in de Board of Guardians wél te overtuigen. De pomphendel werd verwijderd en de uitbraak eindigde binnen dagen. Zonder die actie zou de uitbraak zich vermoedelijk hebben verspreid naar aangrenzende parochies." }));
    card.appendChild(html("p", { class: "transfer-question", text: "Welk analytisch bewijs is in uw vakgebied genoeg om tot actie over te gaan, zonder volledig begrip van het mechanisme?" }));
    card.appendChild(reloadBtn());
  } else if (kind === "autoTimeout") {
    card.appendChild(html("div", { class: "stamp", text: "ST JAMES'S PARISH — 10 SEPTEMBER 1854" }));
    card.appendChild(html("h1", { text: "Tijd verstreken — geen actie genomen" }));
    card.appendChild(html("p", { text: "De Board of Guardians heeft het onderzoek vandaag gesloten zonder conclusie. Er werd geen beslissing over de pomp genomen." }));
    card.appendChild(endingStats([
      ["Doden tot nu", state.deaths],
      ["Historisch totaal", "~616"],
      ["Uw analyse reikte tot", `Dag ${state.day}`],
    ]));
    card.appendChild(html("p", { text: "Historische werkelijkheid: Dr. Snow haalde binnen 10 dagen voldoende bewijs bijeen en overtuigde de Board. De uitbraak eindigde binnen dagen na het verwijderen van de hendel op 7 september 1854." }));
    card.appendChild(html("p", { class: "transfer-question", text: "Welke analytische stap had u eerder moeten zetten?" }));
    card.appendChild(reloadBtn());
  }
}

/* ---------- Choice handler ---------- */

function handleChoice(option) {
  if (state.chosenOptions.includes(option.id)) return;
  state.chosenOptions.push(option.id);
  state.activeTabId = option.id;

  // Menu inklappen zodat viz de volle hoogte krijgt
  setMenuOpen(false);

  const handlers = vizHandlers();

  // Eindkeuze — direct naar slot, geen dag-advance
  if (option.endChoice) {
    (handlers[option.viz] || (() => showEnding(option.endChoice)))();
    return;
  }

  // Dag-advance
  state.day += 1;
  const newDeaths = DEATHS_PER_DAY_ADVANCE[state.day] || 0;
  state.deaths += newDeaths;
  // renderDeaths leest state.deaths automatisch via deathsSoFar()

  if (option.advancesStage) {
    state.currentStageIdx += 1;
    // Nieuwe stage → menu weer uitklappen zodat student nieuwe opties ziet
    setMenuOpen(true);
  }

  const viz = handlers[option.viz];
  if (viz) viz();

  if (state.day >= state.data.menu.hardStopDay
      && state.currentStageIdx < state.data.menu.stages.length - 1) {
    showEnding("autoTimeout");
    return;
  }

  render();
}

/* ---------- Init ---------- */

async function init() {
  try {
    state.data = await loadData();
  } catch (err) {
    document.body.textContent = "";
    const panel = html("div", { style: "padding:2rem;font-family:serif" });
    panel.appendChild(html("h1", { text: "Kan data niet laden" }));
    panel.appendChild(html("p", { text: err.message }));
    panel.appendChild(html("p", {}, "Start een lokale webserver: ",
      html("code", { text: "python3 -m http.server 8000" })
    ));
    document.body.appendChild(panel);
    return;
  }
  renderStreets();
  state.unlockedLayers.add("streets");
  render();
  setMenuOpen(true);
  $("menu-toggle").addEventListener("click", () => setMenuOpen(!state.menuOpen));
  $("start-btn").addEventListener("click", () => {
    $("intro-overlay").classList.add("hidden");
  });
}

init();
