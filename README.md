# daniels-energy-cards

Eigene Lovelace-Karten für Home Assistant. TypeScript + [Lit](https://lit.dev),
gebaut mit Vite zu **einer einzelnen** JS-Datei ohne externe Laufzeit-Abhängigkeiten.

Aktuell enthalten:

| Karte                     | Zweck                                                     |
| ------------------------- | --------------------------------------------------------- |
| `custom:des-storage-card` | Speicherkarte — Varianten `battery` und `thermal_group`    |

> **Phase 1:** Die Karte ist reine Darstellung. Alle Werte kommen als statische
> Werte direkt aus der YAML-Konfiguration — keine Entity-Bindung, keine
> Berechnungen. Die Bedienelemente schalten ausschließlich den lokalen
> Anzeigezustand um; nichts wird gespeichert. Siehe
> [Phase 2](#phase-2-entities-statt-statischer-werte).

---

## Build

```bash
npm install
npm run build
```

Ergebnis: `dist/daniels-energy-cards.js` (~42 kB, Lit ist mit eingebettet).

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

Gemeinsame Optionen:

| Option    | Typ                              | Beschreibung                          |
| --------- | -------------------------------- | ------------------------------------- |
| `variant` | `battery` \| `thermal_group`     | **Pflicht.** Bestimmt das Layout.     |
| `name`    | string                           | **Pflicht.** Titel in der Kopfzeile.  |

### `variant: battery`

Kompakte Karte für einen einzelnen Akku. Die Bedienzeile ist **standardmäßig
eingeklappt** — ein Klick auf die Hauptzeile oder das Chevron klappt sie auf.

| Option           | Typ                                                                     | Beschreibung                                                     |
| ---------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `status`         | `charging` \| `discharging` \| `idle` \| `standby` \| `heating` \| `off` | **Pflicht.** Steuert das Status-Badge.                            |
| `soc`            | number (%)                                                              | Ladestand; füllt das Batteriesymbol, steht groß daneben.          |
| `capacity_kwh`   | number                                                                  | Kapazität — erstes Segment der Meta-Zeile.                        |
| `energy_kwh`     | number                                                                  | Restenergie, klein neben dem Ladestand.                           |
| `power_w`        | number                                                                  | Vorzeichen: **negativ = Entladen**, **positiv = Laden**.          |
| `temp_c`         | number \| `null`                                                        | Akkutemperatur. Bei `null` entfällt das Segment in der Meta-Zeile. |
| `threshold_pct`  | number                                                                  | Minimaler Ladestand; Startwert des Sliders (10–80, Schritt 5).    |
| `charge_target_pct` | number                                                               | Ladeziel für erzwungenes Laden; Slider 50–100, Schritt 5. Standard: `100`. |
| `charge_mode`    | `auto` \| `charge`                                                      | Startzustand des Lademodus. Standard: `auto`.                     |
| `time_remaining` | string \| `null`                                                        | Freitext, z. B. `"4:36 h bis 20 %"`.                              |
| `time_at`        | string \| `null`                                                        | Freitext, z. B. `"um 00:12"`.                                     |
| `backup`         | `none` \| `ready` \| `active`                                           | Notstrom-Badge. Bei `none` (Standard) ausgeblendet.               |

**Aufbau**

- **Kopfzeile** — Name, direkt daneben gedämpft
  `Kapazität · Temperatur · min. SoC` (Temperatur-Segment entfällt bei
  `temp_c: null`). Rechts die Badges: bei
  `backup: ready` grün „Notstrom bereit“, bei `backup: active` rot
  „NOTSTROM AKTIV“, danach das Status-Badge.
- **Hauptzeile** — aufrechtes SVG-Batteriesymbol (Füllstand von unten, grün über
  50 %, gelb 20–50 %, rot darunter), daneben Ladestand und Restenergie auf einer
  Basislinie. Rechts die Leistung farbig, darunter gedämpft
  `time_remaining · time_at` (entfällt, wenn beide `null` sind), ganz rechts das
  Chevron.
- **Bedienbereich** (aufgeklappt) — zwei beschriftete Slider-Zeilen auf einem
  gemeinsamen Raster, damit Labels, Regler und Werte fluchten:

  | Zeile | Steuerung                        | Label      | Slider              |
  | ----- | -------------------------------- | ---------- | ------------------- |
  | 1     | Umschalter **Laden \| Auto**     | „Ladeziel“ | `charge_target_pct` |
  | 2     | —                                | „min. SoC“ | `threshold_pct`     |

  Der Ladeziel-Slider ist **nur im Modus `charge` aktiv** und sonst ausgegraut —
  ein Ladeziel ohne erzwungenes Laden hat keine Wirkung. Der `min. SoC`-Slider
  ist immer aktiv und aktualisiert auch das Segment in der Kopfzeile.

**Lademodus** — der Umschalter zeigt den *aktuellen* Modus als aktives Segment
(gleiche Optik wie bei `thermal_group`):

| `charge_mode` | Aktives Segment | Bedeutung                                  |
| ------------- | --------------- | ------------------------------------------ |
| `auto`        | „Auto“          | Normalbetrieb, Ladeziel-Slider ausgegraut  |
| `charge`      | „Laden“         | Laden erzwungen, ggf. aus dem Netz         |

**Temperatur-Ampel** — das °C-Segment in der Kopfzeile färbt sich nach Wert:

| Bereich          | Farbe    |
| ---------------- | -------- |
| unter 4 °C       | rot      |
| 4 bis unter 8 °C | gelb     |
| 8 bis 40 °C      | neutral  |
| über 40 bis 50 °C| gelb     |
| über 50 °C       | rot      |

### `variant: thermal_group`

Fasst 1–5 Wärmesenken (z. B. Aquarien) in **einer** Karte zusammen.

| Option  | Typ                | Beschreibung                          |
| ------- | ------------------ | ------------------------------------- |
| `items` | Liste (1–5) unten  | **Pflicht.** Die einzelnen Verbraucher. |

Je Eintrag in `items`:

| Option       | Typ                       | Beschreibung                                      |
| ------------ | ------------------------- | ------------------------------------------------- |
| `name`       | string                    | **Pflicht.** Zeilenbeschriftung.                  |
| `energy_kwh` | number                    | Heute eingespeichert.                             |
| `power_w`    | number                    | Aktuelle Heizleistung; `> 0` zählt als „heizt“.   |
| `mode`       | `on` \| `auto` \| `off`   | Startstellung des Umschalters. Standard: `auto`.  |

**Aufbau**

- **Kopfzeile** — Name links, rechts das Badge: blau „N heizen“ (N = Einträge
  mit `power_w > 0`) bzw. grau „Aus“, wenn keiner heizt. Blau wie „Lädt“ beim
  Akku — Heizen lädt den Wärmespeicher.
- **Summenzeile** — Fisch-Icon, Summe aller `energy_kwh` groß mit „heute
  eingespeichert“, rechts die Gesamtleistung (grün, wenn > 0).
- **Eine Zeile je Eintrag** — Name, Energie, Leistung und ein Umschalter
  **An | Auto | Aus**. `Auto` überlässt die Entscheidung der Überschusslogik,
  `An`/`Aus` erzwingen den Zustand.

### Allgemeines

- **Zahlenformat** — deutsches Format (`de-DE`): Komma als Dezimaltrenner, Punkt
  als Tausendertrenner. Leistungen mit Vorzeichen (`-1.240 W`, `+2.450 W`,
  `0 W`).
- **Leistungsfarben** — durchgängig gleich: **grün** bei positiver Leistung
  (Laden bzw. Heizen), **rot** bei negativer (Entladen), gedämpft bei `0 W`.
- **Theme** — ausschließlich HA-Theme-Variablen (`--card-background-color`,
  `--primary-text-color`, `--secondary-text-color`, `--info-color`,
  `--warning-color`, `--success-color`, `--error-color`), hell wie dunkel.
  `card-mod` wird nicht benötigt.
- **Phase 1** — alle Bedienelemente ändern **nur den lokalen Anzeigezustand**:
  Aufklappzustand, Lademodus, Slider und Umschalter. Nichts wird gespeichert,
  ein Reload stellt die Konfigurationswerte wieder her.

### YAML-Fallstricke

Home Assistant parst mit **YAML 1.1** — unquotiertes `on`/`off` wird dort zu
`true`/`false`. Die Karte fängt das ab:

| Geschrieben        | YAML liefert | Karte versteht |
| ------------------ | ------------ | -------------- |
| `status: off`      | `false`      | Status „Aus“   |
| `status: standby`  | `"standby"`  | wie `idle`     |
| `mode: on`         | `true`       | Modus `on`     |
| `mode: off`        | `false`      | Modus `off`    |

Quoten (`status: "off"`) funktioniert genauso; der HA-Editor tut das beim
Speichern automatisch.

---

## Beispiel-YAML

Zwei Hausakkus, die Zendure mit Notstrom, dazu eine Gruppenkarte für die drei
Aquarien:

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
    charge_target_pct: 90
    charge_mode: auto
    time_remaining: 4:36 h bis 20 %
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
    charge_target_pct: 80
    charge_mode: charge
    time_remaining: 2:10 h bis 15 %
    time_at: um 14:45
    backup: none

  # ---------- Zendure mit Notstrom ----------
  # temp_c: null lässt das °C-Segment in der Kopfzeile weg.
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
    charge_target_pct: 100
    charge_mode: auto
    time_remaining: null
    time_at: null
    backup: ready

  # ---------- Aquarien als eine Gruppe ----------
  - type: custom:des-storage-card
    variant: thermal_group
    name: Aquarien
    items:
      - name: Wohnzimmer 1200 L
        energy_kwh: 1.24
        power_w: 300
        mode: auto
      - name: Büro 700 L
        energy_kwh: 0.42
        power_w: 0
        mode: "off"
      - name: Keller 600 L
        energy_kwh: 12.75
        power_w: 1200
        mode: "on"
```

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
die lokalen Umschalter (`_toggleChargeMode()`, `_setItemMode()`,
`_onThresholdInput()`) in [`src/des-storage-card.ts`](src/des-storage-card.ts)
kapseln den Zustand bereits an einer Stelle — dort kommen später die
Service-Calls dazu.

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
