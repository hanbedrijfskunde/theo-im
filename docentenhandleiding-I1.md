# Docentenhandleiding — Werkvorm I1: De Broad Street Zaak

**Categorie:** I. Historische detective
**Module:** THEOIM week 1 (Bedrijfskunde jaar 1)
**Duur:** 60-75 min individueel + 15 min plenaire debrief
**Groep:** individueel achter laptop (optioneel duo)
**DIKIWI-focus:** alle zes stadia (D → I → K → Inzicht → Wijsheid → Impact)
**P/A/M-anker:** Purpose (echte impact voelen) + Autonomy (eigen analytische keuzes) + Mastery (patroonherkenning onder tijdsdruk)

---

## 1. Voorbereiding

**Technisch:**
- Studenten hebben een laptop met recente Chrome/Firefox/Safari.
- Webapp draait lokaal via `python3 -m http.server` in de project-map, of gehost op een statische webserver. Geen accounts, geen installatie.
- Test vóór de les: open `broad-street-zaak.html` in de browser, doorloop één keer.

**Materiaal voor de docent:**
- Deze handleiding (debrief-draaiboek)
- Snow's originele kaart (1855) — staat al in de webapp als eindscherm
- Optioneel: whiteboard voor de plenaire reconstructie

**Wat niet te doen:**
- Noem **geen enkel DIKIWI-stadium** voordat de oefening voorbij is. Het didactische effect hangt af van die omkering: eerst ervaren, dan benoemen.
- Help studenten **niet** tijdens de oefening als ze vastlopen op een rode haring. De ervaring van "dit leidt nergens heen" is zelf de les.

---

## 2. Instructie aan studenten (2-3 min)

> "Jullie zijn junior-assistent van Dr. John Snow in Soho, Londen, september 1854. Er breekt cholera uit. Elke beslissing die jullie nemen kost een dag. De Board of Guardians sluit het onderzoek na 10 dagen. Doe wat jullie denken dat goed is. Dr. Snow geeft geen antwoorden — jullie oordelen zelf of een aanwijzing nuttig is.
>
> Na ongeveer een uur komen we plenair samen om na te praten."

**Niet zeggen:**
- "Let op dit of dat" — de oefening verliest z'n kracht zodra je hints geeft.
- "Probeer eens X" — studenten moeten zelf kiezen.
- "Dat is een rode haring" — afwezigheid van patroon herkennen is de vaardigheid.

---

## 3. Verloop (60-75 min)

Studenten werken zelfstandig. Loop rond; observeer zonder te sturen. Noteer voor jezelf:

- **Tijd-tot-kaart:** hoe lang duurt het voor ze "adressen plotten op kaart van Londen" kiezen? (Dit is het eerste grote inzicht-moment.)
- **Tijd-tot-pomp:** hoelang voor ze pompen op de kaart zetten?
- **Tijd-tot-actie:** komen ze tot pomphendel binnen 10 dagen?
- **Frustratiepieken:** wanneer reageren studenten hoorbaar ("dit helpt niks", zucht, scroll door tabel)? Noteer — dit zijn *kansrijke debrief-momenten*.

**Stop-momenten** (optioneel): breek de sessie halverwege kort plenair ("eerste observaties?") als dat nodig is voor tempo. Geef geen hints; verzamel alleen wat studenten al gevonden hebben.

---

## 4. Plenaire debrief (15 min)

**Centrale didactische beweging:** eerst laten studenten hún verhaal vertellen, dan plak je het DIKIWI-model er *achteraf* op.

### Stap 1: oogst de ervaring (5 min)

Start met een open vraag — laat twee à drie studenten de essentie vertellen:

> "Wie heeft de pomphendel laten verwijderen? Op welke dag? Wat was de beslissende aanwijzing?"

Laat ook de "verliezers" spreken:

> "Wie heeft het onderzoek laten sluiten zonder actie? Wat hield je tegen?"

### Stap 2: DIKIWI-reconstructie (7 min)

Nu komt het model terug. Teken op het whiteboard de zes stadia:

```
DATA → INFORMATIE → KENNIS → INZICHT → WIJSHEID → IMPACT
```

Ga **samen** langs de oefening en vraag studenten elk stadium te identificeren:

| DIKIWI | Keuze in de oefening | Reconstructie-vraag |
|---|---|---|
| **Data** | Dag 1: dodencijfers alleen | "Wat had je echt toen je begon? Alleen getallen. Wat konden die getallen je vertellen?" |
| **Informatie** | Dag 2-3: adressen gekoppeld aan doden | "Toen je de adressen erbij kreeg — was dat inzicht?" *(nee, het was structuur op data)* |
| **Kennis** | Dag 4-5: cluster zichtbaar op kaart | "Wat wist je toen je de kaart zag?" *(dat er een geografisch patroon is)* |
| **Inzicht** | Dag 5-6: pompen + cluster-overlay | "Wat zag je toen de pompen verschenen?" *(de causaliteit — het water)* |
| **Wijsheid** | Dag 6-7: interviews + Hampstead | "Wat maakte je zeker genoeg om te handelen zonder bewezen mechanisme?" *(anomalieën bevestigen het patroon)* |
| **Impact** | Dag 8-9: pomphendel verwijderen | "Wat gebeurt er als wijsheid niet overgaat in daad?" *(niets — 616 doden is het alternatief)* |

### Stap 3: de Snow-paradox (3 min)

> "Dr. Snow deed dit in 1854. Louis Pasteur bewees het bestaan van ziekteverwekkende micro-organismen pas in 1884. Snow handelde dertig jaar voor wetenschappers konden verklaren wáárom het water dodelijk was. Hij had geen mechanisme. Hij had alleen patroon en de moed om zonder mechanisme te concluderen."

Vraag aan de groep:

> "Wat had Snow tegen kunnen houden? (Wachten op bewijs van mechanisme.) Wat heeft hem laten handelen? (Impact. Hij wist dat mensen doodgingen, nu.)"

---

## 5. Transfer-vraag (slot, 1-2 min)

Eén zin per student op papier of in chat, als sluiting:

> **"Welke pomphendel staat in jouw vakgebied nog te wachten op iemand die de kaart tekent?"**

Laat één of twee voorbeelden hardop delen. Voorbeelden die je zelf kan geven als kraanhengsel:

- **Retourpercentages:** als 18% van een productlijn retour komt, zie je pas een patroon als je de retouren op productcategorie × afzetkanaal plot.
- **Klanttevredenheidsdaling:** NPS daalt al 6 maanden, maar tot iemand het per klant-segment uitsplitst, wordt de oorzaak niet gevonden.
- **Voorraadruis (Bullwhip):** elke schakel ziet zijn eigen cijfers; de dodelijke fluctuatie zie je pas als je alle schakels in één plot tekent.

---

## 6. Veelgemaakte valkuilen (voor jou als docent)

**Student gaat te snel door naar de kaart-keuze.**
Niet ingrijpen. Ze missen dan misschien de rode haringen, en leren niet dat niet-informatieve data ook bestaat. Laat het in debrief terugkomen: "Had je ook door de demografie-tabel gekeken? Wat stond daar? Waarom helpt dat niet geografisch?"

**Student raakt gefrustreerd bij rode haringen.**
Dit is didactisch waardevol. Vraag later: "Wat maakt een dataset wél of níét bruikbaar? Niet alle echte data beantwoordt elke vraag."

**Student kiest "meer bewijs eisen" op dag 9.**
Dit is een valide eindkeuze met een eigen les: het toont dat wijsheid zonder daad inert is. In debrief: "Wat had er moeten gebeuren om jou wél te laten handelen? En als de historische Snow dit gedaan had, hoeveel doden dan?"

**Student haalt dag 10 zonder actie.**
Het autoTimeout-scherm doet didactisch werk: het laat zien dat tijd op is. Bespreek: "Waar zat je analyse in vast?"

---

## 7. Historische achtergrond (voor jou als docent)

- **De uitbraak:** 31 augustus - 14 september 1854, centraal rond Broad Street (nu Broadwick Street) in Soho. 616 doden binnen drie weken in een gebied van ~250 meter.
- **Snow's methode:** huis-tot-huis interviews, statistische analyse, tekening van de beroemde "dot map". Hij koppelde elk sterfgeval aan het waterverbruik van het huishouden.
- **De anomalieën die Snow zelf beschreef:**
  - **Lion Brewery:** 70 arbeiders in het hart van het cluster, geen sterfgevallen. Drinken bier, geen pompwater.
  - **St James's Workhouse:** 535 bewoners in het cluster, slechts 5 sterfgevallen. Eigen waterbron in de kelder.
  - **Susannah Eley, Hampstead:** stierf aan cholera hoewel ze ver buiten Soho woonde. Haar knecht haalde dagelijks water uit Broad Street omdat ze de smaak prefereerde.
- **De actie:** 7 september 1854 overtuigde Snow de Board of Guardians van St James's Parish. De hendel werd op 8 september verwijderd.
- **Het effect:** de uitbraak doofde uit binnen een week (al was het al aan het afnemen; hoeveel Snow precies voorkwam is historisch lastig exact te bepalen).
- **De paradox:** Snow publiceerde zijn werk in 1855 (*On the Mode of Communication of Cholera*, 2e editie). De medische gemeenschap accepteerde zijn conclusie pas grotendeels ná Pasteur's kiemtheorie (1861) en Koch's isolatie van *Vibrio cholerae* (1884).

---

## 8. Koppelingen met ander curriculum

- **Week 1, Ratioanalyse:** zie C1 "Ratio-to-Wisdom Challenge" in `ideeen.md`. Beide werkvormen trainen D→Impact; Snow is historisch-dramatisch, ratio is beroepsgericht. Werken goed samen in dezelfde week.
- **Blok 2, Bullwhipgame:** de Snow-transfer-vraag werkt terug in de game-debrief. "Op welke DIKIWI-laag ging het mis?" is precies het patroon dat je hier voorbereidt.
- **E-werkvormen (Datasaurus):** Snow en Datasaurus zijn complementair. Datasaurus leert *"never trust summary statistics"* (I→Inzicht). Snow leert *"wijsheid zonder daad is inert"* (Wijsheid→Impact). Zet Datasaurus als opener van de week, Snow als climax.

---

## 9. Verdieping (optioneel, voor geïnteresseerde studenten)

- Steven Johnson, *The Ghost Map* (2006) — non-fictie verslag van de Broad Street uitbraak; leest als een thriller.
- Oorspronkelijke publicatie: John Snow, *On the Mode of Communication of Cholera*, 2e editie, 1855. Gedigitaliseerd beschikbaar via UCLA (Department of Epidemiology).
- HistData R-package (Michael Friendly) — bevat de coördinaten waarop deze werkvorm is gebouwd. Geschikt voor studenten die zelf in R of Python met de data willen werken.

---

## 10. Na de les

Noteer voor jezelf:
- Hoeveel studenten haalden de pomphendel binnen 10 dagen?
- Welke rode haring werd het vaakst gekozen? (Indicator voor intuïtieve aantrekkingskracht.)
- Kon de groep in de debrief zelf DIKIWI reconstrueren, of had je sturing nodig?
- Welke transfer-zinnen werden genoemd? (Bewaar de mooiste voor later hergebruik.)

Deze observaties helpen bij iteratie van de werkvorm en input voor M6-pilotnotes.
