# daniels-energy-cards

Eigene Lovelace-Karten für Home Assistant. TypeScript + [Lit](https://lit.dev),
gebaut mit Vite zu **einer einzelnen** JS-Datei ohne externe Laufzeit-Abhängigkeiten.

Aktuell enthalten:

| Karte                      | Zweck                                                     |
| -------------------------- | --------------------------------------------------------- |
| `custom:des-storage-card`  | Speicherkarte — Varianten `battery` und `thermal_group`    |
| `custom:des-inverter-card` | Wechselrichter-Übersicht — PV-Leistung, Strings, Phasen    |
| `custom:des-house-card`    | Hauskarte — Verbrauch und Stromherkunft (Solar/Speicher/Netz) |
| `custom:des-stats-card`    | Statistikkarte — sechs Energiewerte je Zeitraum (Tag/Woche/Monat/Jahr) |

> **Phase 3 — lesend und schreibend.** Jedes Wertfeld nimmt einen statischen
> Wert **oder** eine Entity-ID. Die Karte liest aus `hass.states`, rendert bei
> jedem Zustandswechsel neu, und jedes Bedienelement schreibt in die Entität,
> an die es gebunden ist. Ist ein Wert statisch konfiguriert, bleibt sein
> Bedienelement rein lokal. Siehe [Schreibverhalten](#schreibverhalten).

---

## Build

```bash
npm install
npm run build
```

Ergebnis: `dist/daniels-energy-cards.js` (~110 kB, gzip ~26 kB; Lit und **alle
vier** Karten sind mit eingebettet).

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

Die Karten erscheinen danach auch im Karten-Picker als „Daniels Speicherkarte“,
„Daniels Wechselrichterkarte“, „Daniels Hauskarte“ und „Daniels Statistikkarte“.
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

Sofern nicht anders vermerkt, nimmt jede Option einen statischen Wert **oder**
eine Entity-ID.

| Option                       | Typ                          | Beschreibung                                                                     |
| ---------------------------- | ---------------------------- | -------------------------------------------------------------------------------- |
| `soc`                        | number (%) \| Entity         | Ladestand; füllt das Batteriesymbol, steht groß daneben.                          |
| `capacity_kwh`               | number \| Entity             | Kapazität — erstes Segment der Meta-Zeile.                                        |
| `power_w`                    | number \| Entity             | **Bevorzugte Leistungsquelle.** Vorzeichen: **negativ = Entladen**, **positiv = Laden**. |
| `voltage_entity`             | Entity                       | Nur als **Fallback**, wenn `power_w` fehlt: zusammen mit `current_entity` U × I.  |
| `current_entity`             | Entity                       | siehe `voltage_entity`.                                                           |
| `invert_power`               | boolean                      | Dreht das Vorzeichen der ermittelten Leistung. Standard: `false`.                  |
| `power_share`                | number \| Entity             | Faktor auf die Leistung, für geteilte Summen-Entities. Standard: `1`.               |
| `idle_threshold_w`           | number \| Entity             | Unterhalb dieses Betrags gilt der Akku als „Bereit“. Standard: `20`.                |
| `status`                     | Status \| Entity             | **Optional** — ohne Angabe aus der Leistung abgeleitet.                            |
| `energy_kwh`                 | number \| Entity             | **Optional** — ohne Angabe aus `soc × capacity_kwh / 100` berechnet.               |
| `temp_c`                     | number \| Entity \| `null`   | Akkutemperatur. Bei `null` entfällt das Segment in der Meta-Zeile.                 |
| `threshold_pct`              | number \| Entity             | Minimaler Ladestand; Slider 10–80/5 oder aus der Entität, siehe unten.             |
| `charge_target_pct`          | number \| Entity             | Ladeziel für erzwungenes Laden; Slider 50–100/5 oder aus der Entität.               |
| `charge_mode`                | `auto` \| `charge` \| Entity | Anzeige des Lademodus, wenn kein `charge_mode_control` gesetzt ist.                |
| `charge_mode_control`        | Objekt                       | Bindet **Laden \| Auto** an eine Entität, siehe unten. Ohne dieses Feld bleibt der Umschalter lokal. |
| `time_remaining`             | string \| Entity             | Restzeit. Hat Vorrang vor den beiden folgenden.                                   |
| `time_remaining_charging`    | string \| Entity             | Restzeit, solange die Leistung positiv ist.                                       |
| `time_remaining_discharging` | string \| Entity             | Restzeit sonst.                                                                   |
| `time_at`                    | string \| Entity             | Zeitpunkt, z. B. `"um 00:12"`.                                                    |
| `backup`                     | Status \| Objekt             | Notstrom-Badge, siehe unten. Standard `none` (ausgeblendet).                       |
| `controls`                   | boolean                      | `false` blendet Bedienzeile **und** Chevron aus — reine Anzeigekarte. Standard `true`. |

Gültige `status`-Werte: `charging`, `discharging`, `idle`, `standby` (= `idle`),
`heating`, `off`.

**Abgeleitete Werte** — jedes dieser Felder darf fehlen:

| Feld         | Ableitung, wenn nicht gesetzt                                       |
| ------------ | ------------------------------------------------------------------- |
| `power_w`    | `voltage_entity × current_entity` — nur wenn `power_w` fehlt          |
| `status`     | Leistung ≤ −`idle_threshold_w` → `discharging`, ≥ +`idle_threshold_w` → `charging`, sonst `idle` |
| `energy_kwh` | `soc × capacity_kwh / 100`                                           |

**`backup` als Entität** — statt `none`/`ready`/`active` auch ein Objekt:

```yaml
backup:
  entity: sensor.zendure_offgrid_mode
  active_states: ["On"]      # Vergleich ohne Beachtung der Gross-/Kleinschreibung
```

Solange der State **nicht** in `active_states` steht, zeigt die Karte grün
„Notstrom bereit“, sonst rot „NOTSTROM AKTIV“. Ist die Entität nicht verfügbar,
entfällt das Badge — eine nicht lesbare Notstromquelle wird bewusst nicht als
„bereit“ gemeldet.

**Leistungsquelle** — ist `power_w` gesetzt, wird es verwendet; `voltage_entity`
× `current_entity` greift nur, wenn `power_w` fehlt. Eine Summen-Entität ist der
Rechnung aus BMS-Werten in aller Regel vorzuziehen: die BMS-Ströme kommen oft
nur in groben Schritten und mit Verzögerung.

**Vorzeichen** — die Karte erwartet **negativ = Entladen**, **positiv = Laden**.
Deye-Wechselrichter melden es umgekehrt (negativ = Laden); dafür ist
`invert_power: true` gedacht. Der Dreh gilt für `power_w` **und** für den
U × I-Fallback und wirkt, bevor Status, Farbe und Anzeige abgeleitet werden.

**`power_share`** — multipliziert die Leistung, nachdem das Vorzeichen steht.
Gedacht für eine Summen-Entität, die auf mehrere Karten verteilt wird: zwei
Hausakkus hinter einem Wechselrichter bekommen je `0.5`. Der Faktor wirkt
**nur** auf die Leistung — nie auf `soc`, `capacity_kwh`, `energy_kwh` oder die
Restzeiten. Hängt `power_share` an einer Entität, die sich nicht lesen lässt,
zeigt die Karte „–“ statt der ungeteilten Summe.

**`idle_threshold_w`** — Totzone um null. Liegt der Betrag der Leistung
darunter, steht der Status auf „Bereit“ und der Wert wird gedämpft ohne
Vorzeichenfarbe dargestellt. Das verhindert ein „Entlädt“ wegen ein paar Watt
Leerlaufstrom. Genau auf der Schwelle zählt es bereits als Laden bzw. Entladen.

**Restzeit** — ohne `time_remaining` wählt die Karte nach dem Vorzeichen der
Leistung: positiv → `time_remaining_charging`, sonst
`time_remaining_discharging`. States wie `Not Charging`, `Not Discharging`,
`unknown` oder `unavailable` blenden die Zeile aus.

**`charge_mode_control`** — macht aus dem Umschalter **Laden | Auto** ein
schreibendes Bedienelement:

```yaml
charge_mode_control:
  entity: input_select.zendure_operation_mode
  charge_state: ZENDURE_CHARGE_OPTION   # Option, die erzwungenes Laden bedeutet
  auto_state: ZENDURE_AUTO_OPTION       # Option für den Normalbetrieb
```

Der Service richtet sich nach der Domain der Entität:

| Domain                      | Service                | `charge_state` / `auto_state`     |
| --------------------------- | ---------------------- | --------------------------------- |
| `select`, `input_select`    | `select_option`        | **Pflicht** — die Options-Strings |
| `switch`, `input_boolean`   | `turn_on` / `turn_off` | optional, Standard `on` / `off`   |

Das aktive Segment wird aus dem State abgeleitet: **nur** ein Treffer auf
`charge_state` bedeutet **Laden**, alles andere **Auto**. Ein dritter Zustand
(die Zendure kennt z. B. `Standby`) ist damit korrekt *kein* Laden — aus
„nicht `auto_state`“ wird nicht mehr auf Laden geschlossen.

Für ein `select`/`input_select` sind **beide** Optionen Pflicht; fehlt eine,
meldet die Karte beim Laden einen Konfigurationsfehler statt still den
falschen Zustand anzuzeigen. Die Options-Strings müssen exakt so lauten wie
in Entwicklerwerkzeuge → Zustände (Groß-/Kleinschreibung und Leerzeichen am
Rand werden dabei ignoriert).

Lässt sich die Entität gerade nicht lesen, ist **kein** Segment aktiv und der
Umschalter wird abgeblendet — eine falsche Entity-ID fällt so sofort auf,
statt als selbstbewusstes „Laden“ durchzugehen.

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
- **Bedienbereich** (aufgeklappt) — links untereinander zwei beschriftete
  Slider-Zeilen auf einem gemeinsamen Raster, damit Labels, Regler und Werte
  fluchten; rechts daneben, über beide Zeilen zentriert, der Umschalter
  **Laden | Auto**:

  | Zeile | Label      | Slider              | Bereich          |
  | ----- | ---------- | ------------------- | ---------------- |
  | 1     | „Ladeziel“ | `charge_target_pct` | 50–100, Schritt 5 |
  | 2     | „min. SoC“ | `threshold_pct`     | 10–80, Schritt 5  |

  **Slider-Grenzen** — hängt der Slider an einer `number`- oder
  `input_number`-Entität, übernimmt er deren `min`, `max` und `step` aus den
  Entitätsattributen. Das ist nicht nur Kosmetik: ein Wert außerhalb dieser
  Grenzen würde beim Schreiben ohnehin abgelehnt. Fehlt ein Attribut, greift
  dafür einzeln der Kartendefault (Ladeziel 50–100/5, min. SoC 10–80/5); bei
  statischer Konfiguration gelten die Defaults komplett. Das Raster zählt ab
  `min`, nicht ab null, und die Wertanzeige bekommt so viele Nachkommastellen,
  wie `step` verlangt.

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

| Option          | Typ                               | Beschreibung                                                            |
| --------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `name`          | string                            | **Pflicht.** Zeilenbeschriftung.                                        |
| `energy_kwh`    | number \| Entity                  | Heute eingespeichert.                                                   |
| `power_w`       | number \| Entity                  | Aktuelle Heizleistung; `> 0` zählt als „heizt“.                          |
| `mode_entity`   | Entity (`input_number`)           | Modus als Zahl: **1 = An, 2 = Auto, 3 = Aus**. Steuert den Umschalter in beide Richtungen. |
| `mode`          | `on` \| `auto` \| `off` \| Entity | Startstellung, wenn kein `mode_entity` gesetzt ist.                      |
| `switch_entity` | Entity (`switch.*`)               | Ohne `mode_entity`/`mode`: Umschalter steht bei State `on` auf **An**, sonst auf **Aus**. |

Der Umschalter kennt zwei Betriebsarten, je nachdem was konfiguriert ist:

**Mit `mode_entity`** — der Umschalter zeigt den Modus aus dieser Entität
(States kommen als `"2.0"` an und werden gerundet) und schreibt beim Klick
`input_number.set_value` mit **1**, **2** oder **3** zurück. `switch_entity`
wird dabei **nicht** geschaltet — die Automation hinter der Modus-Entität
entscheidet, wann der Heizer tatsächlich läuft. Auch **Auto** schreibt hier
(Wert 2), weil die Entität diesen dritten Zustand abbilden kann. Ein Wert
außerhalb 1/2/3 ließe sich nicht zuordnen: dann ist kein Segment aktiv und der
Umschalter wird abgeblendet.

**Ohne `mode_entity`** — unverändert wie bisher: **An** ruft `switch.turn_on`
auf `switch_entity`, **Aus** ruft `turn_off`, **Auto** ruft bewusst *nichts*
und gibt den Schalter an die bestehende Überschuss-Automation zurück. Ohne
`switch_entity` bleibt der Umschalter rein lokal.

`switch_entity` wird mit `mode_entity` nur noch **gelesen**. Das Badge
„n heizen“ und die grüne Einfärbung der Leistung richten sich unabhängig davon
nach `power_w > 0`.

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
  (Laden bzw. Heizen), **rot** bei negativer (Entladen), gedämpft innerhalb der
  Totzone `idle_threshold_w` (Akku) bzw. bei `0 W`.
- **Theme** — ausschließlich HA-Theme-Variablen (`--card-background-color`,
  `--primary-text-color`, `--secondary-text-color`, `--info-color`,
  `--warning-color`, `--success-color`, `--error-color`), hell wie dunkel.
  `card-mod` wird nicht benötigt.
- **Nicht lesbare Werte** — fehlt eine Entität oder steht sie auf `unavailable`
  bzw. `unknown`, zeigt die Karte ein gedämpftes „–“ an der jeweiligen Stelle.
  Sie rendert in jedem Fall weiter und bricht nie ab.
- **Nachkommastellen** — Ladestand ohne, kWh und Temperatur mit einer,
  Leistung ganzzahlig gerundet.
- **Bedienelemente** — was an eine Entität gebunden ist, schreibt dorthin
  zurück; was statisch konfiguriert ist, bleibt rein lokal. Details unter
  [Schreibverhalten](#schreibverhalten).

### Einheitliche Höhen

Die Karte füllt die Höhe, die ihr Container ihr zuweist (`ha-card` steht auf
`height: 100%`, der Inhalt ist eine Flex-Spalte). Der Inhalt bleibt dabei oben,
die Bedienzeile rutscht an die Untergrenze der Karte.

Damit lassen sich mehrere Karten einer Reihe im **Sections-Dashboard** auf
dieselbe Höhe bringen: allen Karten der Reihe dieselben `grid_options` geben.

```yaml
type: grid
cards:
  - type: custom:des-storage-card
    variant: battery
    name: Hausakku 1
    status: discharging
    soc: 62
    grid_options:
      columns: 12
      rows: 2

  - type: custom:des-storage-card
    variant: battery
    name: Hausakku 2
    status: charging
    soc: 18
    grid_options:
      columns: 12
      rows: 2
```

`rows` so weit erhöhen, bis die höchste Karte der Reihe hineinpasst — die
niedrigeren strecken sich dann mit. Ohne `grid_options` (Standard `rows: auto`)
behält jede Karte ihre natürliche Höhe, eine aufgeklappte Akku-Karte ist dann
höher als eine eingeklappte.

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

Die beiden Hausakkus (Leistung aus Spannung x Strom, Status und Restenergie
abgeleitet), die Zendure AC+ mit Notstrom-Entität, dazu die drei Aquarien als
eine Gruppe:

```yaml
type: vertical-stack
cards:
  # ---------- Hausakkus ----------
  # Kein power_w: die Leistung entsteht aus voltage_entity x current_entity.
  # Kein status: wird aus dem Vorzeichen der Leistung abgeleitet.
  # Kein energy_kwh: wird aus soc x capacity_kwh berechnet.
  # Kein charge_mode_control: der Umschalter Laden|Auto bleibt lokal, bis die
  # Deye-Ladelogik existiert. Der min.-SoC-Slider schreibt dagegen schon in
  # number.inverter_battery_low_soc.
  - type: custom:des-storage-card
    variant: battery
    name: Hausakku 1
    soc: sensor.inverter_battery_1
    temp_c: sensor.inverter_battery_1_temperature
    voltage_entity: sensor.inverter_battery_1_voltage
    current_entity: sensor.inverter_battery_1_current
    capacity_kwh: 6.55
    threshold_pct: number.inverter_battery_low_soc
    charge_target_pct: 100
    backup: none

  # controls: false macht daraus eine reine Anzeigekarte - kein Chevron,
  # keine Bedienzeile.
  - type: custom:des-storage-card
    variant: battery
    name: Hausakku 2
    soc: sensor.inverter_battery_2
    temp_c: sensor.inverter_battery_2_temperature
    voltage_entity: sensor.inverter_battery_2_voltage
    current_entity: sensor.inverter_battery_2_current
    capacity_kwh: 6.55
    threshold_pct: number.inverter_battery_low_soc
    charge_target_pct: 100
    backup: none
    controls: false

  # ---------- Zendure AC+ ----------
  - type: custom:des-storage-card
    variant: battery
    name: Zendure AC+
    soc: sensor.zendure_total_state_of_charge
    power_w: sensor.zendure_power
    temp_c: sensor.zendure_battery_1_temperature
    capacity_kwh: sensor.zendure_total_capacity
    threshold_pct: input_number.zendure_setting_minimum_allowed_state_of_charge
    charge_target_pct: input_number.zendure_setting_maximum_allowed_state_of_charge
    time_remaining_charging: sensor.zendure_indication_remaining_charge_time
    time_remaining_discharging: sensor.zendure_indication_remaining_discharge_time
    # ZENDURE_CHARGE_OPTION / ZENDURE_AUTO_OPTION sind Platzhalter: hier die
    # Options-Strings eintragen, die input_select.zendure_operation_mode
    # tatsaechlich anbietet (Entwicklerwerkzeuge -> Zustaende).
    charge_mode_control:
      entity: input_select.zendure_operation_mode
      charge_state: ZENDURE_CHARGE_OPTION
      auto_state: ZENDURE_AUTO_OPTION
    backup:
      entity: sensor.zendure_offgrid_mode
      active_states:
        - "On"

  # ---------- Aquarien als eine Gruppe ----------
  - type: custom:des-storage-card
    variant: thermal_group
    name: Wärmespeicher Aquarien
    items:
      # mode_entity: 1 = An, 2 = Auto, 3 = Aus. Der Umschalter schreibt
      # dorthin; switch_entity wird nur noch gelesen (Heizzustand).
      - name: Aquarium 1200 L
        energy_kwh: sensor.arbeitszimmer_aquariumsolarheizer1_aquarium_solarheizer_1_heute
        power_w: sensor.aquariumsolarheizer1_switch_0_power
        mode_entity: input_number.aquarium_1200l_modus
        switch_entity: switch.aquariumsolarheizer1_switch_0
      - name: Aquarium 700 L
        energy_kwh: sensor.arbeitszimmer_aquariumsolarheizer2_aquarium_solarheizer_2_heute
        power_w: sensor.aquariumsolarheizer2_switch_0_power
        mode_entity: input_number.aquarium_700l_modus
        switch_entity: switch.aquariumsolarheizer2_switch_0
      # Ohne mode_entity: der Umschalter schaltet switch_entity direkt.
      - name: Aquarium 600 L
        energy_kwh: sensor.arbeitszimmer_aquarienheizer600l_aquarium_solarheizer_600l_heute
        power_w: sensor.aquarienheizer600l_leistung
        switch_entity: switch.aquarienheizer600l
```

Statische Werte funktionieren weiterhin überall — nützlich zum Ausprobieren
eines Layouts, bevor die Entitäten feststehen:

```yaml
- type: custom:des-storage-card
  variant: battery
  name: Testkarte
  status: discharging
  soc: 62
  capacity_kwh: 10.2
  power_w: -1240
  temp_c: 23.5
  threshold_pct: 20
  charge_target_pct: 90
  time_remaining: 4:36 h bis 20 %
  time_at: um 00:12
```

---

## Wechselrichterkarte (`des-inverter-card`)

> **Phase 2 — lesend.** Sobald **mindestens ein** `*_entity`-Feld gesetzt ist,
> liest die Karte den kompletten Messwert-Satz aus `hass.states` und
> `demo_state` wird ignoriert. Ohne Entity-Feld bleibt der **Demo-Modus** —
> nützlich als Editor-Vorschau. Geschrieben wird nichts.

Kompakte Übersicht für einen PV-Wechselrichter: Gesamtleistung, zwei Strings und
drei Phasen. Wie beim Akku ist die Detailansicht **standardmäßig eingeklappt** —
ein Klick auf das Chevron klappt sie auf.

**Statische Optionen** (gelten in beiden Modi):

| Option            | Typ                             | Beschreibung                                                                    |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| `name`            | string                          | **Pflicht.** Titel in der Kopfzeile.                                            |
| `model`           | string                          | Modellname in der Meta-Zeile. Im Demo-Modus sonst der Demo-Modellname.           |
| `demo_state`      | `normal` \| `alarm` \| `night`  | Demo-Datensatz — **nur** wirksam, wenn kein `*_entity`-Feld gesetzt ist. Standard `normal`. |
| `kwp_total`       | number (kWp)                    | Installierte Gesamtleistung — Bezug für die Auslastung in %. Standard `12.5`.    |
| `kwp_pv1`         | number (kWp)                    | Spitzenleistung String PV1 — Vollausschlag seines Balkens. Standard `6.5`.       |
| `kwp_pv2`         | number (kWp)                    | Spitzenleistung String PV2 — Vollausschlag seines Balkens. Standard `6.0`.       |
| `invert_grid`     | boolean                         | Dreht das Vorzeichen der Netzleistung. Standard `false`.                          |
| `show_dc_temp`    | boolean                         | Zeigt die DC-Temperatur in der Fußzeile (aufgeklappt). Standard `true`.           |
| `imbalance_warn`  | boolean                         | Markiert einen stark unsymmetrischen String amber. Standard `true`.               |
| `imbalance_ratio` | number (0–1)                    | Ein String gilt als schwach unter diesem Anteil des anderen. Standard `0.5`.      |
| `imbalance_min_w` | number (W)                      | …aber nur, wenn der andere String diese Leistung übersteigt. Standard `500`.      |

**Entity-Felder** (lesend). Jedes ist optional; ein fehlendes Feld erscheint als
gedämpftes „–", ein ganzer Block wird ausgeblendet, wenn **keines** seiner Felder
gesetzt ist. Die erwartete Einheit ist die Basiseinheit — abweichende Einheiten
werden über `unit_of_measurement` umgerechnet (`kW`/`MW` → W, `Wh`/`MWh` → kWh).

| Feld                        | Erwartet    | Ziel                                                        |
| --------------------------- | ----------- | ----------------------------------------------------------- |
| `pv_power_entity`           | W           | PV-Gesamtleistung. Fehlt sie, wird PV1 + PV2 summiert.       |
| `today_production_entity`   | kWh         | Tagesertrag (Meta-Zeile).                                   |
| `total_production_entity`   | kWh         | Gesamtertrag (Meta-Zeile).                                  |
| `fault_entity`              | Text        | Fehlertext; `OK`/nicht verfügbar = kein Fehler.             |
| `alarm_entity`              | Text        | Alarmtext; `OK`/nicht verfügbar = kein Alarm.               |
| `device_state_entity`       | Text        | Gerätestatus (grüne Pille). Fehlt er, „Normal".             |
| `inverter_temp_entity`      | °C          | WR-Temperatur (Leistungszeile).                            |
| `dc_temp_entity`            | °C          | DC-Temperatur (Fußzeile, nur bei `show_dc_temp`).           |
| `grid_frequency_entity`     | Hz          | Netzfrequenz (Fußzeile).                                    |
| `pv1_power_entity` … `pv1_current_entity` | W / V / A | String PV1: Leistung, Spannung, Strom.        |
| `pv2_power_entity` … `pv2_current_entity` | W / V / A | String PV2: Leistung, Spannung, Strom.        |
| `grid_power_entities`       | `[L1,L2,L3]` W | Netzleistung je Phase (Vorzeichen, siehe `invert_grid`). |
| `inverter_power_entities`   | `[L1,L2,L3]` W | WR-Ausgang je Phase.                                     |
| `grid_voltage_entities`     | `[L1,L2,L3]` V | Netzspannung je Phase.                                   |

**Blöcke** — im Entity-Modus wird ausgeblendet, was gar nicht konfiguriert ist:

- **Strings** (Balken eingeklappt + Tabelle aufgeklappt): keines der `pv1_*`/`pv2_*`.
- **Phasen** (Tabelle aufgeklappt): keine der drei Phasen-Listen.
- **Fußzeile**: weder `dc_temp_entity` noch `grid_frequency_entity`.

Kopfzeile, Status-Pille und Leistungszeile stehen immer; nicht lesbare Einzelwerte
darin zeigen „–". Ein `unavailable`/`unknown` verhält sich wie ein fehlender Wert
(gedämpftes „–", die Karte färbt sich **nicht** rot).

**Demo-Zustände** (nur ohne Entity-Feld) — mit `demo_state` durchschaltbar, damit
jede Darstellung geprüft werden kann:

| Wert     | Zeigt                                                                            |
| -------- | ------------------------------------------------------------------------------- |
| `normal` | Einspeisebetrieb, alles OK — grüne Status-Pille.                                 |
| `alarm`  | „Grid overvoltage“ (amber-Pille) **und** ein unsymmetrischer String (amber-Balken). |
| `night`  | Alle Leistungen 0, Gerät im Standby — große Zahl gedämpft statt grün.            |

**Aufbau — eingeklappt**

- **Kopfzeile** — Name links, darunter gedämpft
  `Modell · … kWh heute · … kWh gesamt`. Rechts **eine** Status-Pille: rot
  `Fault: …`, sonst amber `Alarm: …`, sonst grün der Gerätestatus. Farbtokens wie
  bei der Speicherkarte (grün = ok, amber = Alarm, rot = Fault).
- **Leistungszeile** — PV-Leistung groß und grün (bei 0 W gedämpft), daneben klein
  `… % von … kWp`; rechts Thermometer-Icon und die WR-Temperatur.
- **String-Zeilen** — `PV1`/`PV2` mit schmalem Balken (Füllung = Leistung /
  `kwp_pvX`, grün, bei Unsymmetrie amber) und Leistung in W.

**Aufbau — aufgeklappt** (unter dem Chevron, durch eine Haarlinie getrennt)

- **Strings** — Spannung (V) und Strom (A) je String.
- **Phasen** — je Phase L1/L2/L3 die Netzleistung (mit Vorzeichen und echtem
  Minuszeichen: Einspeisung grün, Bezug rot, 0 gedämpft), der WR-Ausgang und die
  Spannung, plus eine hervorgehobene Summenzeile `Σ`.
- **Fußzeile** — DC-Temperatur (nur bei `show_dc_temp`) und Netzfrequenz (Hz).

**Beispiel-YAML** — Entities (Statik `kwp_*`, alles andere aus `hass.states`):

```yaml
type: custom:des-inverter-card
name: Wechselrichter
model: Growatt MOD 10KTL3-X
kwp_total: 12.5
kwp_pv1: 6.5
kwp_pv2: 6.0
invert_grid: false
show_dc_temp: true

pv_power_entity: sensor.inverter_pv_power
today_production_entity: sensor.inverter_today_production
total_production_entity: sensor.inverter_total_production
device_state_entity: sensor.inverter_device_state
alarm_entity: sensor.inverter_alarm
fault_entity: sensor.inverter_fault
inverter_temp_entity: sensor.inverter_temperature
dc_temp_entity: sensor.inverter_dc_temperature
grid_frequency_entity: sensor.inverter_grid_frequency

pv1_power_entity: sensor.inverter_pv1_power
pv1_voltage_entity: sensor.inverter_pv1_voltage
pv1_current_entity: sensor.inverter_pv1_current
pv2_power_entity: sensor.inverter_pv2_power
pv2_voltage_entity: sensor.inverter_pv2_voltage
pv2_current_entity: sensor.inverter_pv2_current

grid_power_entities:
  - sensor.inverter_grid_power_l1
  - sensor.inverter_grid_power_l2
  - sensor.inverter_grid_power_l3
inverter_power_entities:
  - sensor.inverter_output_power_l1
  - sensor.inverter_output_power_l2
  - sensor.inverter_output_power_l3
grid_voltage_entities:
  - sensor.inverter_grid_voltage_l1
  - sensor.inverter_grid_voltage_l2
  - sensor.inverter_grid_voltage_l3
```

Ohne jedes Entity-Feld läuft dieselbe Karte im Demo-Modus — nützlich, um das
Layout vor dem Verdrahten der Entitäten zu sehen:

```yaml
type: custom:des-inverter-card
name: Wechselrichter
demo_state: normal        # normal | alarm | night
```

---

## Hauskarte (`des-house-card`)

> **Phase 1 + 2 — lesend.** Sobald **mindestens ein** Entity-Feld gesetzt ist,
> liest die Karte ihren Messwert-Satz aus `hass.states` und `demo_state` wird
> ignoriert. Ohne Entity-Feld bleibt der **Demo-Modus** — nützlich als
> Editor-Vorschau. Geschrieben wird nichts.

Zeigt den aktuellen **Hausverbrauch**, **woher der Strom gerade kommt** (Solar /
Speicher / Netz) und die **Tageswerte**. Der Speicher erscheint nur als
Herkunftsanteil, ohne Speicherdetails (dafür gibt es die Speicherkarte); der
PV-Ertrag ist bewusst nicht enthalten (dafür die Wechselrichterkarte). Wie bei
den anderen Karten ist der „Heute“-Block **standardmäßig eingeklappt** — ein
Klick auf das Chevron klappt ihn auf.

**Statische Optionen** (gelten in beiden Modi):

| Option              | Typ                            | Beschreibung                                                                 |
| ------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `name`              | string                         | **Pflicht.** Titel in der Kopfzeile.                                         |
| `demo_state`        | `normal` \| `night` \| `export` | Demo-Datensatz — **nur** wirksam, wenn kein Entity-Feld gesetzt ist. Standard `normal`. |
| `invert_grid`       | boolean                        | Dreht das Vorzeichen der Netzleistung. Standard `false` (positiv = Bezug).    |
| `storage_positive`  | `discharge` \| `charge`         | Bedeutung eines **positiven** Speicherwerts. Standard `discharge`.            |

**Entity-Felder** (lesend). Jedes ist optional. Die erwartete Einheit ist die
Basiseinheit — abweichende Einheiten werden über `unit_of_measurement`
umgerechnet (`kW`/`MW` → W, `Wh`/`MWh` → kWh).

| Feld                       | Erwartet     | Ziel                                                              |
| -------------------------- | ------------ | ---------------------------------------------------------------- |
| `pv_power_entity`          | W            | PV-Gesamtleistung. Gesetzt → **gemessener** Solar-Anteil (siehe unten). |
| `load_power_entity`        | W            | Hausverbrauch — die große Zahl.                                   |
| `grid_power_entity`        | W            | Netzleistung (Vorzeichen, siehe `invert_grid`).                  |
| `storage_power_entities`   | Liste, W     | Speicher, die das Haus versorgen; je Eintrag signierte Leistung.  |
| `today_consumption_entity` | kWh          | Verbrauch heute (Meta-Zeile + „Heute“-Block).                     |
| `today_import_entity`      | kWh          | Netzbezug heute (rot, „Heute“-Block).                            |
| `today_export_entity`      | kWh          | Einspeisung heute (grün, „Heute“-Block).                         |
| `autarky_entity`           | %            | Autarkie; **wenn gesetzt, ersetzt sie die Berechnung**.           |

**Vorzeichen** — `grid_power_entity` ist signiert: nach `invert_grid` gilt
**positiv = Netzbezug**, **negativ = Einspeisung**. Für die Speicher legt
`storage_positive` fest, was ein positiver Wert bedeutet: bei `discharge`
(Standard) zählt positiv als Entladung ins Haus, bei `charge` umgekehrt. Nur die
Entladung (Anteil, der ins Haus fließt) geht in die Mix-Rechnung ein.

**Mix-Berechnung** (alle Werte in W; ein fehlender Wert zählt als 0):

```
grid       = grid_raw · (invert_grid ? −1 : 1)
gridIn     = max(grid, 0)                       # Netzbezug
gridOut    = max(−grid, 0)                      # Einspeisung
storageDis = Σ max(±entity, 0)                  # Entladung, Vorzeichen je storage_positive
speicher   = min(storageDis, load)
netz       = min(gridIn, load − speicher)
solar      = max(load − speicher − netz, 0)
```

Die Prozente sind `Anteil / load`. Ist `load ≤ 0` (oder nicht lesbar), sind alle
Anteile 0 % und der Balken bleibt leer; die große Zahl zeigt dann „–“.

**Gemessener Solar-Anteil** — ist `pv_power_entity` gesetzt und lesbar, ersetzt
die Karte die „Solar = Rest"-Ableitung durch die tatsächlich gemessene
PV-Leistung:

```
storageLad = Σ max(∓entity, 0)                  # Ladeanteil, Vorzeichen je storage_positive
solar      = max(pvPower − gridOut − storageLad, 0)   # PV minus Einspeisung minus Speicherladung
speicher   = storageDis                         # wie oben
netz       = gridIn
quellen    = solar + speicher + netz
```

Die Prozente sind hier `Anteil / quellen` (nicht mehr `/ load`); bei
`quellen ≤ 0` sind alle 0 %. Die Legende zeigt die **gemessenen** W-Werte — ihre
Summe kann daher vom Verbrauch abweichen (z. B. wenn ein Teil der PV-Leistung in
Wandlungsverlusten oder einem nicht erfassten Verbraucher steckt). Ist
`pv_power_entity` nicht gesetzt (oder gerade nicht lesbar), gilt unverändert die
`load`-basierte Ableitung oben.

**Autarkie heute** — ohne `autarky_entity` rechnet die Karte
`1 − import / consumption` (ganzzahlige %). Ist der Tagesverbrauch `≤ 0` oder
nicht lesbar, zeigt sie „–“.

**Aufbau — eingeklappt**

- **Kopfzeile** — Name links, darunter gedämpft `… kWh heute · … % autark`.
  Rechts **eine** Pille: grün `Einspeisung … W` (Einspeisung), sonst rot
  `Netzbezug … W` (Bezug), sonst gedämpft `Netz 0 W`.
- **Leistungszeile** — der Verbrauch groß in neutraler Textfarbe, daneben klein
  gedämpft „Verbrauch“.
- **Mix-Balken** — ein gestapelter Balken (8 px, abgerundet) in der Reihenfolge
  **Solar** (grün), **Speicher** (blau, wie „Lädt“ bei der Speicherkarte) und
  **Netz** (rot). Die Schiene ist der gedämpfte Theme-Hintergrund.
- **Legende** — drei Zeilen mit Farbquadrat, Label (`Solar`, `Speicher`, `Netz`),
  Leistung in W und Anteil in %.

**Aufbau — aufgeklappt** (unter dem Chevron, durch eine Haarlinie getrennt)

- **Heute** — zwei Spalten Label/Wert, je eine Nachkommastelle:

  | Zeile         | Wert                | Farbe   |
  | ------------- | ------------------- | ------- |
  | Verbrauch     | `today_consumption` | neutral |
  | Netzbezug     | `today_import`      | rot     |
  | Einspeisung   | `today_export`      | grün    |

  Fehlt eine dieser Entitäten, entfällt ihre Zeile. Ist **keiner** der drei
  Tageswerte konfiguriert, blendet die Karte Chevron und Block aus.

**Beispiel-YAML** — Entities (alles aus `hass.states`):

```yaml
type: custom:des-house-card
name: Haus
invert_grid: false
storage_positive: discharge

pv_power_entity: sensor.inverter_pv_power   # optional; schaltet auf gemessenen Solar-Anteil
load_power_entity: sensor.inverter_load_power
grid_power_entity: sensor.inverter_external_power
storage_power_entities:
  - sensor.inverter_battery_power
  - sensor.zendure_power
today_consumption_entity: sensor.inverter_today_load_consumption
today_import_entity: sensor.inverter_today_energy_import
today_export_entity: sensor.inverter_today_energy_export
# autarky_entity: sensor.autarkie   # optional; ersetzt die Berechnung
```

Ohne jedes Entity-Feld läuft dieselbe Karte im Demo-Modus:

```yaml
type: custom:des-house-card
name: Haus
demo_state: normal        # normal | night | export
```

Der Demo-Datensatz `normal` zeigt Solar 2.840 W / 72 %, Speicher 710 W / 18 %,
Netz 400 W / 10 % und die Pille „Netzbezug 400 W“; `night` deckt den Verbrauch
zu 100 % aus dem Speicher; `export` speist Überschuss ins Netz („Einspeisung
3.800 W“, 100 % Solar).

---

## Statistikkarte (`des-stats-card`)

> **Phase 1 + 2 — lesend.** Mit einem `periods`-Block liest die Karte ihre Werte
> aus `hass.states`; ohne `periods` bleibt der **Demo-Modus** — nützlich als
> Editor-Vorschau. Geschrieben wird nichts, der gewählte Zeitraum lebt nur im
> Component-State.

Zeigt für einen wählbaren Zeitraum (**Tag / Woche / Monat / Jahr**) sechs
Energiewerte als Zeilen mit Balken: **Verbrauch, Produktion, Import, Export,
Laden, Entladen**. Die Metazeile zeigt Autarkie und Eigenverbrauchsquote des
gewählten Zeitraums.

Die Zeitraumwahl nutzt **dieselbe** segmentierte Komponente wie die An/Auto/Aus-
Umschalter der `thermal_group`-Speicherkarte (ausgelagert nach
[`src/segmented.ts`](src/segmented.ts) und in beiden Karten verwendet) — gleiche
Optik, gleiches Verhalten. Sie steht rechts neben dem Titel, die Metazeile
darunter über die volle Kartenbreite.

| Option           | Typ                            | Beschreibung                                                     |
| ---------------- | ------------------------------ | --------------------------------------------------------------- |
| `name`           | string                         | **Pflicht.** Titel in der Kopfzeile.                            |
| `default_period` | `day` \| `week` \| `month` \| `year` | Beim Laden gewählter Zeitraum; fällt auf den ersten verfügbaren zurück. Standard `day`. |
| `periods`        | Objekt (siehe unten)           | Je Zeitraum ein Block mit den sechs Energiefeldern.              |

Je Zeitraum unter `periods.<day\|week\|month\|year>`:

| Feld          | Typ                        | Beschreibung                                     |
| ------------- | -------------------------- | ------------------------------------------------ |
| `consumption` | kWh — Wert oder Entity     | Verbrauch.                                        |
| `production`  | kWh — Wert oder Entity     | Produktion.                                       |
| `import`      | kWh — Wert oder Entity     | Netzbezug.                                        |
| `export`      | kWh — Wert oder Entity     | Einspeisung.                                      |
| `charge`      | kWh — Wert, Entity, Liste  | Laden; eine Liste wird summiert (mehrere Akkus).  |
| `discharge`   | kWh — Wert, Entity, Liste  | Entladen; eine Liste wird summiert.               |

**Verfügbare Zeiträume** — ein Zeitraum ohne Block oder ohne einen einzigen
lesbaren Wert erscheint **nicht** im Umschalter. Ist `default_period` nicht
verfügbar, wählt die Karte den ersten verfügbaren (Reihenfolge Tag → Woche →
Monat → Jahr). Einheiten werden über `unit_of_measurement` umgerechnet
(`Wh` → /1000, `MWh` → ×1000).

**Berechnung** (beide in Prozent, ganzzahlig):

```
Autarkie       = 1 − import / consumption
Eigenverbrauch = 1 − export / production
```

Ist der Nenner `≤ 0` oder fehlt ein Wert, steht an der Stelle „–“. Fehlen
**beide** Kennzahlen, entfällt die Metazeile ganz.

**Aufbau**

- **Titelzeile** — `name` links, der Zeitraum-Umschalter rechts (mittig zur
  Titelzeile).
- **Metazeile** — gedämpft, volle Breite:
  `… % autark · … % Eigenverbrauch`.
- **Sechs Zeilen** im Raster `Label | Balken | Wert`: Label gedämpft, Wert
  rechtsbündig als `… kWh` mit einer Nachkommastelle. Eine Zeile mit fehlender
  Entität wird ausgeblendet. Der Balken (6 px, abgerundet, gedämpfte Schiene)
  füllt sich anteilig zum **größten angezeigten Wert** des Zeitraums; sind alle
  Werte 0, bleiben die Schienen leer.

**Farben** — die vier Theme-Grüntöne/-Blautöne plus zwei eigene, per
CSS-Custom-Property der Karte überschreibbare Töne:

| Zeile      | Farbe                                                       |
| ---------- | ---------------------------------------------------------- |
| Verbrauch  | neutrales Grau (`--secondary-text-color`)                   |
| Produktion | Grün (`--success-color`) — wie „positive Leistung“ sonst    |
| Import     | Rot (`--error-color`)                                       |
| Export     | Olivgrün (`--stats-export-color`, Fallback `#639922`)       |
| Laden      | Blau (`--info-color`) — die Ladefarbe der Speicherkarte     |
| Entladen   | helleres Blau (`--stats-discharge-color`, Fallback `#7fb8e8`) |

**Beispiel-YAML** — Entities:

```yaml
type: custom:des-stats-card
name: Statistik
default_period: day
periods:
  day:
    consumption: sensor.energie_verbrauch_heute
    production: sensor.energie_produktion_heute
    import: sensor.energie_import_heute
    export: sensor.energie_export_heute
    charge: [sensor.akku1_geladen_heute, sensor.akku2_geladen_heute]
    discharge: [sensor.akku1_entladen_heute, sensor.akku2_entladen_heute]
  week:
    consumption: sensor.energie_verbrauch_woche
    production: sensor.energie_produktion_woche
    import: sensor.energie_import_woche
    export: sensor.energie_export_woche
    charge: sensor.akku_geladen_woche
    discharge: sensor.akku_entladen_woche
  month: { … gleiche Felder … }
  year:  { … }
```

Ohne `periods`-Block läuft dieselbe Karte im Demo-Modus:

```yaml
type: custom:des-stats-card
name: Statistik
default_period: week      # day | week | month | year
```

Der Demo-Datensatz `week` zeigt z. B. **74 % autark, 68 % Eigenverbrauch**, den
Verbrauch-Balken bei 100 % und die Produktion bei 86 %.

---

## Schreibverhalten

Grundregel: **jedes Bedienelement schreibt in die Entität, an die es gebunden
ist.** Ist der zugehörige Wert statisch konfiguriert, bleibt das Element rein
lokal — es bewegt sich, löst aber keinen Service-Call aus.

| Bedienelement          | gebunden an           | Service                                     |
| ---------------------- | --------------------- | ------------------------------------------- |
| Slider **min. SoC**    | `threshold_pct`       | `number.set_value` / `input_number.set_value` |
| Slider **Ladeziel**    | `charge_target_pct`   | dito                                        |
| **Laden \| Auto**      | `charge_mode_control` | `select_option` bzw. `turn_on`/`turn_off`   |
| **An/Auto/Aus**        | `items[].mode_entity` | `input_number.set_value` mit 1 / 2 / 3      |
| **An** / **Aus**       | `items[].switch_entity` | `switch.turn_on` / `switch.turn_off` (ohne `mode_entity`) |
| **Auto** (nur Switch)  | —                     | kein Call — gibt an die Automation zurück    |

Nur die Domains `number`, `input_number`, `switch`, `input_boolean`, `select`
und `input_select` werden geschrieben; alles andere bleibt lokal.

**Wann geschrieben wird.** Slider schreiben nicht beim Ziehen, sondern beim
Loslassen (`change`), und dieser Schreibvorgang ist um 500 ms verzögert. Das ist
kein Kosmetikdetail: Tastaturbedienung löst pro Pfeiltaste ein `change` aus, und
ohne die Verzögerung würde eine gehaltene Taste einen Service-Call pro
Zwischenschritt absetzen. Segmentierte Umschalter schreiben sofort beim Klick.

**Optimistische Anzeige.** Das Bedienelement springt sofort auf den neuen Wert,
noch bevor Home Assistant geantwortet hat. Sobald die Entität den Wert
bestätigt, gibt die Karte die lokale Überschreibung wieder frei und folgt
erneut der Entität — dadurch schlägt auch eine Änderung durch, die anderswo
gemacht wurde (Automation, zweites Dashboard).

**Fehlschlag.** Wird der Service-Call abgelehnt, verwirft die Karte die lokale
Überschreibung und zeigt wieder den echten Entity-Wert. Der Fehler landet
zusätzlich in der Browser-Konsole.

**Zeitgrenze.** Bestätigt die Entität den geschriebenen Wert nicht innerhalb
von 8 Sekunden — etwa weil das Gerät den Befehl annimmt, aber auf einem
anderen Zustand landet — gibt die Karte die optimistische Anzeige trotzdem
frei. Ohne diese Grenze bliebe das Bedienelement bis zum Neuladen von seiner
Entität abgekoppelt.

## Entity-Anbindung

Jedes Wertfeld nimmt einen statischen Wert oder eine Entity-ID am selben
Schlüssel:

```yaml
soc: 62                    # statischer Wert
soc: sensor.akku_soc       # Entität, gleicher Schlüssel
```

Unterschieden wird in [`src/resolve.ts`](src/resolve.ts) über das Muster
`domain.object_id` — bewusst strenger als „enthält einen Punkt“, damit `6.55`
und `4:36 h bis 20 %` nicht versehentlich als Entität gelesen werden.

Der Resolver unterscheidet drei Fälle, und die Karte behandelt sie verschieden:

| Ergebnis      | Bedeutung                                   | Darstellung                       |
| ------------- | ------------------------------------------- | --------------------------------- |
| `unset`       | gar nicht konfiguriert                      | Wert wird abgeleitet oder entfällt |
| `value`       | nutzbarer Wert, statisch oder aus `hass`    | normal                            |
| `unavailable` | konfiguriert, aber Entität fehlt/unavailable | gedämpftes „–“                    |

Diese Trennung ist der Grund, warum eine fehlende `energy_kwh` aus
`soc × capacity_kwh` berechnet wird, eine auf `unavailable` stehende Entität
aber ein „–“ ergibt statt einer stillen Falschrechnung.

`hass` ist eine reaktive Property — Home Assistant weist sie bei jeder
Zustandsänderung neu zu, und Lit rendert daraufhin neu.

## Ausblick

Offen für die Speicherkarte:

- **Deye-Ladelogik** — sobald es eine Entität gibt, die erzwungenes Laden der
  Hausakkus schaltet, bekommen beide Hausakku-Karten ein `charge_mode_control`
  und der Umschalter **Laden | Auto** wird dort ebenfalls schreibend.
- **`Auto` für die Aquarien** — mit `mode_entity` gelöst: ein `input_number` je
  Heizer bildet alle drei Zustände ab, und die Überschuss-Automation liest ihn
  aus. Ohne `mode_entity` bleibt `Auto` weiterhin nur lokal wählbar.

Offen für die Wechselrichterkarte:

- **Schreibpfad (Phase 3)** — die Karte ist bislang rein lesend. Sobald es
  bedienbare Entitäten gibt (z. B. Leistungsbegrenzung, Ein/Aus), käme dort — wie
  bei der Speicherkarte — ein gebundenes Bedienelement mit Service-Call dazu.

## Projektstruktur

```
src/
  index.ts             Registrierung der Custom Elements + Karten-Picker-Einträge
  des-storage-card.ts  Speicherkarte (Rendering + Styles)
  des-inverter-card.ts Wechselrichterkarte (Entity-Binding + Demo-Fallback)
  des-house-card.ts    Hauskarte (Verbrauch und Stromherkunft, Entity + Demo)
  des-stats-card.ts    Statistikkarte (sechs Energiewerte je Zeitraum, Entity + Demo)
  types.ts             Config-Schema und HA-Typen
  resolve.ts           Statischer Wert ↔ Entity: Auflösung über hass.states
  service.ts           Schreibpfad: Domain → Service-Call
  segmented.ts         Segmentierter Umschalter (Storage- und Statistikkarte)
  chevron.ts           Gemeinsamer Chevron-Stil (Storage-, Wechselrichter-, Hauskarte)
  format.ts            Zahlenformatierung (de-DE)
vite.config.ts         Lib-Build → dist/daniels-energy-cards.js
hacs.json              HACS-Manifest (Typ Dashboard)
dist/                  Build-Ergebnis — wird bewusst mitcommittet,
                       weil HACS die Datei direkt aus dem Repo ausliefert
```

> Nach jeder Codeänderung `npm run build` ausführen **und** `dist/` mit
> committen, sonst installiert HACS weiterhin den alten Stand.
