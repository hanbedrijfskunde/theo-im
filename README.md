# THEOIM — Werkvormen & materialen

> **Live:** <https://hanbedrijfskunde.github.io/theo-im/>
> Direct naar de werkvorm: <https://hanbedrijfskunde.github.io/theo-im/broad-street-zaak.html>

Onderwijsmateriaal voor de module **THEOIM** (Theorie & Methode van Onderzoek / Informatie & Management) in het eerste jaar Bedrijfskunde. Kern-model: **DIKIWI** — Data → Informatie → Kennis → Inzicht → Wijsheid → Impact.

Deze repo bevat werkvormen, interactieve webapps en docentenhandleidingen die studenten het DIKIWI-model laten *ervaren* in plaats van alleen bestuderen.

## Structuur

- [`index.html`](index.html) — landingspagina met overzicht van werkvormen.
- [`broad-street-zaak.html`](broad-street-zaak.html) — interactieve werkvorm I1.
- [`ideeen.md`](ideeen.md) — Ideeënbox met alle werkvormen, gegroepeerd in categorieën A-I.
- [`docs/`](docs/) — product-specs, takenlijst en pilot-notes per werkvorm.
- [`docentenhandleiding-I1.md`](docentenhandleiding-I1.md) — docentenhandleiding Broad Street Zaak.

## Werkvorm in productie

**De Broad Street Zaak (I1)** — Victoriaanse detective-werkvorm rond John Snow's cholera-onderzoek in Soho 1854. Zie [`docs/prd-broad-street-zaak.md`](docs/prd-broad-street-zaak.md) voor het volledige PRD.

## Lokale ontwikkeling

Geen build-stap; open direct in de browser via een lokale webserver:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deployment

GitHub Pages serveert automatisch vanuit `main`/root. Elke push naar `main` is binnen enkele minuten live op de URL bovenaan deze README. Geen CI/CD-configuratie nodig.

## Data

De 578 sterfgevallen en 13 waterpompen komen uit het [HistData R-package](https://friendly.github.io/HistData/reference/Snow.html) (Dodson's digitalisatie van Snow's originele 1855-kaart). Synthetische velden (namen, leeftijden, adressen, klasse) worden deterministisch gegenereerd door [`scripts/generate_data.py`](scripts/generate_data.py).
