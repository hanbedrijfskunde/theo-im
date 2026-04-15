"""Genereer alle data-bestanden voor De Broad Street Zaak.

Gebruikt echte historische Snow-data uit HistData (via Rdatasets CSV-mirror):
- 578 sterfgevallen met coordinaten uit Snow's eigen kaart
- 13 pompen waaronder de Broad Street pomp
- Straten-segmenten voor de Soho-kaart als SVG
- Sterftecurve per dag (Snow.dates)

Deze data is vrij beschikbaar onder de GPL/MIT-licentie van HistData.
Oorspronkelijke bron: Dr. John Snow, 1855, "On the Mode of Communication of Cholera".
Digitalisering: Rusty Dodson (1992), Friendly's HistData R-package.

Extra velden (namen, leeftijden, adressen) worden synthetisch gegenereerd
met vaste seed zodat runs reproduceerbaar zijn.
"""

from __future__ import annotations
import csv
import json
import math
import random
from datetime import date, timedelta
from pathlib import Path

SEED = 1854
random.seed(SEED)

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"
RAW = DATA / "raw"
CONTENT = ROOT / "content"
DATA.mkdir(exist_ok=True)
CONTENT.mkdir(exist_ok=True)

CANVAS = (1024, 768)

# HistData coordinate-range afgeleid uit streets (de ruimste):
# x: 3.39 - 19.91, y: 3.23 - 18.73. We mappen naar 1024x768 met padding.
SRC_X_MIN, SRC_X_MAX = 3.0, 20.0
SRC_Y_MIN, SRC_Y_MAX = 3.0, 19.0


def project(x: float, y: float) -> tuple[int, int]:
    """HistData-coordinaat naar canvas-pixel. y wordt omgedraaid (hoog y in bron = noord = boven op scherm)."""
    fx = (x - SRC_X_MIN) / (SRC_X_MAX - SRC_X_MIN)
    fy = 1.0 - (y - SRC_Y_MIN) / (SRC_Y_MAX - SRC_Y_MIN)
    return int(round(fx * CANVAS[0])), int(round(fy * CANVAS[1]))


SOHO_STREETS = [
    "Broad Street", "Cambridge Street", "Poland Street", "Silver Street",
    "Berwick Street", "Dufour's Place", "Marshall Street", "Lexington Street",
    "Peter Street", "Hopkins Street", "Kemp's Court", "Portland Street",
    "Great Pulteney Street", "Brewer Street", "Golden Square", "Bridle Lane",
    "Warwick Street", "Beak Street", "Regent Street", "Carnaby Street",
]

FIRST_NAMES_M = ["William", "John", "Thomas", "George", "James", "Henry", "Charles", "Robert", "Edward", "Frederick"]
FIRST_NAMES_F = ["Mary", "Elizabeth", "Sarah", "Anne", "Margaret", "Jane", "Emma", "Ellen", "Hannah", "Susannah"]
SURNAMES = ["Barnes", "Clarke", "Davies", "Edwards", "Fletcher", "Griffith", "Harris", "Jackson", "King", "Lewis",
            "Morgan", "Newman", "Oliver", "Parker", "Quinn", "Roberts", "Stevens", "Taylor", "Walker", "Wilson",
            "Young", "Ashford", "Blake", "Cole", "Dunn", "Eley", "Freeman", "Gray", "Hall", "Ingram"]


def random_name(gender: str) -> str:
    first = random.choice(FIRST_NAMES_M if gender == "M" else FIRST_NAMES_F)
    return f"{first} {random.choice(SURNAMES)}"


def write_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"  wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


def read_csv(path: Path) -> list[dict]:
    with path.open() as f:
        return list(csv.DictReader(f))


def load_deaths() -> list[dict]:
    """Echte Snow.deaths + synthetische namen/leeftijden/adressen + datum uit dates-curve."""
    raw = read_csv(RAW / "snow-deaths.csv")
    dates = read_csv(RAW / "snow-dates.csv")

    # Verdeel doden over dagen volgens dates-curve (alleen dagen met deaths > 0).
    # Snow.dates loopt van 1854-08-19 t/m 1854-09-30. Alleen sterftedagen gebruiken.
    death_curve = [(d["date"], int(d["deaths"])) for d in dates if int(d["deaths"]) > 0]
    total = sum(c for _, c in death_curve)
    # Snow.deaths heeft 578 records; Snow.dates telt meestal minder (rapportage-lag)
    # We mappen op index-volgorde: eerste N doden naar eerste datum met doden, etc.
    # Als som curve != 578 schalen we proportioneel.
    scale = len(raw) / total if total else 1

    expanded_dates: list[str] = []
    for day, count in death_curve:
        scaled = max(1, round(count * scale))
        expanded_dates.extend([day] * scaled)
    # trim/pad naar exact len(raw)
    while len(expanded_dates) < len(raw):
        expanded_dates.append(death_curve[-1][0])
    expanded_dates = expanded_dates[:len(raw)]

    deaths = []
    for i, row in enumerate(raw, 1):
        x, y = project(float(row["x"]), float(row["y"]))
        gender = "M" if random.random() < 0.48 else "F"
        age = max(1, int(random.gauss(32, 20)))
        street = random.choice(SOHO_STREETS)
        house = random.randint(1, 120)
        deaths.append({
            "id": f"d{i:04d}",
            "x": x,
            "y": y,
            "date": expanded_dates[i - 1],
            "name": random_name(gender),
            "address": f"{house} {street}",
            "age": age,
            "gender": gender,
        })
    return deaths


def load_pumps() -> list[dict]:
    """Echte Snow.pumps met Broad Street pomp gemarkeerd."""
    raw = read_csv(RAW / "snow-pumps.csv")
    pumps = []
    for row in raw:
        x, y = project(float(row["x"]), float(row["y"]))
        is_broad = row["label"].strip().lower().startswith("broad")
        pumps.append({
            "id": f"p{int(row['pump']):02d}",
            "name": row["label"].strip() + (" Pump" if not row["label"].strip().endswith("Pump") else ""),
            "x": x,
            "y": y,
            "isBroadStreet": is_broad,
        })
    return pumps


def load_streets() -> dict:
    """Straten-segmenten als SVG path data en ook als gestructureerde lijst."""
    raw = read_csv(RAW / "snow-streets.csv")
    # Group by (street, n): n is het lijn-segment-nummer binnen de straat.
    segments: dict[tuple[str, str], list[tuple[int, int]]] = {}
    for row in raw:
        key = (row["street"], row["n"])
        x, y = project(float(row["x"]), float(row["y"]))
        segments.setdefault(key, []).append((x, y))

    polylines = []
    for (street, n), points in segments.items():
        polylines.append({
            "street": street,
            "segment": n,
            "points": points,
        })
    return {"polylines": polylines, "canvas": {"width": CANVAS[0], "height": CANVAS[1]}}


def streets_to_svg(streets: dict) -> str:
    """Render streets als SVG polylines, sepia-gestyled."""
    lines = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {CANVAS[0]} {CANVAS[1]}" '
        'preserveAspectRatio="xMidYMid meet">',
        '<rect width="100%" height="100%" fill="#f4ecd8"/>',
        '<g stroke="#6b5a3e" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.85">',
    ]
    for pl in streets["polylines"]:
        pts = " ".join(f"{x},{y}" for x, y in pl["points"])
        lines.append(f'  <polyline points="{pts}"/>')
    lines.append('</g>')
    lines.append('</svg>')
    return "\n".join(lines)


def generate_poi(pumps: list[dict]) -> dict:
    """Plausibele Soho POI's voor rode-haring-lagen. Verspreid rond het stratenraster."""
    broad = next(p for p in pumps if p["isBroadStreet"])
    cx, cy = broad["x"], broad["y"]

    def near(dx, dy, jitter_radius=30):
        return (cx + dx + random.randint(-jitter_radius, jitter_radius),
                cy + dy + random.randint(-jitter_radius, jitter_radius))

    def mk(items, type_, id_prefix):
        out = []
        for i, (name, (x, y), *rest) in enumerate(items, 1):
            item = {"id": f"{id_prefix}{i:02d}", "name": name, "x": x, "y": y, "type": type_}
            if rest:
                item["note"] = rest[0]
            out.append(item)
        return out

    return {
        "schools": mk([
            ("St James's National School", near(-180, -120)),
            ("Poland Street Charity School", near(-80, -140)),
            ("Golden Square School", near(-40, 180)),
            ("Regent Street Polytechnic", near(-260, 60)),
        ], "school", "sch"),
        "workhouses": mk([
            ("St James's Workhouse (Poland Street)", near(-40, 20), "Eigen waterbron, opvallend lage sterfte"),
            ("St Anne's Workhouse", near(220, 140)),
            ("Strand Union Workhouse", near(300, 240)),
        ], "workhouse", "wh"),
        "markets": mk([
            ("Carnaby Market", near(120, -60)),
            ("Berwick Street Market", near(60, 90)),
            ("Newport Market", near(340, 180)),
        ], "market", "m"),
        "slaughterhouses": mk([
            ("Marshall Street Slaughterhouse", near(-40, -80)),
            ("Peter Street Shambles", near(180, 160)),
            ("Kingly Street Abattoir", near(200, -140)),
        ], "slaughterhouse", "sl"),
        "breweries": mk([
            ("Lion Brewery (Huggins & Co.)", near(30, -10), "70+ arbeiders, drinken bier, geen doden"),
        ], "brewery", "br"),
    }


def generate_density(pumps: list[dict]) -> list[dict]:
    """Bevolkingsdichtheid-grid. Hoge dichtheid in Soho algemeen, piek rond Broad Street —
    maar cluster van doden is nog dichter dan dichtheid alleen verklaart."""
    broad = next(p for p in pumps if p["isBroadStreet"])
    cx, cy = broad["x"], broad["y"]
    grid = []
    step = 64
    for x in range(step // 2, CANVAS[0], step):
        for y in range(step // 2, CANVAS[1], step):
            dist = math.hypot(x - cx, y - cy)
            base = 60 + random.randint(0, 30)
            density = base + max(0, int(120 - dist * 0.25))
            grid.append({"x": x, "y": y, "density": min(255, density)})
    return grid


def generate_timeline() -> list[dict]:
    """Volledige outbreak-timeline uit Snow.dates."""
    raw = read_csv(RAW / "snow-dates.csv")
    timeline = []
    cumulative = 0
    for i, row in enumerate(raw, 1):
        deaths = int(row["deaths"])
        cumulative += deaths
        timeline.append({
            "day": i,
            "date": row["date"],
            "newDeaths": deaths,
            "attacks": int(row["attacks"]),
            "cumulativeDeaths": cumulative,
        })
    return timeline


def generate_red_herrings() -> dict[str, object]:
    herrings: dict[str, object] = {}

    herrings["causes"] = [
        {"cause": "Cholera morbus (verified)", "count": 578},
        {"cause": "Diarrhea", "count": 42},
        {"cause": "Debility", "count": 18},
        {"cause": "Other", "count": 12},
    ]

    demographics = []
    age_bins = [(0, 5), (6, 14), (15, 29), (30, 44), (45, 59), (60, 120)]
    for lo, hi in age_bins:
        for g in ("M", "F"):
            count = random.randint(30, 90) if 15 <= lo <= 45 else random.randint(20, 70)
            demographics.append({
                "ageRange": f"{lo}-{hi}" if hi < 120 else f"{lo}+",
                "gender": g,
                "count": count,
            })
    herrings["demographics"] = demographics

    herrings["previousOutbreaks"] = [
        {"year": 1832, "city": "London", "deaths": 6536, "duration_weeks": 16},
        {"year": 1849, "city": "London", "deaths": 14137, "duration_weeks": 22},
        {"year": 1854, "city": "Soho (huidig)", "deaths": "onbekend (loopt)", "duration_weeks": "lopend"},
    ]

    herrings["europe"] = [
        {"city": "Paris", "country": "France", "year": 1854, "deaths": 9000, "note": "Verspreid over de stad"},
        {"city": "Hamburg", "country": "Germany", "year": 1854, "deaths": 1800, "note": "Havengebied"},
        {"city": "Naples", "country": "Italy", "year": 1854, "deaths": 4500, "note": "Hele stad"},
        {"city": "Copenhagen", "country": "Denmark", "year": 1853, "deaths": 4700, "note": "Recent, havenwijk"},
    ]

    herrings["classes"] = [
        {"class": "Ambachtsman", "count": 142},
        {"class": "Dagloner", "count": 118},
        {"class": "Dienstbode", "count": 94},
        {"class": "Winkelier", "count": 67},
        {"class": "Geestelijke", "count": 8},
        {"class": "Gegoede burger", "count": 41},
        {"class": "Onbekend", "count": 108},
    ]

    herrings["waterAnalysis"] = {
        "source": "Broad Street Pump, monster genomen 5 sep 1854",
        "analyst": "Dr. Arthur Hassall, microscopist",
        "findings": [
            "Heldere vloeistof, licht bitter van smaak",
            "Witte vlokjes zichtbaar onder microscoop (~0.02mm)",
            "Geen bekende miasma-indicator aanwezig",
            "Chemische samenstelling binnen normaal bereik voor stadswater",
        ],
        "conclusion_1854": "Niet doorslaggevend. Kiemtheorie bestaat nog niet; Pasteur's werk volgt in 1861-1884.",
    }

    herrings["otherPumps"] = [
        {"pump": "Warwick Pump", "result": "schoon"},
        {"pump": "Great Marlborough Pump", "result": "schoon"},
        {"pump": "Vigo St Pump", "result": "schoon"},
        {"pump": "Dean St Pump", "result": "schoon"},
        {"pump": "Coventry St Pump", "result": "schoon"},
        {"pump": "So Soho Pump", "result": "schoon"},
    ]

    return herrings


def generate_menu_content() -> dict:
    return {
        "stages": [
            {
                "stageId": "s1",
                "label": "Dag 1 — alleen dodencijfers",
                "dashboardStart": {"day": 1, "deaths": 56},
                "options": [
                    {"id": "s1-causes", "label": "Doodsoorzaken uit doktersregisters opvragen", "viz": "causesTable", "keyChoice": False},
                    {"id": "s1-demographics", "label": "Leeftijd en geslacht van de slachtoffers analyseren", "viz": "demographicsChart", "keyChoice": False},
                    {"id": "s1-previous", "label": "Sterftecijfers eerdere cholera-uitbraken (1832, 1849)", "viz": "previousOutbreaksTable", "keyChoice": False},
                    {"id": "s1-europe", "label": "Cholera elders in Europa dit jaar", "viz": "europeMap", "keyChoice": False},
                    {"id": "s1-addresses", "label": "Namen en adressen van de slachtoffers opvragen", "viz": "addressesTable", "keyChoice": True, "advancesStage": True},
                ],
            },
            {
                "stageId": "s2",
                "label": "Dag 2-3 — adressenlijst",
                "options": [
                    {"id": "s2-sort", "label": "Adressen alfabetisch sorteren", "viz": "addressesTableSorted", "keyChoice": False},
                    {"id": "s2-parish", "label": "Adressen groeperen per parochie", "viz": "parishGrouping", "keyChoice": False},
                    {"id": "s2-class", "label": "Beroep en sociale klasse van slachtoffers koppelen", "viz": "classTable", "keyChoice": False},
                    {"id": "s2-map", "label": "Adressen plotten op een kaart van Londen", "viz": "mapDeaths", "keyChoice": True, "advancesStage": True},
                ],
            },
            {
                "stageId": "s3",
                "label": "Dag 4-5 — cluster zichtbaar",
                "options": [
                    {"id": "s3-density", "label": "Bevolkingsdichtheid van Soho als laag toevoegen", "viz": "mapDensity", "keyChoice": False},
                    {"id": "s3-schools", "label": "Locaties van scholen markeren", "viz": "mapSchools", "keyChoice": False},
                    {"id": "s3-markets", "label": "Slachthuizen en markten markeren (miasma-verdachte locaties)", "viz": "mapMarkets", "keyChoice": False},
                    {"id": "s3-workhouses", "label": "Werkhuizen en armenhuizen markeren", "viz": "mapWorkhouses", "keyChoice": False},
                    {"id": "s3-pumps", "label": "Waterpompen in de buurt markeren", "viz": "mapPumps", "keyChoice": True, "advancesStage": True},
                ],
            },
            {
                "stageId": "s4",
                "label": "Dag 6-7 — pomp verdacht",
                "options": [
                    {"id": "s4-water", "label": "Chemische en microscopische analyse pompwater", "viz": "waterAnalysisPanel", "keyChoice": False},
                    {"id": "s4-otherpumps", "label": "Andere pompen laten testen", "viz": "otherPumpsTable", "keyChoice": False},
                    {"id": "s4-interviews", "label": "Interviews met overlevenden in het cluster (Lion Brewery, werkhuis)", "viz": "interviewsPanel", "keyChoice": True, "advancesStage": False},
                    {"id": "s4-outside", "label": "Sterfgevallen ver buiten Soho onderzoeken (Hampstead)", "viz": "hampsteadPanel", "keyChoice": True, "advancesStage": True},
                ],
            },
            {
                "stageId": "s5",
                "label": "Dag 8-9 — actie kiezen",
                "options": [
                    {"id": "s5-lancet", "label": "Publicatie in The Lancet voorbereiden", "viz": "lancetPreview", "keyChoice": False},
                    {"id": "s5-moredata", "label": "Meer data verzamelen voor 100% zekerheid", "viz": "moreDataProgress", "keyChoice": False},
                    {"id": "s5-pamphlets", "label": "Pamfletten onder het publiek verspreiden", "viz": "pamphletResults", "keyChoice": False},
                    {"id": "s5-board", "label": "Board of Guardians overtuigen de pomphendel te verwijderen", "viz": "boardMeeting", "keyChoice": True, "advancesStage": True},
                ],
            },
            {
                "stageId": "s6",
                "label": "Dag 9-10 — eindkeuze",
                "isFinal": True,
                "options": [
                    {"id": "s6-handle", "label": "Pomphendel verwijderen", "viz": "endingSuccess", "keyChoice": True, "endChoice": "handleRemoved"},
                    {"id": "s6-more", "label": "Meer bewijs eisen", "viz": "endingFailure", "keyChoice": False, "endChoice": "moreEvidence"},
                ],
            },
        ],
        "hardStopDay": 10,
    }


def main() -> None:
    print("Generating Snow data from real HistData (seed=1854)...")
    deaths = load_deaths()
    pumps = load_pumps()
    streets = load_streets()
    write_json(DATA / "snow-deaths.json", deaths)
    write_json(DATA / "snow-pumps.json", pumps)
    write_json(DATA / "snow-streets.json", streets)

    svg = streets_to_svg(streets)
    (DATA / "soho-1854.svg").write_text(svg, encoding="utf-8")
    print(f"  wrote data/soho-1854.svg ({(DATA / 'soho-1854.svg').stat().st_size} bytes)")

    write_json(DATA / "soho-poi.json", generate_poi(pumps))
    write_json(DATA / "soho-density.json", generate_density(pumps))
    write_json(DATA / "outbreak-timeline.json", generate_timeline())

    herrings = generate_red_herrings()
    write_json(DATA / "red-herring-causes.json", herrings["causes"])
    write_json(DATA / "red-herring-demographics.json", herrings["demographics"])
    write_json(DATA / "red-herring-previous-outbreaks.json", herrings["previousOutbreaks"])
    write_json(DATA / "red-herring-europe.json", herrings["europe"])
    write_json(DATA / "red-herring-class.json", herrings["classes"])
    write_json(DATA / "red-herring-water-analysis.json", herrings["waterAnalysis"])
    write_json(DATA / "red-herring-other-pumps.json", herrings["otherPumps"])

    write_json(CONTENT / "menu-content.json", generate_menu_content())
    print("Done.")


if __name__ == "__main__":
    main()
