# daniels-energy-cards

Eigene Lovelace-Karten für Home Assistant. TypeScript + [Lit](https://lit.dev),
gebaut mit Vite zu **einer einzelnen** JS-Datei ohne externe Laufzeit-Abhängigkeiten.

Aktuell enthalten:

| Karte                      | Zweck                                                    |
| -------------------------- | -------------------------------------------------------- |
| `custom:des-storage-card`  | Speicherkarte — Varianten `battery` und `thermal`         |

> **Phase 1:** Die Karte ist reine Darstellung. Alle Werte kommen als statische
> Werte direkt aus der YAML-Konfiguration — keine Entity-Bindung, keine
> Berechnungen. Die Buttons sind bewusst ohne Funktion. Siehe
> [Phase 2](#phase-2-entities-statt-statischer-werte).

---

## Build

```bash
npm install
npm run build
```

Ergebnis: `dist/daniels-energy-cards.js` (~34 kB, Lit ist mit eingebettet).

Weitere Skripte:

```bash
npm run watch      # Build im Watch-Modus
npm run typecheck  # tsc --noEmit
```

## Installation über HACS (empfohlen)

Das Repository ist als benutzerdefiniertes HACS-Repository vom Typ **Dashboard**
installierbar. Die gebaute Datei `dist/daniels-energy-cards.js` liegt fertig im
Repository — es gibt keine CI und keine Release-Assets, HACS lädt sie direkt aus
dem Standard-Branch.

1. In Home Assistant **HACS** öffnen.
2. Oben rechts **⋮ → Benutzerdefinierte Repositories**.
3. Eintragen:

   | Feld       | Wert                                          |
   | ---------- | --------------------------------------------- |
   | Repository | `https://github.com/y2yjvv9jpr-ui/HA-Cards`   |
   | Typ        | **Dashboard**                                 |

4. **Hinzufügen**, dann in der HACS-Liste „Daniels Energy Cards“ öffnen und
   **Herunterladen**.
5. Home Assistant neu starten bzw. Browser hart neu laden (Strg+Shift+R).

HACS legt die Datei unter `/config/www/community/HA-Cards/` ab und trägt die
Lovelace-Ressource in der Regel automatisch ein. Falls nicht, manuell
hinzufügen (**Einstellungen → Dashboards → ⋮ → Ressourcen**):

| Feld          | Wert                                          |
| ------------- | --------------------------------------------- |
| URL           | `/hacsfiles/HA-Cards/daniels-energy-cards.js` |
| Ressourcentyp | **JavaScript-Modul** (`module`)               |

> **Hinweis zum Dateinamen:** HACS erwartet standardmäßig eine `.js`-Datei, die
> so heißt wie das Repository. Da das Repository `HA-Cards` heißt, die Datei
> aber `daniels-energy-cards.js`, setzt die [`hacs.json`](hacs.json) den Key
> `filename` — der überschreibt die Namenskonvention. Beim Umbenennen der
> Build-Datei muss `hacs.json` mitgezogen werden.

## Installation manuell

1. `dist/daniels-energy-cards.js` nach `/config/www/` kopieren
   (der Ordner ist unter der URL `/local/` erreichbar).

2. Die Ressource registrieren — **Einstellungen → Dashboards → ⋮ → Ressourcen →
   Ressource hinzufügen**:

   | Feld     | Wert                            |
   | -------- | ------------------------------- |
   | URL      | `/local/daniels-energy-cards.js` |
   | Ressourcentyp | **JavaScript-Modul** (`module`) |

   Alternativ in der `configuration.yaml` (nur im YAML-Modus):

   ```yaml
   lovelace:
     resources:
       - url: /local/daniels-energy-cards.js
         type: module
   ```

3. Browser-Cache leeren bzw. Hard-Reload (Strg+Shift+R). Bei jedem Update der
   Datei hilft ein Versions-Query wie `/local/daniels-energy-cards.js?v=2`.

Die Karte erscheint danach auch im Karten-Picker als „Daniels Speicherkarte“.
Einen visuellen Editor gibt es bewusst nicht — die Konfiguration erfolgt in YAML.

---

## Konfiguration

```yaml
type: custom:des-storage-card
```

| Option           | Typ                                                        | Variante | Beschreibung                                                        |
| ---------------- | ---------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| `variant`        | `battery` \| `thermal`                                      | —        | **Pflicht.** Bestimmt Layout und Bedienzeile.                        |
| `name`           | string                                                      | —        | **Pflicht.** Titel links in der Kopfzeile.                           |
| `status`         | `charging` \| `discharging` \| `idle` \| `heating` \| `off` | —        | **Pflicht.** Steuert das Status-Badge rechts oben.                   |
| `soc`            | number (%)                                                  | battery  | Ladestand, füllt das Batteriesymbol und steht groß daneben.          |
| `capacity_kwh`   | number                                                      | battery  | Nennkapazität, erscheint in der Subzeile.                            |
| `energy_kwh`     | number                                                      | beide    | battery: Restenergie · thermal: heute eingespeicherte kWh.           |
| `power_w`        | number                                                      | beide    | Vorzeichen: **negativ = Entladen**, **positiv = Laden/Heizen**.      |
| `temp_c`         | number \| `null`                                            | battery  | Akkutemperatur. Bei `null` entfällt die Zeile komplett.              |
| `threshold_pct`  | number                                                      | battery  | Entladeschwelle, Startwert des Sliders (10–80, Schritt 5).           |
| `time_remaining` | string \| `null`                                            | beide    | Freitext, z. B. `"4:36 h bis 50 %"`.                                 |
| `time_at`        | string \| `null`                                            | beide    | Freitext, z. B. `"um 00:12"`.                                        |
| `backup`         | `none` \| `ready` \| `active`                               | beide    | Notstrom-Badge. Bei `none` (Standard) ausgeblendet.                  |

### Darstellung im Detail

- **Kopfzeile** — Name links, rechts das Status-Badge. Bei `backup: ready`
  steht davor ein grünes „Notstrom bereit“, bei `backup: active` ein rotes
  „NOTSTROM AKTIV“.
- **Status-Farben** — `charging` blau (`--info-color`), `discharging` und
  `heating` amber (`--warning-color`), `idle` und `off` grau
  (`--secondary-text-color`). Hintergrund jeweils transparent eingefärbt.
- **Batteriesymbol** — als SVG gezeichnet, Füllbreite entspricht `soc`.
  Farbe: grün über 50 %, gelb von 20–50 %, rot unter 20 %.
- **Leistung** — rot bei negativem, grün bei positivem `power_w`, mit
  Vorzeichen und Tausenderpunkt (`-1.240 W`, `+2.450 W`, `0 W`).
- **Zahlenformat** — deutsches Format (`de-DE`): Komma als Dezimaltrenner,
  Punkt als Tausendertrenner.

Die Karte nutzt ausschließlich HA-Theme-Variablen (`--card-background-color`,
`--primary-text-color`, `--secondary-text-color`, …) und passt sich damit
hellem wie dunklem Theme an. `card-mod` wird nicht benötigt.

---

## Beispiel-YAML — alle sechs Karteninstanzen

```yaml
type: vertical-stack
cards:
  # ---------- Hausakkus ----------
  - type: custom:des-storage-card
    variant: battery
    name: Hausakku 1
    status: discharging
    soc: 62
    capacity_kwh: 10.2
    energy_kwh: 6.3
    power_w: -1240
    temp_c: 23.5
    threshold_pct: 20
    time_remaining: 4:36 h bis 50 %
    time_at: um 00:12
    backup: none

  - type: custom:des-storage-card
    variant: battery
    name: Hausakku 2
    status: charging
    soc: 18
    capacity_kwh: 10.2
    energy_kwh: 1.8
    power_w: 2450
    temp_c: 21.0
    threshold_pct: 15
    time_remaining: 2:10 h bis 80 %
    time_at: um 14:45
    backup: none

  # ---------- Zendure mit Notstrom ----------
  - type: custom:des-storage-card
    variant: battery
    name: Zendure
    status: idle
    soc: 88
    capacity_kwh: 3.84
    energy_kwh: 3.4
    power_w: 0
    temp_c: null
    threshold_pct: 30
    time_remaining: null
    time_at: null
    backup: ready

  # ---------- Aquarien als Wärmespeicher ----------
  - type: custom:des-storage-card
    variant: thermal
    name: Aquarium Wohnzimmer
    status: heating
    energy_kwh: 1.24
    power_w: 300
    temp_c: null
    time_remaining: noch 0:45 h
    time_at: bis 15:30
    backup: none

  - type: custom:des-storage-card
    variant: thermal
    name: Aquarium Büro
    status: off
    energy_kwh: 0.42
    power_w: 0
    temp_c: null
    time_remaining: null
    time_at: null
    backup: none

  - type: custom:des-storage-card
    variant: thermal
    name: Aquarium Keller
    status: heating
    energy_kwh: 12.75
    power_w: 1200
    temp_c: null
    time_remaining: noch 2:15 h
    time_at: bis 17:00
    backup: active
```

> **YAML-Hinweis:** `status: off` muss so notiert werden — HA nutzt YAML 1.1,
> dort wird unquotiertes `off` zu `false`. Der HA-Editor quotet den Wert beim
> Speichern automatisch (`status: "off"`); beides funktioniert.

---

## Phase 2: Entities statt statischer Werte

Die Config-Schlüssel sind nach dem **Wert** benannt, den sie tragen, nicht nach
ihrer Quelle. Dadurch kann später an genau derselben Stelle eine Entity stehen:

```yaml
soc: 62                    # Phase 1 — statisch
soc: sensor.akku_soc       # Phase 2 — Entity, gleicher Schlüssel
```

Dafür sind nur zwei Stellen anzufassen:

- [`src/types.ts`](src/types.ts) — die betroffenen Felder auf `number | string`
  bzw. `string` erweitern.
- [`src/resolve.ts`](src/resolve.ts) — `resolveNumber()` / `resolveString()` um
  den Zweig ergänzen, der eine Entity-ID in `hass.states` nachschlägt.

Kein einziger Aufrufer in der Karte muss geändert werden. Ebenso vorbereitet:
die Klick-Handler `_onChargeNow()` und `_onToggleHeater()` in
[`src/des-storage-card.ts`](src/des-storage-card.ts) sind bewusst leer und
warten auf die passenden Service-Calls.

## Projektstruktur

```
src/
  index.ts             Registrierung des Custom Elements + Karten-Picker-Eintrag
  des-storage-card.ts  Die Karte selbst (Rendering + Styles)
  types.ts             Config-Schema und HA-Typen
  resolve.ts           Nahtstelle statischer Wert ↔ Entity (Phase 2)
  format.ts            Zahlenformatierung (de-DE)
vite.config.ts         Lib-Build → dist/daniels-energy-cards.js
hacs.json              HACS-Manifest (Typ Dashboard)
dist/                  Build-Ergebnis — wird bewusst mitcommittet,
                       weil HACS die Datei direkt aus dem Repo ausliefert
```

> Nach jeder Codeänderung `npm run build` ausführen **und** `dist/` mit
> committen, sonst installiert HACS weiterhin den alten Stand.
