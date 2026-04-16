# PRD — De Broad Street Zaak

**Werkvorm-code:** I1
**Status:** Draft v1
**Auteur:** Witek ten Hove (met Claude)
**Datum:** 2026-04-15

---

## 1. Overview

Browser-based, single-player detective-werkvorm waarin studenten als junior-assistent van Dr. John Snow de Broad Street cholera-uitbraak van 1854 onderzoeken onder een 10-dagen deadline. Progressieve onthulling via "Wat heb je nu nodig?"-menu's met rode haringen. Student doorloopt alle zes DIKIWI-stadia zonder dat het model benoemd wordt; DIKIWI komt pas in de plenaire debrief terug als retrospectieve verklaringslens.

## 2. Problem statement

Bestaande DIKIWI-werkvormen in de Ideeënbox (`ideeen.md`) raken telkens één of twee stadia. De sterkste detective-werkvorm (E4 Datasaurus) eindigt bij *Inzicht* en mist voelbare *Impact*. Geen enkele werkvorm laat studenten de volledige ladder in één narratieve ervaring doorlopen met echte historische data en een concreet, levens-reddend besluit aan het eind.

## 3. Goals

**Primair:**
- G1. Student doorloopt alle zes DIKIWI-stadia in één sessie van ≤75 min.
- G2. Student kan in de debrief zelfstandig reconstrueren welke keuze welk DIKIWI-stadium was.
- G3. Student verwoordt één transfer naar zijn eigen studieveld ("welke pomphendel wacht nog?").

**Secundair:**
- G4. Herbruikbaar zonder docent-tech-support (pure browser, geen installatie).
- G5. Uitbreidbaar als categorie I met latere cases (Semmelweis, Challenger).

**Succescriteria:**
- ≥80% van pilot-studenten doorloopt binnen 75 min zonder docent-hulp.
- ≥80% noemt in de debrief minstens 4 van de 6 DIKIWI-stadia correct in de eigen reconstructie.
- Docent rapporteert "hoger engagement dan Datasaurus" bij minstens één groep.

## 4. Non-goals

- ❌ Geen gamification met punten/badges/leaderboards.
- ❌ Geen DIKIWI-labels tijdens de oefening — bewuste keuze, het model komt pas in debrief.
- ❌ Geen "goed/fout"-feedback uit het systeem — data spreekt voor zichzelf.
- ❌ Geen multiplayer of collaboratieve modus in v1.
- ❌ Geen backend / geen data-opslag / geen accounts.
- ❌ Geen mobile-first: desktop/laptop primair.

## 5. Target users

**Primair:** Bedrijfskunde-student jaar 1 (THEOIM week 1). Laptop met browser. Geen statistiek-voorkennis. Nederlandstalig.

**Secundair:** Docent die de werkvorm inzet (klassikale debrief-regie).

## 6. User journey

1. Docent deelt link; student opent `broad-street-zaak.html` op laptop.
2. **Intro-scherm:** Victoriaanse briefkop, brief van Dr. Snow, setting uitgelegd, "Start onderzoek".
3. **Dashboard + dag-loop (6-10 iteraties):**
   - Teller: `Dag N · X doden · Y dagen resterend`.
   - Kaart-staat (leeg of met reeds onthulde lagen).
   - Telegram: "Wat heb je nu nodig?" + menu met 4-6 opties.
   - Student klikt optie → data verschijnt gevisualiseerd, dag +1, nieuwe doden op kaart.
   - Student kiest zelf: nog een laag, of door naar volgende beslissing.
4. **Eindkeuze op dag 9-10:** pomphendel eraf of meer bewijs eisen.
5. **Slotscherm:** historische uitkomst, Snow's eigen kaart, cijfers, transfer-vraag.
6. **Plenaire debrief** (buiten de webapp, 15 min): docent leidt DIKIWI-reconstructie.

## 7. Functional requirements

### FR-1: Dashboard
- Altijd zichtbaar: dag-teller, totaal doden, resterende dagen, dossier-stukken (miniatuur-chips van eerder onthulde lagen).
- Kaart-canvas met huidige zichtbare lagen.

### FR-2: Menu-systeem
- Elke dag toont menu met 4-6 opties uit `menu-content.json`.
- Klik op optie → dag +1, doden-teller loopt op volgens historische curve, nieuwe laag rendert op kaart of in dossier.
- Reeds gekozen opties blijven zichtbaar maar disabled (dossier-trace).
- **Geen** tekstuele feedback "dit helpt" of "dit helpt niet". Alleen de data zelf.

### FR-3: Kaart-rendering
- SVG-kaart van Soho 1854 (Robin Wilson's geografeerde versie).
- Lagen: sterfgevallen (stipjes), pompen (gelabelde markers), bevolkingsdichtheid (heatmap), andere POI's (scholen, werkhuizen, markten).
- Lagen onafhankelijk aan/uit via dossier.

### FR-4: Tijd-mechaniek
- Start: dag 1, 56 doden, 9 dagen resterend.
- Elke menu-keuze: dag +1.
- Dag-progressie: nieuwe sterfgevallen verschijnen op kaart volgens historische curve (piek dag 3-4, afname daarna in historische werkelijkheid — in de sim blijft curve hoog als pomp niet wordt uitgezet).
- Dag 10 zonder eindkeuze → automatisch slotscherm "tegenfeitelijke werkelijkheid".

### FR-5: Eindkeuze + uitkomst
- Eindkeuze scherm: "Handle removed" vs. "Meer bewijs eisen".
- Handle removed → teller stopt, slotscherm toont: historische datum (8 sep 1854), doden voorkomen (schatting), Snow's kaart naast student's kaart.
- Meer bewijs → uitbraak zet door, slotscherm toont tegenfeitelijke cijfers.

### FR-6: Slotscherm
- Historische uitkomst + cijfers.
- Korte noot: Pasteur's kiemtheorie pas 1884.
- Transfer-vraag: "Welke pomphendel wacht nog in jouw vakgebied?"
- Knop "Printbaar dossier" → samenvatting van genomen keuzes voor debrief.

## 8. Content specification — 6 dagen

🎯 = patroon-dragende keuze. Overige opties = rode haringen met echte niet-geografische patronen.

**Dag 1 — alleen dodencijfers**
- Doodsoorzaken uit doktersregisters
- Leeftijd/geslacht slachtoffers
- Sterftecijfers eerdere cholera-uitbraken 1832, 1849
- Cholera elders in Europa 1854
- 🎯 Namen en adressen slachtoffers

**Dag 2-3 — adressenlijst**
- Alfabetisch sorteren
- Groeperen per parochie
- Beroep/klasse koppelen
- 🎯 Adressen plotten op kaart van Londen

**Dag 4-5 — cluster zichtbaar**
- Bevolkingsdichtheid als laag
- Locaties van scholen
- Slachthuizen/markten (miasma-verdachte locaties)
- Locaties van werkhuizen
- 🎯 Waterpompen in de buurt

**Dag 6-7 — pomp verdacht** *(twee 🎯-opties; beide kiezen kost extra dag)*
- Chemische/microscopische analyse pompwater
- Andere pompen testen
- 🎯 Interviews met overlevenden in het cluster (Lion Brewery + werkhuis-anomalieën)
- 🎯 Sterfgevallen ver buiten Soho (Mevr. Eley, Hampstead)

**Dag 8-9 — actie kiezen**
- Publicatie in *The Lancet*
- Meer data voor 100% zekerheid
- Pamfletten aan publiek
- 🎯 Board of Guardians overtuigen

**Dag 9-10 — eindkeuze**
- 🎯 Handle removed
- Meer bewijs eisen

Volledige menu-content (teksten, bijbehorende data, visualisatie-specs) in `content/menu-content.json`.

## 9. Technical requirements

### Stack
- Single-page HTML + vanilla JS + D3.js (of lichter: vanilla SVG).
- Geen build-tooling; directe browser-opening moet werken.
- Stijl-referentie: bestaand `Van Platte Data naar Ontologie.html` in project-root.
- Styling: sepia-palet, Times/serif, CSS-filters voor "oud papier"-textuur.

### Data
- **Sterfgevallen:** 578 records met (x, y, datum, adres) — Robin Wilson's BroadStreetPump GeoJSON.
- **Pompen:** 13 records met (x, y, naam).
- **Achtergrondkaart:** Snow's 1854 Soho-kaart als SVG of georeferenced PNG.
- **POI-lagen:** scholen, werkhuizen, markten, slachthuizen (historisch accuraat waar mogelijk, anders redelijke benadering).
- **Menu-content:** alle teksten in apart JSON-bestand voor eenvoudig redigeren door docent.

### Browser-support
- Laatste Chrome/Safari/Firefox/Edge. Geen IE11.
- Desktop 1280×720 minimum; laptop-scherm primaire target.

### Performance
- First paint < 2s op standaard laptop.
- Kaart-interactie 60fps.
- Totale asset-size < 5MB.

## 10. Deliverables

| Artefact | Pad (in theoim-project) |
|---|---|
| Webapp | `broad-street-zaak.html` |
| Data | `data/snow-deaths.json`, `data/snow-pumps.json`, `data/soho-poi.json` |
| Achtergrondkaart | `data/soho-1854.svg` |
| Menu-content | `content/menu-content.json` |
| Docentenhandleiding | `docentenhandleiding-I1.md` |
| Update ideeënbox | wijziging in `ideeen.md` (nieuwe categorie I + snelkiezer-rij) |

## 11. Milestones

1. **M1 — Data-prep (1 dag):** Snow-data in JSON-formaat, Soho-kaart als SVG, POI-data verzameld.
2. **M2 — Happy path webapp (2 dagen):** dashboard, menu-systeem, kaart-rendering, alleen 🎯-keuzes functioneel, eindkeuze, slotscherm.
3. **M3 — Rode haringen (1 dag):** alle niet-🎯 menu-opties met bijbehorende data en visualisaties.
4. **M4 — Styling + Victoriaanse polish (1 dag):** sepia, typografie, stempels, overgangen.
5. **M5 — Docentenhandleiding (0.5 dag):** debrief-draaiboek, reconstructie-vragen, historische context.
6. **M6 — Pilot + iteratie (1 week):** test met 2-3 studenten, aanpassingen, ideeen.md update.

## 12. Open questions / risks

- **OQ1:** Historische accuratesse van de 578 adres-coördinaten — Wilson's dataset checken op volledigheid, anders subset gebruiken.
- **OQ2:** Moet het dossier downloadbaar/printbaar zijn als PDF voor debrief, of volstaat scherm-kopie?
- **OQ3:** Is er behoefte aan een "reset"-knop halverwege, of is één doorloop per sessie voldoende?
- **R1:** Risico dat studenten alle opties doorklikken zonder te reflecteren → mitigatie: elke keuze kost een dag, dag 10 is hard. Onbewust doorklikken = verlies.
- **R2:** Risico dat de "geen hulp"-regel frustreert bij zwakkere studenten → mitigatie: pilot, evt. docent-hint bij plenaire stop-momenten op dag 3 en dag 6.
- **R3:** Robin Wilson's dataset licentie checken voor hergebruik.

## 13. Appendix — Historische bronnen

- Snow, J. (1855). *On the Mode of Communication of Cholera*, 2e ed.
- HistData R-package — `Snow.deaths`, `Snow.pumps`, `Snow.streets`, `Snow.polygons`, `Snow.dates`. `https://friendly.github.io/HistData/reference/Snow.html`
- Robin Wilson — BroadStreetPump gegeorefereerd: `https://github.com/robintw/BroadStreetPump`
- Johnson, S. (2006). *The Ghost Map: The Story of London's Most Terrifying Epidemic*.

## 14. Referenties in bestaand project

- `ideeen.md` — positionering in de Ideeënbox (nieuwe §2.I).
- `Van Platte Data naar Ontologie.html` — techniek en stijl-referentie.
- `dikiwi.jpeg` — visueel anker voor debrief.
