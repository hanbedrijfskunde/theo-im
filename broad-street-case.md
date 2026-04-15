Ready for review
Select text to add comments on the plan
Werkvorm I1 — "De Broad Street Zaak: Londen, 1854"
Context
De Ideeënbox voor DIKIWI week 1 (Bedrijfskunde jaar 1, THEOIM) bevat werkvormen die één of twee DIKIWI-stadia raken. De krachtigste bestaande werkvorm (E4 Datasaurus-detective) eindigt bij Inzicht en levert geen voelbare Impact. Tegelijk is Datasaurus een verzonnen casus — de emotionele lading blijft beperkt.

Deze plan introduceert een nieuwe categorie I. Historische detective met als eerste werkvorm I1 — De Broad Street Zaak, gebaseerd op John Snow's cholera-onderzoek in Soho, 1854. De casus dekt als enige werkvorm alle zes DIKIWI-stadia in één doorlopende narratieve ervaring, eindigt in een letterlijke Impact-beslissing (pomphendel eraf → uitbraak stopt), en gebruikt historisch echte data. Positionering: zelfstandige werkvorm, alternatief voor of opvolger van E4 Datasaurus-detective; kan E4 vervangen voor groepen die één sterke detective-werkvorm willen.

Leerdoel
Studenten ervaren dat DIKIWI geen abstract model is maar een ladder waarlangs onder tijdsdruk beslissingen worden genomen — en dat analytische keuzes in het echt iets kosten.

Ontwerpprincipes
Tikkende klok: 10 dagen tot de Board of Guardians het onderzoek sluit. Elke keuze = 1 dag. Elke dag nieuwe doden.
Geen hulp van het systeem: de webapp geeft nooit "goed/fout". Rode haringen leveren echte data op met echte (maar geografisch niet-informatieve) patronen. Student moet zelf concluderen of een laag helpt.
Geen DIKIWI-labels tijdens de oefening: studenten spelen puur als Victoriaans detective. Het model komt pas terug in de plenaire debrief, waar klassikaal wordt gereconstrueerd welke dag welk stadium was.
Progressieve onthulling via menu: elke dag vraag "Wat heb je nu nodig, assistent?" met 4-6 opties.
Authentieke Victoriaanse vormgeving: sepia, Times/serif, stempels "CONFIDENTIAL — General Register Office", kaart van 1854 Soho als achtergrond.
Werkvorm-meta
Kenmerk	Waarde
Code	I1
Tijd	60-75 min individueel + 15 min plenair debrief
Groepsgrootte	individueel (eventueel duo met rolwissel)
DIKIWI-focus	D → I → K → Inzicht → Wijsheid → Impact (alle zes)
P/A/M	Purpose (echte impact voelen) + Autonomy (eigen beslissingen) + Mastery (patroonherkenning)
Materiaal	webapp in browser; geen laptop-installaties
Core loop per "dag"
Dashboard: teller (Dag 3 · 184 doden · 7 dagen resterend), huidige kaart-staat, eerder verzamelde dossierstukken.
Telegram van Dr. Snow: "Wat heb je nu nodig, assistent?" + menu.
Student kiest → nieuwe data verschijnt gevisualiseerd. Dag +1. Nieuwe doden verschijnen als punten op de kaart.
Student beslist zelf: nog een laag op dit niveau, of door?
Hard stop op dag 10: pomphendel eraf of niet. Slotscherm toont historische werkelijkheid + aantal doden dat Snow voorkwam.
De zes dagen — menu-inhoud
🎯 = patroon-dragende keuze. Overige opties tonen échte data met echte (niet-geografische) patronen.

Dag 1 — alleen dodencijfers per dag

Doodsoorzaken uit doktersregisters (bevestigt cholera)
Leeftijd/geslacht slachtoffers (alle groepen; ontkracht "zwakkeren"-theorie)
Sterftecijfers eerdere cholera-uitbraken 1832, 1849 (vergelijkbaar totaal)
Cholera elders in Europa 1854 (andere patronen)
🎯 Namen en adressen slachtoffers → lange tabel met straatnamen
Dag 2-3 — adressenlijst zichtbaar

Alfabetisch sorteren (netter, niks nieuws)
Groeperen per parochie (St James Westminster springt eruit, maar parochie is groot)
Beroep/klasse koppelen (dwars door alle klassen)
🎯 Adressen plotten op kaart van Londen → cluster rond Broad Street verschijnt
Dag 4-5 — cluster zichtbaar

Bevolkingsdichtheid als laag (dicht, maar cluster dichter dan dichtheid verklaart)
Scholen (niet in cluster)
Slachthuizen/markten, miasma-verdachte locaties (niet in cluster)
Werkhuizen (één ín het cluster heeft juist lage sterfte — mysterie voor later)
🎯 Waterpompen in de buurt → 13 pompen, één centraal: Broad Street
Dag 6-7 — pomp verdacht (twee 'goede' keuzes; student mag er één of beide nemen, laatste kost extra dag — expliciete wijsheid-vs-tijd afweging)

Chemische/microscopische analyse pompwater (witte vlokjes, zonder kiemtheorie niet doorslaggevend)
Andere pompen testen (te traag)
🎯 Interviews met overlevenden in het cluster → Lion Brewery (arbeiders drinken bier, geen doden) + werkhuis (eigen bron). Anomalieën bevestigen pomp.
🎯 Sterfgevallen ver buiten Soho → Mevr. Susannah Eley (Hampstead) liet dagelijks water uit Broad Street halen, stierf. Patroon volgt het water, niet de wijk.
Dag 8-9 — hypothese hard, actie kiezen

Publicatie in The Lancet (weken; doden blijven vallen)
Meer data voor 100% zekerheid (te laat)
Pamfletten aan publiek (gedeeltelijk effect)
🎯 Board of Guardians overtuigen pomphendel te verwijderen
Dag 9-10 — eindkeuze

🎯 Handle removed → teller stopt. 8 september 1854. Sterfgevallen dalen binnen dagen naar nul.
Meer bewijs eisen → uitbraak zet door; slotscherm toont historische cijfers.
Debrief (15 min plenair)
Snow's originele kaart (1854) naast de kaart die de student opbouwde.
Historische noot: Pasteur's kiemtheorie kwam pas in 1884 — 30 jaar later. Snow handelde op patroon + wijsheid zonder mechanisme.
Klassikale DIKIWI-reconstructie: welke dag was D→I? Welke keuze was de K→Inzicht-sprong? Het model verschijnt pas hier, als verklarend achteraf-model op hun eigen beslissingen.
Transfer-zin: "Welke pomphendel staat in jouw vakgebied nog te wachten op iemand die de kaart tekent?"
Te maken materialen
Bestand	Doel
broad-street-zaak.html	Single-page webapp, sepia/Victoriaans, in lijn met bestaand Van Platte Data naar Ontologie.html. D3 of vanilla SVG voor kaart + punten.
data/snow-deaths.json	578 sterfgevallen met x,y-coördinaten, datum, adres. Bron: Robin Wilson's gedigitaliseerde versie van Snow's kaart.
data/snow-pumps.json	13 waterpompen met coördinaten en namen. Bron: idem.
data/soho-1854.svg of tile-image	Historische achtergrondkaart Soho. Bron: idem.
data/menu-content.json	Alle dag-menu-opties, geassocieerde data, en de visualisaties die ze tonen.
docentenhandleiding-I1.md	Opzet debrief, reconstructievragen, historische achtergrond, transfer-vragen.
Update ideeen.md	Nieuwe categorie I, snelkiezer-rij, werkvorm-beschrijving.
Kritieke bestanden om te raadplegen tijdens bouw
/Users/witoldtenhove/Projects/theoim/Van Platte Data naar Ontologie.html — stijlreferentie en techniek-patroon.
/Users/witoldtenhove/Projects/theoim/ideeen.md — plaatsing, snelkiezer-format, werkvorm-sjabloon (§3).
/Users/witoldtenhove/Projects/theoim/dikiwi.jpeg — visueel anker voor de debrief (paneel 1-6 matching Dag 1-9).
Robin Wilson's Snow-data: https://github.com/robintw/BroadStreetPump of vergelijkbare gegeorefereerde versie.
Verificatie
Functioneel (in browser):

Open broad-street-zaak.html. Dashboard toont Dag 1 · 56 doden · 9 dagen resterend.
Doorloop met alleen rode haringen: controleer dat elke keuze zinnige data toont zonder expliciete "dit helpt niet"-feedback, teller loopt, doden stapelen op kaart.
Doorloop met alleen 🎯-keuzes binnen 6 dagen: cluster moet visueel zichtbaar zijn na de kaart-keuze, pompen na waterpompen-keuze, anomalieën na interview-keuze.
Eindkeuze "handle removed" op dag ≤10 → slotscherm met historische cijfers. Eindkeuze "meer bewijs" → doorlopende uitbraak.
Op dag 10 zonder eindkeuze → hard stop met historische tegenfeitelijke cijfers (wat er gebeurd zou zijn zonder Snow's actie).
Didactisch (pilot met 1-2 studenten):

Student doorloopt oefening zonder DIKIWI-begrippen genoemd.
Student kan in debrief zelf reconstrueren welke keuze welk DIKIWI-stadium was.
Student verwoordt transfer naar eigen studieveld.
Integratie met ideeënbox:

ideeen.md snelkiezer-tabel bevat nieuwe rij I1.
Plaatsing als nieuwe §2.I sectie, analoog aan §2.E Datasaurus.
Verwijzing bij E4 dat I1 een alternatief dekt alle zes stadia.
Add Comment