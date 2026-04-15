# Takenlijst — De Broad Street Zaak (I1)

Gebaseerd op [prd-broad-street-zaak.md](prd-broad-street-zaak.md). Afgeleid uit milestones M1-M6.

**Werkwijze:**
- Vink elke taak af (`[x]`) zodra afgerond.
- Aan het eind van elke hoofdtaak: alle tests draaien. **Pas na groen licht commit + push.**
- Commit messages: Nederlands, imperatief, prefix met hoofdtaak-nummer (bv. `M1: voeg snow-deaths.json toe`).
- Remote: `https://github.com/hanbedrijfskunde/theo-im.git`

---

## M0 — Repo-initialisatie *(eenmalig, vooraf)* ✅

- [x] **M0.1** Open terminal in `/Users/witoldtenhove/Projects/theoim/`.
- [x] **M0.2** Initialiseer git repo: `git init`.
- [x] **M0.3** Maak `.gitignore` met minimaal: `.DS_Store`, `node_modules/`, `*.log`, `.claude/`, `.vscode/`.
- [x] **M0.4** Maak `README.md` met één alinea projectbeschrijving + link naar `docs/prd-broad-street-zaak.md`.
- [x] **M0.5** Voeg remote toe: `git remote add origin https://github.com/hanbedrijfskunde/theo-im.git`.
- [x] **M0.6** Eerste commit: `git add . && git commit -m "M0: initialiseer repo met bestaande materialen en PRD"`.
- [x] **M0.7** Push: `git branch -M main && git push -u origin main`.

### Tests M0
- [x] `git status` toont clean working tree.
- [x] `git remote -v` toont origin naar hanbedrijfskunde/theo-im.git.
- [x] Remote op GitHub bevat `README.md`, `ideeen.md`, `docs/prd-broad-street-zaak.md`.

---

## M1 — Data-prep ✅

**Doel:** alle historische data en kaart-assets klaarzetten als statische bestanden in het project.

**Databron-wijziging:** Robin Wilson's repo bleek verwijderd. Vervangen door HistData (Dodson 1992 digitization, Friendly's R-package) via Rdatasets CSV-mirror — dezelfde authoritatieve bron die elke academische Snow-analyse gebruikt. Automatisering in [`scripts/generate_data.py`](../scripts/generate_data.py).

- [x] **M1.1** Maak map `/Users/witoldtenhove/Projects/theoim/data/`.
- [x] **M1.2** Maak map `/Users/witoldtenhove/Projects/theoim/content/`.
- [x] **M1.3** Download HistData Snow-data via Rdatasets CSV-mirror (vrij beschikbaar onder GPL/MIT). Raw CSVs in `data/raw/`.
- [x] **M1.4** Converteer sterfgevallen naar `data/snow-deaths.json`. Elk record: `{id, x, y, date, name, address, age, gender}`. Coördinaten geprojecteerd naar canvas 1024×768.
- [x] **M1.5** Converteer pompen naar `data/snow-pumps.json`. Elk record: `{id, x, y, name, isBroadStreet}`. Precies 13 records.
- [x] **M1.6** Genereer Soho 1854-kaart als `data/soho-1854.svg` uit HistData straten-segmenten. 22KB.
- [x] **M1.7** Stel POI-data op in `data/soho-poi.json` met lagen: `schools`, `workhouses`, `markets`, `slaughterhouses`, `breweries`.
- [x] **M1.8** Stel bevolkingsdichtheid-grid op in `data/soho-density.json` voor heatmap-rendering.
- [x] **M1.9** Maak `data/outbreak-timeline.json` met sterftecurve per dag uit Snow.dates.
- [x] **M1.10** Stel rode-haring-datasets op (7 bestanden: causes, demographics, previous-outbreaks, europe, class, water-analysis, other-pumps).

### Tests M1
- [x] `jq '. | length' data/snow-deaths.json` → 578 records.
- [x] `jq '. | length' data/snow-pumps.json` → 13.
- [x] `jq '.[] | select(.isBroadStreet == true) | .name' data/snow-pumps.json` → "Broad St Pump".
- [x] Alle x/y-coördinaten vallen binnen canvas 0-1024 / 0-768 (0 out-of-bounds).
- [x] Alle 14 JSON-bestanden parsen zonder fout.
- [x] `data/soho-1854.svg` = 22KB (< 1MB), renderbaar in browser.
- [x] `outbreak-timeline.json` dekt 44 dagen, totaal 616 sterfgevallen ≈ historisch totaal.

**Afsluiting M1:** tests groen → commit + push.

---

## M2 — Happy path webapp ✅

**Doel:** werkende end-to-end doorloop met alleen de 🎯-keuzes; geen styling, geen rode haringen.

**Resultaat:** volledige happy path werkt end-to-end: intro → dashboard → kaart-reveal → pompen → anomalieën → Board → pomphendel → slotscherm. Tijdens M2 zijn ook de rode-haring viz-handlers geïmplementeerd (M3 wordt grotendeels alleen nog content-polish).

- [x] **M2.1** Maak `broad-street-zaak.html` in project-root met HTML5-skelet, viewport meta, en `<script type="module" src="app.js"></script>`.
- [x] **M2.2** Maak `app.js` als ES-module. State-object compleet met day, deaths, deathsRevealed, unlockedLayers, currentStageIdx, chosenOptions, endChoice.
- [x] **M2.3** Implementeer `loadData()`: fetcht alle JSON-bestanden parallel via `Promise.all`.
- [x] **M2.4** Render dashboard: header met dag-teller, doden-teller, resterende dagen. Update na elke keuze.
- [x] **M2.5** Maak `content/menu-content.json` met structuur per dag:
  ```json
  {
    "days": [
      {"dayNumber": 1, "options": [{"id": "day1-addresses", "label": "Namen en adressen slachtoffers opvragen", "unlocksLayer": "addresses", "isKeyChoice": true}, ...]}
    ]
  }
  ```
  Menu-content is compleet (zowel 🎯 als rode haringen) ingebouwd tijdens M1 generate-script.
- [x] **M2.6** Render menu onder dashboard: lijst knoppen uit huidige stage. Klik → `handleChoice(option)`.
- [x] **M2.7** Implementeer `handleChoice(option)` met dag-advance, deaths-update, unlock layers, stage-advance, viz-dispatch, hard-stop check.
- [x] **M2.8** Maak kaart-component met `<svg viewBox="0 0 1024 768">`. Functies: `renderStreets`, `renderDeaths`, `renderPumps`, `renderPOI`, `renderDensity`. Lagen onafhankelijk.
- [x] **M2.9** Implementeer eindkeuze-stage (s6) met twee knoppen.
- [x] **M2.10** Implementeer slotscherm: stats, twee kaart-snapshots (uw kaart + Snow's stratenbasis), historische noot Pasteur 1884, transfer-vraag.
- [x] **M2.11** Implementeer hard-stop: als `day >= 10` en geen eindkeuze → auto-slotscherm `autoTimeout`.
- [x] **M2.12** Voeg "Printbaar dossier"-knop toe op slotscherm (window.print()).

### Tests M2
**Handmatig (browser met Chrome DevTools MCP):**
- [x] Open `broad-street-zaak.html` in Chrome via http-server. Geen console errors.
- [x] Dashboard toont `Dag 1 · 56 doden · 9 dagen resterend`.
- [x] Klik opeenvolgend alle 🎯-opties (adressen → kaart → pompen → interviews → Hampstead → Board → pomphendel) → eindkeuze-scherm verschijnt op dag 7.
- [x] Kies "Handle removed" → slotscherm met beide kaarten + historische cijfers (541 doden, ~59 voorkomen).
- [x] Kaart-SVG toont na adres-keuze 578 stippen; na pomp-keuze 13 pomp-markers; Broad Street-pomp visueel onderscheidbaar (rode border).
- [x] Dossier-chips tonen alle gekozen opties; gekozen opties worden disabled.
- [ ] Alternative flows (moreEvidence, autoTimeout) — getest door code-inspection; full browser test uitgesteld naar M6 pilot.

**Afsluiting M2:** tests groen → commit + push.

---

## M3 — Rode haringen

**Doel:** alle niet-🎯 opties uit PRD §8 functioneel maken; elke optie toont echte data zonder "dit helpt niet"-tekst.

- [ ] **M3.1** Vul `content/menu-content.json` aan met alle rode-haring-opties per dag (zie PRD §8).
- [ ] **M3.2** Implementeer voor Dag 1 de visualisatie-handlers:
  - `renderCausesTable()` — tabel uit `red-herring-causes.json`
  - `renderDemographicsChart()` — staafdiagram leeftijd × geslacht
  - `renderPreviousOutbreaks()` — tabel/lijngrafiek 1832/1849
  - `renderEuropeMap()` — kleine Europa-kaart met andere steden
- [ ] **M3.3** Implementeer voor Dag 2-3:
  - `renderSortedAddresses()` — alfabetisch gesorteerde tabel
  - `renderByParish()` — groupering per parochie met tellingen
  - `renderByClass()` — tabel beroep/klasse
- [ ] **M3.4** Implementeer voor Dag 4-5:
  - `renderDensityHeatmap()` — heatmap-laag op kaart
  - `renderSchools()` — school-markers op kaart
  - `renderMarkets()` — markt/slachthuis-markers
  - `renderWorkhouses()` — werkhuis-markers (inclusief die ene in het cluster met lage sterfte)
- [ ] **M3.5** Implementeer voor Dag 6-7:
  - `renderWaterAnalysis()` — microscopie-beschrijving in dossier-paneel
  - `renderOtherPumpsTest()` — tabel pomptest-uitkomsten (negatief)
- [ ] **M3.6** Implementeer voor Dag 8-9:
  - `renderLancetPreview()` — toont dat publicatie weken kost
  - `renderMoreDataProgress()` — toont oplopende doden tijdens "meer data"
  - `renderPamphletResults()` — gedeeltelijk effect
- [ ] **M3.7** Dossier-paneel: chips van alle gekozen opties (🎯 en rode haringen) met klikbaar terug-zicht op hun visualisatie.
- [ ] **M3.8** Dag-progressie audit: elke klik kost exact 1 dag, incl. rode haringen. Timer stopt nooit.

### Tests M3
- [ ] Elke rode-haring-optie toont unieke, inhoudelijk-relevante data (visueel geïnspecteerd).
- [ ] Geen tekst als "dit helpt niet" / "fout" / "probeer opnieuw" in UI (grep: `grep -r -i "helpt niet\|fout\|probeer opnieuw" *.html *.js *.json` → leeg).
- [ ] Doorloop met alleen rode haringen bereikt dag 10 zonder eindkeuze → auto-slotscherm.
- [ ] Mix van 3 rode haringen + 🎯-keuzes: dag-teller klopt (3 + aantal keys).
- [ ] Dossier-chips zijn aanklikbaar en tonen eerder bekeken visualisatie.

**Afsluiting M3:** tests groen → `git commit -m "M3: alle rode haringen met echte data toegevoegd" && git push`.

---

## M4 — Styling + Victoriaanse polish

**Doel:** webapp voelt als een document uit 1854.

- [ ] **M4.1** Maak `styles.css`. Basispalet: sepia `#f4ecd8` achtergrond, donkerbruine tekst `#3b2f1e`, accent-rood `#8b2a1f` voor doden.
- [ ] **M4.2** Typografie: serif (Playfair Display of Crimson Text via Google Fonts / local fallback). Dashboard-koppen in small-caps.
- [ ] **M4.3** "Oud papier"-textuur: subtiele CSS-filter of overlay-PNG (< 200KB).
- [ ] **M4.4** Stempels: SVG-badges "CONFIDENTIAL — General Register Office" roodbruin, lichte rotatie, op intro-scherm en dossier.
- [ ] **M4.5** Menu-knoppen vormgegeven als telegram-strookjes (enveloppen-icoon, getypte-brief-look).
- [ ] **M4.6** Kaart-achtergrond: subtiele sepia-tint over SVG met `<filter>`.
- [ ] **M4.7** Sterfgevallen-stippen: kleine rode crosses (✕) of zwarte stippen à la Snow's originele kaart.
- [ ] **M4.8** Broad Street pomp opvallend onderscheidend (groter, met label).
- [ ] **M4.9** Overgangen tussen dagen: fade-in van nieuwe stippen (200ms) en korte "dag X"-overlay.
- [ ] **M4.10** Slotscherm: Snow's originele kaart naast student's kaart, met onderschrift "Dr. John Snow's map, 1855".
- [ ] **M4.11** Responsive: werkt op 1280×720 tot 1920×1080. Geen mobile-layout nodig.

### Tests M4
- [ ] Lighthouse performance score ≥80 op desktop-profiel.
- [ ] First contentful paint <2s lokaal.
- [ ] Totale asset-size (html + js + css + data + fonts) <5MB: `du -sh broad-street-zaak.html app.js styles.css data/ content/`.
- [ ] Visuele inspectie: dashboard, kaart, menu, slotscherm ogen consistent Victoriaans.
- [ ] Print-view (Ctrl+P in slotscherm) is leesbaar en toont dossier zonder UI-chrome.

**Afsluiting M4:** tests groen → `git commit -m "M4: Victoriaanse styling en polish" && git push`.

---

## M5 — Docentenhandleiding

**Doel:** docent kan de werkvorm draaien en de debrief leiden zonder de bouwer te raadplegen.

- [ ] **M5.1** Maak `docentenhandleiding-I1.md`. Secties: Voorbereiding, Instructie aan studenten, Verloop (60-75 min), Plenaire debrief (15 min), Reconstructie-vragen, Historische achtergrond, Veelgemaakte valkuilen, Verdieping.
- [ ] **M5.2** Schrijf sectie *Plenaire debrief* met concrete reconstructie-vragen per DIKIWI-stadium (minimaal 2 per stadium).
- [ ] **M5.3** Voeg sectie *Transfer* toe met 3 voorbeeld-pomphendels uit bedrijfskunde-praktijk (bv. retourpercentages, klanttevredenheidsdaling, voorraadruis).
- [ ] **M5.4** Voeg een beknopte *DIKIWI-sleutel* toe: welke dag/keuze hoort bij welk stadium (voor docent, niet student).
- [ ] **M5.5** Voeg *Historische noot* toe: Snow, miasma-theorie, Pasteur 1884, Ghost Map-bronverwijzing.

### Tests M5
- [ ] Handleiding gelezen door één collega-docent zonder context: kan die de debrief leiden?
- [ ] Alle vragen uit §Plenaire debrief zijn beantwoordbaar vanuit de slotscherm-data.
- [ ] Markdown rendert correct in GitHub-preview.

**Afsluiting M5:** tests groen → `git commit -m "M5: docentenhandleiding toegevoegd" && git push`.

---

## M6 — Pilot + iteratie + ideeënbox-update

**Doel:** werkvorm getest met echte studenten, ideeënbox bijgewerkt, release klaar.

- [ ] **M6.1** Pilot met 2-3 studenten. Observeer: tijd-tot-cluster-aha, frustratiepieken, reconstructie-vermogen in debrief.
- [ ] **M6.2** Noteer minstens 5 observaties in `docs/pilot-notes.md`.
- [ ] **M6.3** Prioriteer bevindingen: must-fix (nu), nice-to-have (later), afgewezen.
- [ ] **M6.4** Voer must-fix door in webapp/handleiding.
- [ ] **M6.5** Update `ideeen.md`:
  - Voeg rij I1 toe aan snelkiezer-tabel (§1).
  - Voeg nieuwe sectie §2.I *Historische detective* toe met volledige werkvorm-beschrijving volgens sjabloon §3.
  - Voeg kruisverwijzing toe bij E4 (§2.E) dat I1 een alternatief is dat alle zes stadia dekt.
- [ ] **M6.6** Werk PRD bij naar v1.0: open questions sluiten, beslissingen vastleggen.

### Tests M6
- [ ] Pilot-student kan binnen 75 min afronden zonder docent-hulp.
- [ ] Pilot-student noemt in debrief ≥4 van 6 DIKIWI-stadia correct.
- [ ] `ideeen.md` snelkiezer bevat regel I1.
- [ ] `ideeen.md` bevat sectie §2.I volledig.
- [ ] PRD-status op v1.0, geen open questions meer in §12.

**Afsluiting M6:** tests groen → `git commit -m "M6: pilot afgerond, ideeenbox bijgewerkt, release v1.0" && git tag v1.0 && git push --tags && git push`.

---

## Globale definitie van "klaar"

- Alle hoofdtaken M0-M6 afgevinkt.
- Alle tests per hoofdtaak groen.
- Alle commits gepusht naar `main` op `hanbedrijfskunde/theo-im`.
- Tag `v1.0` staat op remote.
- Docent heeft werkvorm minstens één keer gedraaid zonder support-tickets.
