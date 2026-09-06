# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format grob nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.7.6]

### Geändert

- **des-house-card:** Der Chart wandert komplett in den Aufklappbereich, damit
  die Karte bei `rows 4` nicht mehr überfüllt ist. **Eingeklappt** wieder die
  klassische Darstellung: Kopfzeile (Name + Meta), große Verbrauchszahl,
  Mix-Balken und die drei Legendenzeilen Solar/Speicher/Netz (W + %) — die
  Pillen entfallen. **Aufgeklappt** (Chevron) das Dropdown mit dem Perioden-
  Umschalter Tag/Woche/Monat/Jahr, dem gestapelten Säulen-Chart und den
  Heute-Werten. Der Chevron erscheint, sobald es etwas aufzuklappen gibt (Chart
  oder Heute-Werte).

## [0.7.5]

### Behoben

- **des-house-card:** Der Aufklapp-Chevron (Heute-Block) tat nichts — das in
  0.7.0 gesetzte `overflow: hidden` auf `ha-card` überschrieb das
  `overflow: visible` des Overlays und schnitt das Dropdown ab. Der Chart-Cap
  sitzt jetzt auf `.card` (Geschwister des Overlays), `ha-card` bleibt sichtbar.

### Geändert

- **des-house-card:** Platz für den Chart in der rows-4-Höhe geschaffen. Die
  Kopfzeilen-Pillen zeigen nur noch Farbquadrat + Wert (ohne Text „Solar/
  Speicher/Netz" — die Farben sind selbsterklärend; der Name bleibt als
  Hover-Titel). Der Perioden-Umschalter Tag/Woche/Monat/Jahr sitzt jetzt rechts
  in der Verbrauchszeile statt in einer eigenen Zeile über dem Chart, und die
  separate Meta-Zeile (`W`/`kWh je Tag`) entfällt. Der Chart bekommt dadurch die
  frei gewordene Höhe.

## [0.7.4]

### Geändert

- **des-house-card:** Feinschliff nach dem Umbau.
  - Die Farbquadrate der Kopfzeilen-Pillen (Solar/Speicher/Netz) sind jetzt
    **immer** in ihrer Quellfarbe, nicht nur bei > 0 W; bei 0 W wird nur noch der
    Wert gedämpft.
  - Chart-Farben folgen wieder der Konvention: die Solar-Reihe nutzt
    `var(--success-color)` statt des Shadow-DOM-Tokens `--des-production-color`,
    das die eingebettete apexcharts-card nicht auflöste (Solar wurde schwarz
    gezeichnet). Speicher blau, Netz rot unverändert.
  - Die Chart-**Legende** entfällt (die Pillen tragen den Farbschlüssel), das
    spart Höhe.
  - Karten-Höhe wieder **rows 4** (wie vor dem Umbau), damit die Karte bündig
    mit Wechselrichter- und Statistikkarte in der Reihe sitzt. Dashboard-Hauskarte
    ebenfalls auf `rows: 4`.

## [0.7.3]

### Behoben

- **des-house-card:** Der Quellen-Chart lud nicht (Dauer-Ladekringel). Ursache
  war die 0.7.2-Umstellung: `apex_config.chart.type: 'column'` — `column` ist
  **kein** gültiger ApexCharts-`chart.type` (nur `bar`), der Alias gehört auf
  `all_series_config.type`. Der ungültige Typ ließ die Karte endlos initialisieren.
  `chart.type` entfernt (der Serientyp bleibt `column` in `all_series_config`,
  apexcharts-card übersetzt ihn korrekt); das nicht benötigte `stack_group`
  wieder entfernt (der Chart hat keine `yaxis`, Säulen stapeln ohne).

## [0.7.2]

### Behoben

- **des-house-card:** Der Quellen-Chart zeichnet jetzt gestapelte **Säulen**
  statt Flächen. Gestapelte Flächen werden von der in apexcharts-card gebündelten
  ApexCharts-Version (≥ 3.44.1) nicht mehr gestapelt (apexcharts.js#4132) —
  Säulen dagegen schon. `type: area` → `type: column` in beiden Perioden-Zweigen,
  je Reihe `stack_group: quellen` (wegen des yaxis-bezogenen Stapel-Bugs
  apexcharts-card#827) und `group_by.fill: last` für deckungsgleiche Zeitstempel.

## [0.7.1]

### Behoben

- **des-chart-card:** Gestapelte **Flächen** (`type: area`, `stacked: true`)
  wurden nicht gestapelt gezeichnet, obwohl gestapelte **Säulen** es taten. Beim
  Einbetten wird jetzt für einen gestapelten Chart `stacked: true` **sowohl** auf
  der obersten Ebene **als auch** auf `apex_config.chart` gesetzt (eines allein
  reicht Säulen, Flächen brauchen `chart.stacked`) — egal, auf welcher Ebene der
  Nutzer es angegeben hat. `apex_config` wird dabei weiterhin **tief** gemischt,
  nur `chart.height` wird erzwungen.
- Zusätzlich bekommt ein gestapelter Chart, der seine Daten über `group_by`
  rastert, standardmäßig `group_by.fill: last`. Damit trägt jede Reihe in jedem
  Zeitfenster einen Punkt und alle Reihen haben deckungsgleiche Zeitstempel —
  die Voraussetzung, unter der ApexCharts Flächen überhaupt stapelt. Ein eigener
  `group_by.fill` in der Nutzer-Config gewinnt.

## [0.7.0]

### Geändert

- **des-house-card:** Umbau. Rechts oben statt der Zeilen jetzt drei Pillen
  **Solar / Speicher / Netz** mit dem aktuellen Wert in W und einem farbigen
  Quadrat (Farben wie der Mix-Balken: Solar `--des-production-color`, Speicher
  `#378ADD`, Netz `#E24B4A`); bei 0 W wird die Pille grau. Der Mix-Balken bleibt;
  die drei Legendenzeilen darunter entfallen.
- Neu darunter ein **Chart-Bereich** mit Perioden-Umschalter Tag | Woche | Monat
  | Jahr (gleiche Komponente wie des-stats/des-chart-card, Standard Tag) und einer
  eingebetteten apexcharts-card: gestapelte Flächen (type area, stacked,
  fill-opacity 0.6, dünne Linie, `extend_to: false`, Legende unten mit Abstand,
  ohne Werte). **Tag** = Leistung in W (group_by avg 10 min); **Woche/Monat/Jahr**
  = Energie in kWh aus der Langzeitstatistik (statistics change, period day bzw.
  month, align start). Reihen Solar/Speicher/Netz.
- Quellen per Konfiguration, Standard = Daniels Helfer: `solar_power_entity`,
  `storage_power_entity` (nur positiver Anteil), `grid_power_entity` (Bezug) für
  Tag; `solar_energy_entity`, `storage_energy_entity`, `grid_energy_entity` für
  Woche/Monat/Jahr. Ohne die Energie-Entitäten zeigt die Karte nur „Tag". Die
  bestehenden Optionen bleiben gültig; der Aufklappbereich (Chevron) mit den
  Tageswerten bleibt unter dem Chart.
- Karten-Höhe: `getGridOptions` jetzt `rows: 6` (`min_rows: 5`).

## [0.6.5]

### Geändert

- **des-chart-card:** Die eingebettete apexcharts-card bekommt standardmäßig eine
  Legende mit Abstand zwischen Farbmarker und Text (`legend.markers.offsetX: -4`,
  ~6 px) sowie `legend.itemMargin.horizontal: 10`. Beides sind nur Defaults —
  eine `apex_config.legend` aus der Nutzer-Config wird per Deep-Merge darübergelegt
  und gewinnt je Schlüssel. Reine Geometrie, in Light und Dark identisch.

## [0.6.4]

### Geändert

- **Farb-Audit korrigiert.** Nur noch zwei Energie-Grün-Tokens in `src/tokens.ts`:
  `--des-production-color` = `var(--success-color, #2e7d32)` (folgt jetzt dem
  Theme-Grün) und `--des-export-color` = `#2e7d32` (fester Hex). Der Token
  `--des-status-ok-color` entfällt; alle Status-Stellen (Pillen Normal/Bereit/
  Notstrom, Akku-Füllung, Lade-/Heiz-Werte, Punkte) stehen wieder direkt auf
  `var(--success-color, #2e7d32)` wie vor 0.6.3 — die Pillen werden nicht mehr
  über Tokens gefärbt. Das Oliv `#639922` entfällt vollständig.
- **Dashboard-Chart „Verbrauch nach Quelle":** Reihe „Solar" auf
  `var(--success-color)` (apexcharts-card löst die Variable auf), Reihe
  „Einspeisung" auf `#2e7d32`; `transform`-Zeilen unverändert.

### Entfernt

- **des-house-card:** Die Kopfzeilen-Pille „Einspeisung … W" / „Netzbezug … W"
  samt Option `grid_min_w` ist entfernt. Die Netz-Einspeisung steht jetzt als
  Zeile „Export" auf der Wechselrichterkarte; der Mix-Balken und der „Heute"-
  Block (inkl. Einspeisungs-Tageswert) bleiben unverändert.

## [0.6.3]

### Geändert

- **Farb-Audit: genau zwei Energie-Grüns im ganzen Projekt.** Alle grünen
  Fundstellen in `src/` ziehen ihre Farbe jetzt aus drei Tokens (`src/tokens.ts`):
  `--des-production-color` (`#2e7d32`, Produktion/Solar/PV), `--des-export-color`
  (`#639922`, Export/Einspeisung) und dem davon getrennten Status-Grün
  `--des-status-ok-color` (`#2e7d32`, Normal/Bereit/Laden/Heizen/Akkufüllung/Punkt).
  Verstreute `var(--success-color, #2e7d32)`-Definitionen entfallen.
- **Sichtbare Änderung:** Einspeisung ist jetzt überall olivgrün statt success-
  grün — Hauskarte (Pille „Einspeisung" und Einspeisungs-Tageswert) und
  Wechselrichterkarte (Netz-Einspeisung in der Phasentabelle). Produktion/PV und
  alle Status-Grüns bleiben `#2e7d32` (Aussehen unverändert).
- Der Dashboard-Chart trug die Zielwerte bereits (Solar `#2e7d32`, Einspeisung
  `#639922`); dort war keine Änderung nötig.

## [0.6.2]

### Geändert

- **Produktion-Farbe als Token:** Neuer Design-Token `--des-production-color`
  (`src/tokens.ts`), Standardwert `#2e7d32` (das voreingestellte HA-Erfolgsgrün).
  Die Statistikkarte zeichnet die Zeile „Produktion" jetzt darüber statt über
  `--success-color` — damit ist die Farbe an einen festen Hex gebunden und passt
  zum Dashboard-Chart (der keine CSS-Variablen lesen kann).
- **Dashboard-Chart „Verbrauch nach Quelle":** die Reihe „Solar" trägt in allen
  vier Zeiträumen jetzt `#2e7d32` (Token-Wert) statt `#639922`. So sind „Solar"
  (grün) und „Einspeisung" (`#639922`, olivgrün) wieder unterscheidbar.

## [0.6.1]

### Geändert

- **Export-Farbe vereinheitlicht:** Neuer gemeinsamer Design-Token
  `--des-export-color` in `src/tokens.ts`, Standardwert `#639922` (das gedämpfte
  Olivgrün der Export-Zeile der Statistikkarte). Der bisherige Standard `#F29B9A`
  der Wechselrichterkarte entfällt.
- **des-stats-card:** nutzt für die Export-Zeile jetzt `--des-export-color` statt
  des lokalen `--stats-export-color` (Wert unverändert `#639922`).
- **des-inverter-card:** der Export-Balken bezieht die Farbe aus dem gemeinsamen
  Token und wird damit ebenfalls olivgrün statt hellrot.
- **Dashboard-Chart „Verbrauch nach Quelle":** die Reihe „Einspeisung" trägt in
  allen vier Zeiträumen jetzt `#639922` (Token-Wert) statt `#F29B9A`.

## [0.6.0]

### Hinzugefügt

- **des-inverter-card:** Neue Balkenzeile **Export** unter PV2, gleiche Bauart
  wie die PV-Zeilen (Label links, Balken, Wert rechts). Der Wert ist die Summe
  der konfigurierten `grid_power_entities` (Deye-Vorzeichen: positiv = Bezug,
  negativ = Einspeisung), invertiert, sodass Einspeisung positiv erscheint.
  Gezeigt wird nur Einspeisung: bei Bezug oder unter 40 W steht der Balken auf 0
  und der Wert auf „0 W". Die Balkenlänge ist relativ zu `kwp_total` (wie die
  PV-Balken zu ihrem kWp). Keine neue Konfiguration — nutzt die vorhandenen
  `grid_power_entities`.
- Neuer Design-Token `--des-export-color` (Standard `#F29B9A`) für die
  Balkenfarbe; sie entspricht der „Einspeisung"-Reihe im Dashboard-Chart, damit
  Karte und Chart dieselbe Farbquelle haben.

## [0.5.0]

### Hinzugefügt

- **des-inverter-card:** Uhrzeit-Überwachung über das neue `time_entity`
  (`datetime`) und `time_warn_minutes` (Standard 2). Die Abweichung ist die Zeit
  der Entität minus die Browserzeit, vorzeichenbehaftet — positiv heißt, der
  Wechselrichter geht vor. Sie wird **jede Minute** neu bewertet, nicht nur bei
  einem Zustandswechsel: eine stehende Uhr fiele sonst gar nicht auf.
- Ab der Schwelle steht links neben der Status-Pille eine amber Pille
  „Uhr +3 min" bzw. „Uhr −3 min"; darunter keine. Ist die Entität nicht lesbar,
  steht dort grau „Uhr ?".
- Aufgeklappt eine Zeile „Wechselrichter-Uhr" mit dem Wert als
  `dd.MM.yyyy HH:mm` und `(Δ +3 min)`, dazu der Knopf **Zeit setzen** im Stil
  der Segmented-Control-Buttons. Er ruft `datetime.set_value` mit der lokalen
  Zeit (Sekunden `00`) auf und bestätigt kurz mit „gesetzt". Deaktiviert,
  solange die Abweichung unter der Schwelle liegt oder die Entität nicht lesbar
  ist.
- Ohne `time_entity` ändert sich an der Karte nichts.

## [0.4.1]

### Behoben

- **des-chart-card:** Chart und Legende liefen in der Sections-View unten über
  den Kartenrand — die Höhe kam aus dem Inhalt statt aus dem Raster. Ursache
  war das voreingestellte `min-height: auto` der Flex-Kinder: `.card` konnte
  nicht unter seine Inhaltshöhe schrumpfen, der Chart drückte die Karte also
  auf, und die Messung las genau diese aufgedrückte Höhe zurück.
- Jede Flex-Ebene hat jetzt `min-height: 0`, `ha-card` zusätzlich
  `overflow: hidden`; Kopfzeile und Metazeile stehen auf `flex: 0 0 auto`, der
  Chart-Container auf `flex: 1 1 auto`. Damit gewinnt die Rasterhöhe über den
  Inhalt.
- Gemessen wird jetzt der `clientHeight` des Chart-Containers statt der
  `ha-card`, und der `ResizeObserver` hängt am Container. Der Container wird
  aus dem Code **nicht** mehr bemaßt — sonst wäre die Messung die eigene
  Ausgabe. Eine neue Höhe wird nur bei mehr als 2 px Unterschied gesetzt.
- Der 220-px-Fallback ohne Rasterhöhe ist jetzt schlicht die CSS-`height` des
  Containers: wo die Karte eine Höhe bekommt, überschreibt Flex sie, wo nicht,
  bleibt sie stehen. Damit muss kein Code mehr die Sichtart unterscheiden.

## [0.4.0]

### Geändert

- **des-chart-card:** Das Chart füllt jetzt die Kartenhöhe, statt eine feste
  Höhe aus der Config zu behalten und darunter Leerraum zu lassen. Die Höhe wird
  aus der Karte abgeleitet (verfügbare Höhe minus Kopfzeile, Metazeile und
  Innenabstände) und über einen `ResizeObserver` auf der `ha-card` nachgeführt —
  der greift auch, wenn sich nur das Raster ändert und nicht das Fenster. Das
  laufende Chart wird per `updateOptions` auf die neue Höhe gesetzt und **nicht**
  neu erzeugt; ein Neuaufbau würde die Historie erneut laden.
- **des-chart-card:** `apex_config.chart.height` aus der Config wird dabei
  überschrieben. Ohne Rasterhöhe — klassische Masonry-View — greift ein Festwert
  von 220 px.
- **des-chart-card:** `getGridOptions` liefert jetzt `rows: 4` und `min_rows: 3`
  statt fest 6 Zeilen.

## [0.3.2]

### Behoben

- **Alle Karten mit Aufklapp-Überlagerung** (`des-house-card`,
  `des-inverter-card`, `des-storage-card`): Die Überlagerung schließt jetzt
  bündig an die Karte an. Ursache war die Positionierung: ein absolut
  positioniertes Kind wird gegen die *Padding-Box* von `ha-card` gelegt, sodass
  `left/right: 0` die Überlagerung auf jeder Seite um die Rahmenstärke der Karte
  einrückte — das war der sichtbare Absatz. Sie wird nun um genau diese Breite
  herausgezogen, sodass beide Rahmen-Boxen fluchten.
- Dazu passend: gleicher Hintergrund wie `ha-card` (in derselben
  Variablen-Reihenfolge, sonst weichen die Farben in Themes ab, die nur
  `--ha-card-background` setzen), gleiche Rahmenfarbe, und derselbe Schatten wie
  die Karte statt eines eigenen — ein eigener Schatten ließ die Überlagerung als
  zweite, abgesetzte Box erscheinen.
- Beim Aufklappen gibt die Karte ihre untere Rundung ab, damit an der Nahtstelle
  keine zwei Kurven aufeinandertreffen; beim Zuklappen kommt sie zurück. Die
  Überlagerung beginnt auf dem Unterrand der Karte und deckt ihn ab, sodass dort
  auch keine Haarlinie steht.

### Geändert

- Die `.chevron-row`-Regeln inklusive des Fokusrahmens (`:focus-visible` statt
  `:focus`, also kein Rahmen nach Maus- oder Touch-Klick) lagen dreimal
  identisch in den Karten und stehen jetzt einmal in `src/chevron.ts`.

## [0.3.1]

### Geändert

- **des-storage-card (battery):** Das Chevron zum Aufklappen sitzt jetzt unten
  mittig statt rechts neben dem Leistungswert — Position, Stil und Verhalten wie
  bei `des-house-card` und `des-inverter-card`, das Icon kommt aus dem
  gemeinsamen `src/chevron.ts`. Leistung und Restzeit rücken dadurch ganz nach
  rechts. Die Hauptzeile ist kein Klickziel mehr; aufgeklappt wird nur noch über
  die Chevron-Zeile, ebenfalls wie bei den anderen beiden Karten. Eingeklappt
  wächst die Karte dadurch um 30 px (8 px Abstand + 22 px Icon), bleibt damit
  aber innerhalb der bisherigen `grid_options.rows: 2`.
- **des-storage-card (thermal_group):** Der Status-Punkt vor dem Item-Namen ist
  um 1 px angehoben, damit er optisch mittig zur Textzeile sitzt. Punkt und Name
  liegen weiterhin in einem Flex-Container mit `align-items: center`; umgesetzt
  als `transform`, damit Zeilenhöhe und Flex-Layout unberührt bleiben.

## [0.3.0]

### Geändert

- **des-storage-card (battery):** Kapazität und Temperatur stehen jetzt als
  Pillen in der Kopfzeile, links von Notstrom- und Status-Pille. Die Temperatur
  behält ihre Farbschwellen, nur eben als Pille. Die Metazeile entfällt damit
  vollständig, `min. XX % SoC` inklusive — der Wert steht weiterhin am Slider im
  aufgeklappten Bereich. Die Pillen brechen nicht um; auf schmalen Karten wird
  stattdessen der Name gekürzt.

### Hinzugefügt

- **des-storage-card (battery):** Restzeit wird geschätzt, wenn für die aktuelle
  Richtung keine Entität konfiguriert ist — Entladen bis `threshold_pct`, Laden
  bis `charge_target_pct`, jeweils aus `soc`, `capacity_kwh` und der
  Anzeigeleistung. Grundlage ist ein exponentielles gleitendes Mittel der
  Leistung (Zeitkonstante ca. 5 min), damit die Anzeige nicht bei jeder Wolke
  springt; ein Richtungswechsel setzt das Mittel zurück. Angezeigt ab 60 s
  Datenbasis, gerundet auf 5 min, außerhalb als „< 10 min“ bzw. „> 48 h“. Im
  Zustand „Bereit“ entfällt die Restzeit. Konfigurierte Entitäten werden
  unverändert und ungeglättet übernommen.

## [0.2.2]

### Hinzugefügt

- **des-storage-card (thermal_group):** Je Item ein kleiner Status-Punkt vor dem
  Namen. Die Farbe folgt allein dem `switch_entity`-State: `on` → grün (wie der
  positive Leistungswert), sonst grau gedämpft (fehlend/`unavailable` ebenso).
  Der Punkt erscheint nur, wenn `switch_entity` konfiguriert ist; Badge und
  Leistungsfärbung bleiben unverändert.

## [0.2.1]

### Geändert

- **des-storage-card (battery):** Der Slider für `charge_target_pct` ist jetzt in
  **allen Modi** bedienbar und nicht mehr an den Umschalter **Laden | Auto**
  gekoppelt — die Ladegrenze ist eine Gerätegrenze (max. SoC), die dauerhaft
  gilt (z. B. beim Zendure). Beschriftung von „Ladeziel" auf **„Ladegrenze"**
  geändert. Ein statisch konfigurierter `charge_target_pct` bleibt wie bisher
  rein lokal (kein Service-Call).

## [0.2.0]

- Ausgangsstand: Speicher-, Wechselrichter-, Haus-, Statistik- und Chartkarte
  mit Entity-Bindung, Schreibpfad, `getGridOptions()` und Dropdown-Detailblock.
