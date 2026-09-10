# Changelog — Daniels Home Assistant Cards

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format grob nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.17.2]

### Geändert

- **des-light-card:** Die An/Aus-Segmente jeder Zeile nutzen jetzt die gemeinsame
  Reihenfolge **Aus links, An rechts** (`ON_OFF_OPTIONS`). Nur Reihenfolge, kein
  Verhaltens-/Service-Wechsel.

## [0.17.1]

### Geändert

- **des-cover-card:** Die An/Aus-Segmente der **Automatik-Zeile** (Lüftung/Urlaub)
  nutzen jetzt die gemeinsame Reihenfolge **Aus links, An rechts**
  (`ON_OFF_OPTIONS`). Nur Reihenfolge, kein Verhaltens-/Service-Wechsel.

## [0.17.0]

### Neu

- **des-garage-card:** optionale **`settings`** — ein Block „Einstellungen" unter
  der Tabelle (aufgeklappt) mit je Eintrag einer Zeile Name + Segmented
  **An | Aus** (`switch.turn_on`/`turn_off`, `input_boolean`/`switch`). Ist `pill`
  gesetzt und der Zustand `on`, erscheint eine Pille (in `color` blau/amber/grau)
  im Kopf, rechts neben „Licht an". Ohne `settings` entfällt der Block; nicht
  lesbare Entitäten dimmen das Segmented.

## [0.16.0]

### Neu

- **des-cover-card:** optionale **Automatik-Modi** (`modes`). Eingeklappt
  erscheint unter den Szenen-Kacheln eine Zeile „Automatik" mit je Modus dem
  Namen und einem Segmented **An | Aus** (`switch.turn_on`/`turn_off`); jeder
  eingeschaltete Modus zeigt eine Pille (`name` in `color` blau/amber/grau) im
  Kopf. Ohne `modes` entfällt die Zeile. Nicht lesbare Entitäten dimmen das
  jeweilige Segmented.

### Entfernt

- **des-settings-card** entfernt — die Funktion (Haus-Betriebsmodi als
  An/Aus mit Pillen) steckt jetzt in der Rollladenkarte (`des-cover-card`,
  `modes`). Der Kartentyp `custom:des-settings-card` existiert nicht mehr; im
  Dashboard durch die `modes` der Rollladenkarte ersetzen.

## [0.15.0]

### Neu

- **des-garage-card** — Garagenübersicht. Eingeklappt reiner Status (Metazeile
  „&lt;n&gt; Geräte an · &lt;Summe&gt; W", amber-Pille „Licht an", 2-Spalten-Raster
  mit Statuspunkt je Gerät — grün aktiv, grau an-aber-unter-Schwelle, leer aus —
  und aktueller Leistung). Aufgeklappt eine Tabelle mit Leistung, Verbrauch je
  Zeitraum (Tag/Woche/Monat/Jahr) und An/Aus je Gerät; Licht über `light.turn_on`/
  `turn_off`, Geräte über `switch.turn_on`/`turn_off`. Verbrauch ohne Helfer aus
  der Langzeitstatistik (`recorder/statistics_during_period`, Summe der
  `change`-Werte seit Periodenbeginn), je Zeitraum gecacht und alle 15 min
  erneuert; fehlende Statistik zeigt „–". Ohne Entities Demo-Modus. Registriert
  als **„Daniels Garagenkarte"**.

## [0.14.0]

### Neu

- **des-settings-card** — Haus-Betriebsmodi als An/Aus-Zeilen. Jede Zeile
  schaltet ein `input_boolean`/`switch` über `switch.turn_on`/`turn_off`; jeder
  aktive Modus zeigt eine Pille (`pill`-Text in `color` blau/amber/grau) im Kopf,
  die Metazeile meldet „Automatik" bzw. „&lt;n&gt; Abweichung(en)". Kein Chevron,
  keine Slider. Ohne `items` Demo-Modus (Lüftung an, Urlaub aus). Registriert als
  **„Daniels Einstellungskarte"**.

## [0.13.0]

### Neu

- **des-light-card** — Lichter je Raum als Liste: pro Zeile Icon, Name, in der
  Mitte ein Helligkeitsbalken (`kind: dim`, schreibt `light.turn_on`
  `brightness_pct`, 300 ms Debounce) oder ein Hinweistext (`kind: switch`),
  rechts ein Segmented **An | Aus**. „An" nutzt eine optionale `on_action`
  (z. B. Szenen-Skript), sonst `turn_on`; „Aus" schaltet die Entität aus. Ohne
  `items` Demo-Modus. Registriert als **„Daniels Lichtkarte"**.
- **des-bed-light-card** — Bettlicht (Seiten + zwei Kopfenden) mit
  Modus-Umschaltung (Aus/Ambiente/Max bzw. Aus/Lesen/Max) und einem
  aufgeklappten Szenen-Editor (Helligkeit, neun Farb-Presets, Weißton **oder**
  Farbton/Sättigung – der jeweils andere Block gedimmt). **Vorerst reine
  Oberfläche**: feste Demo-Werte, Bedienelemente wirken nur lokal, kein
  Entity-Binding. Registriert als **„Daniels Bettlichtkarte"**.

### Geändert

- **service.ts** um `writeLight(hass, entity, on, data?)` (`light.turn_on` mit
  optional `brightness_pct`/`color_temp_kelvin`/`hs_color`, sonst
  `light.turn_off`) und den Prüfer `isWritableLight` erweitert.

## [0.12.3]

### Behoben

- **des-dehumidifier-card:** Der **Chevron öffnete den Aufklappbereich nicht
  mehr.** Ursache: das in 0.12.2 gegen den Höhen-Überlauf gesetzte
  `overflow: hidden` auf `ha-card` überschrieb das `overflow: visible`, das
  `overlay.ts` braucht, damit das Dropdown (`top: 100%`) **unter** der Karte
  hängen kann — das Panel wurde weggeschnitten (der Klick selbst lief). Das
  `overflow: hidden` ist entfernt; die Karte läuft ohnehin nicht über, weil der
  Chart über `min-height: 0` nachgibt.
- **des-dehumidifier-card (x-Achse):** Die erste Uhrzeit stieß an die
  y-Achsen-Beschriftung. Jetzt beginnt der Plot 8 px rechts der y-Labels, die
  erste Zeitbeschriftung ist linksbündig (`text-anchor: start`), „jetzt"
  rechtsbündig, die mittleren zentriert. Die Ticks liegen auf **vollen
  6-h-Stunden** (00:00/06:00/12:00/18:00 ab der nächsten Marke nach Start) statt
  vom Startzeitpunkt aus gezählt.

## [0.12.2]

### Geändert

- **des-dehumidifier-card:** Der Chart nimmt nicht mehr die gesamte Resthöhe —
  er lässt der Chevron-Zeile ihren Platz (`min-height: 0`, `overflow: hidden` auf
  der Karte), sodass der Chevron denselben unteren Abstand hat wie in den anderen
  Karten statt am Kartenrand zu kleben.
- **des-dehumidifier-card:** Unter dem Balken stehen nur noch die Endwerte
  („30 … 80“); das mittlere „Ziel 45“ entfällt (steht in der Metazeile). Die
  senkrechte Zielmarke im Balken bleibt.
- **des-dehumidifier-card:** Countdown-Off-Option — Standard von `Abbrechen` auf
  **`cancel`** (der Roh-Zustand des Selects; HA übersetzt nur die Anzeige). Der
  Vergleich ist case-insensitiv und akzeptiert zusätzlich `Abbrechen`. Die
  Countdown-Texte (Pille und Segmented) kommen jetzt aus der
  Frontend-Übersetzung (`hass.formatEntityState`), danach greift die bisherige
  Kürzung („1 Stunde“ → „1 h“, Off → „Aus“).

### Hinzugefügt

- **des-dehumidifier-card:** Graue **Schloss-Pille** (`mdi:lock`, ohne Text,
  Tooltip „Kindersicherung aktiv“) im Kopf, nur wenn `child_lock_entity` „on“
  ist — vor der Max-Trocknen-Pille. Bei „off“ keine Pille.
- **types.ts:** `HomeAssistant.formatEntityState` ergänzt.

## [0.12.1]

### Neu

- **src/icon-buttons.ts** — gemeinsames Modul für eine Reihe Icon-Buttons
  (`iconButtonStyles` + `renderIconButtons(items, onSelect, groupLabel?)`). Jeder
  Button ist ein eigenes Element mit vollem Rahmen und Radius, 24×22 px, 3 px
  Gap, **kein negativer Margin, kein Überlappen** — ein hervorgehobener Button
  (`active`: Rahmen + Icon in `--primary-color`) ist rundum sichtbar. Später auch
  für die Lichtkarte gedacht.

### Geändert

- **des-cover-card:** Die ▼ ■ ▲-Buttons nutzen jetzt das neue Modul (vorher
  segmentiert mit geteiltem Rahmen — der aktive Stopp-Rahmen wurde vom Nachbarn
  abgeschnitten). **Reihenfolge überall** (Gruppenzeile und Einzelrollläden):
  links **▼** (zu, `close_cover`), Mitte **■** (stop), rechts **▲** (auf,
  `open_cover`).
- **des-cover-card:** Zugeklappt bleibt unter den Kacheln kein Leerraum — der
  Chevron sitzt direkt darunter (8 px), Karteninhalt oben ausgerichtet, und die
  Standardhöhe im Sections-View ist von 4 auf **3 Zeilen** gesenkt (Dashboard
  entsprechend auf `rows: 3`).

## [0.12.0]

### Neu

- **des-cover-card** — neue Karte für alle Rollläden auf der Seite „Haus":
  Kopfzeile mit gezählter Metazeile (offen/zu/teilweise), eine **Gruppenzeile**
  („Haus", `group_entity`) mit ziehbarem Positionsbalken (100 = offen) und den
  Buttons ▲ ■ ▼, eine Reihe **Szenen-Kacheln** (`scenes`, 1–6; Icon über Label,
  Tap ruft einen beliebigen Dienst) und aufgeklappt die **Einzelrollläden nach
  Etage** (`sections`) mit je Balken, Prozent und ▲ ■ ▼. Der Stopp-Button ist
  blau, solange der Rollladen fährt (`opening`/`closing`). Ohne Entities
  Demo-Modus. Registriert als **„Daniels Rollladenkarte"**.

### Geändert

- **service.ts** (gemeinsames Modul) um Rollladen-Dienste erweitert: `writeCover`
  (`cover.open_cover`/`close_cover`/`stop_cover`), `writeCoverPosition`
  (`cover.set_cover_position`), der Prüfer `isWritableCover` sowie ein generischer
  `callAction({ service, target?, data? })` für die Szenen-Kacheln (`target` wird
  in die Service-Daten gemischt, versionsunabhängig).
- **types.ts:** `HassServiceCall` und die Cover-Konfigurationstypen ergänzt.

## [0.11.0]

### Neu

- **src/temperature.ts** — gemeinsames Modul für die Temperatur-Einfärbung:
  `temperatureLevel(temp, profile, override?)` mit den Profilen **battery**
  (< 4 alert, < 8 warn, > 40 warn, > 50 alert) und **inverter** (> 60 warn,
  > 75 alert, keine Kältegrenzen); Rückgabe `neutral | warn | alert`. Optionale
  Overrides `temp_warn_c` / `temp_alert_c` heben die **oberen** Grenzen des
  Profils an bzw. ab. Dazu wiederverwendbare Pillen-Styles
  (`temperaturePillStyles`, Tönung per `color-mix`, Farben `--warning-color` /
  `--error-color` / `--secondary-text-color`) und `renderTemperaturePill`.

### Geändert

- **des-storage-card (Variante battery):** Kopf-Pille und Pack-Tabelle beziehen
  die Temperatur-Ampel jetzt aus dem gemeinsamen Modul (Profil **battery**);
  Grenzen per `temp_warn_c` / `temp_alert_c` überschreibbar. Optik und Verhalten
  unverändert.
- **des-inverter-card:** Die Wechselrichter-Temperatur (`inverter_temp_entity`)
  steht jetzt als **Pille in der Kopfzeile** links neben der Status-Pille
  (Format „51,6 °C", gleiche Pille wie bei den Akkus, Profil **inverter**); das
  Thermometer-Element in der Leistungszeile entfällt. Die **DC-Temperatur**
  (`show_dc_temp`) bleibt in der Fußzeile, wird nun aber nach demselben Profil
  eingefärbt. Grenzen per `temp_warn_c` / `temp_alert_c` überschreibbar.

## [0.10.0]

### Neu

- **des-dehumidifier-card** — neue Karte für einen Luftentfeuchter (Arete Two
  25 L über die Tuya-Integration) für die neue Dashboard-Seite „Haus“. Zeigt die
  aktuelle Luftfeuchte gegen den Zielwert, einen **24-h-Verlauf** als eigenes SVG
  (keine Fremdbibliothek), Störungs- und Status-Pillen und im Aufklappbereich die
  Bedienung: Gerät An/Aus (`power_entity`, `fan`/`switch`/`input_boolean`),
  Zielfeuchte-Slider (`humidifier.set_humidity`, 300 ms Debounce), Max-Trocknen
  (`countdown_entity`, `select`) und optional die Kindersicherung
  (`child_lock_entity`). Verlauf per `hass.callWS`
  (`history/history_during_period`), Nachladen alle 5 Minuten und beim Verbinden.
  Ohne Entities läuft die Karte im Demo-Modus. Registriert als **„Daniels
  Entfeuchterkarte“**.

### Geändert

- **service.ts** um zwei Domänen erweitert (gemeinsames Modul): `writePower`
  schaltet `fan`/`switch`/`input_boolean` über `turn_on`/`turn_off`,
  `writeHumidity` schreibt `humidifier.set_humidity`; dazu die Prüfer
  `isWritablePower`/`isWritableHumidity`. Die bestehenden Karten sind davon nicht
  betroffen.
- **types.ts:** `HomeAssistant` um das optionale `callWS` ergänzt (für die
  Verlaufs-Abfrage der Entfeuchterkarte).

## [0.9.4]

### Geändert

- **Umbenennung** des Produkts von „Daniels Energy Cards" in **„Daniels Home
  Assistant Cards"**: `hacs.json`-Name, `package.json` (name/description),
  README-Titel/-Einleitung, CHANGELOG-Kopf und der Konsolen-Banner. Der
  Bundle-Dateiname `dist/daniels-energy-cards.js` und die
  `custom:des-*`-Kartentypen bleiben unverändert (keine Konfigurationsänderung
  in Home Assistant nötig).

## [0.9.3]

### Geändert

- **des-storage-card (Variante battery):** Die Pack-Tabelle hat statt der einen
  „kWh"-Spalte jetzt zwei: **Kapazität** (Wert aus `packs[].capacity_kwh`, z. B.
  „2,9 kWh") und **Rest** (`soc × capacity`, z. B. „0,5 kWh"). Spaltenreihenfolge:
  **Akku · Kapazität · Rest · SoC · °C · Zellen**. Ohne `capacity_kwh` zeigen
  beide Spalten „–".

## [0.9.2]

### Geändert

- **des-storage-card (Variante battery):** Die Zeile **Notstromsteckdose**
  (`backup.switch_entity`) steht jetzt **oberhalb** der Pack-Tabelle. Reihenfolge
  im Aufklappbereich: Umschalter, Slider, Notstromsteckdose, Pack-Tabelle.
- **des-storage-card:** Pack-Tabelle ohne Spalte **SoH** — der Zendure liefert
  lokal keinen Zustandswert je Pack. Die kWh-Spalte bleibt (aus
  `packs[].capacity_kwh` × `soc`). Das Pack-Feld `soh` entfällt.

### Hinweis

- Der Slider **max. Entladen** (`discharge_limit_entity`) nimmt seinen Startwert
  schon immer aus dem **Entitätszustand** (kein Default/Maximum) und schreibt
  beim Loslassen per `input_number.set_value`; der optimistische Local-State
  wird verworfen, sobald die Entität den Wert bestätigt. Dass der Slider nach
  einem Neustart auf 2400 sprang, lag am `initial: 2400` des Helfers
  `input_number.pv_helper_zendure_entladeleistung_maximum` — behoben in
  `pv_helper_laden.yaml`, nicht in der Karte.

## [0.9.1]

### Geändert

- **des-storage-card (Variante battery):** `packs` wird jetzt als kompakte
  **Tabelle** dargestellt (Spalten **Akku · kWh · SoC · SoH · °C · Zellen**) statt
  als Textzeilen. Kopfzeile gedämpft, Werte rechtsbündig, Temperatur mit der
  Ampelfarbe, Zellbalance-Text aus dem Sensor; fehlende Werte „–". Zeilenhöhe wie
  die Item-Zeilen der `thermal_group`.
- **des-storage-card:** Der Schalter der **Notstromsteckdose**
  (`backup.switch_entity`) war überproportional groß und ist jetzt auf die Größe
  der übrigen Bedienelemente gebracht (Label links, kompakter Schalter rechts,
  Zeilenhöhe wie eine Slider-Zeile).

### Hinzugefügt

- **des-storage-card:** Neue optionale Pack-Felder `capacity_kwh` (Entity oder
  Zahl; ergibt zusammen mit `soc` die kWh-Spalte) und `soh` (Entity; eigene
  Spalte).

## [0.9.0]

### Hinzugefügt

- **des-storage-card (Variante battery):** `charge_mode_control.off_state` —
  ist es gesetzt (nur für `select`/`input_select`), wird der Umschalter
  dreiteilig **Laden | Auto | Aus** und wandert aus der Slider-Zeile in eine
  eigene Zeile **oberhalb** der Slider (volle Breite, rechtsbündig). Ohne
  `off_state` bleibt das zweiteilige Layout neben den Slidern unverändert. „Aus"
  schreibt die konfigurierte Option per `select_option`.
- **des-storage-card:** `backup.switch_entity` — im aufgeklappten Bedienbereich
  eine Zeile „Notstromsteckdose" mit Schalter, der eine `switch`-/
  `input_boolean`-Entität per `turn_on`/`turn_off` schaltet (optimistisch, mit
  Rückfall auf den Entitätszustand).
- **des-storage-card:** `packs` — optionale Liste je Akkupack
  (`name`, `soc`, `temp_c`, `balance`). Im Bedienbereich je Pack eine kompakte
  Zeile „Akku 1 · 72 % · 34 °C · Zellen: Excellent"; die Temperatur trägt die
  bestehende Ampelfarbe, fehlende Werte zeigen „–". Die Zeilen stehen zwischen
  den Slidern und der Notstromsteckdose.

### Geändert

- **des-storage-card:** Das **Notstrom-Badge** aus einer Entität
  (`backup.entity` + `active_states`) ist jetzt: Treffer in `active_states` →
  grün „Notstrom bereit" (Steckdose an/bereit), **kein** Treffer → rot
  „Notstrom aus". Bisher meldete ein Treffer rot „NOTSTROM AKTIV" und kein
  Treffer grün „Notstrom bereit". `active_states` beschreibt damit den
  **eingeschalteten** Zustand der Notstromsteckdose statt eines Netzausfalls.
  Die festen Formen `backup: active` (rot „NOTSTROM AKTIV") und `backup: ready`
  (grün „Notstrom bereit") sind unverändert.

## [0.8.1]

### Behoben

- **des-storage-card (Variante battery):** Die geschätzte Restzeit verschwand
  bei aktiver Entladung immer wieder für ~1 Minute und kam von selbst zurück.
  Ursache: der geglättete Leistungsmittelwert wurde bei **jedem** kurzen
  Richtungswechsel zurückgesetzt (sekundenweises Pendeln eines geteilten
  Akku-Sensors), was das 60-s-„Warmup"-Fenster neu startete. Jetzt setzt ein
  Richtungswechsel das Mittel erst zurück, wenn die neue Richtung **30 s stabil**
  anliegt; bis dahin bleibt das alte Mittel und damit die letzte Schätzung
  stehen. Ein Momentan-idle-Sample setzt nichts mehr zurück.

### Hinzugefügt

- **des-storage-card:** Debug-Attribut `data-eta-state` am Restzeit-Element
  (`ok`, `flip`, `device`, `idle`, `warmup`, `no-data`, `no-soc`, `no-limit`,
  `below-min`, `out-of-range`, `no-power`) — im Browser-Inspektor lässt sich so
  zuordnen, warum die Schätzung gerade (nicht) erscheint. Das Element bleibt
  auch ohne sichtbaren Wert im DOM (dann `hidden`).

## [0.8.0]

### Hinzugefügt

- **des-storage-card (Variante battery):** Neue optionale
  `discharge_limit_entity`. Ist sie gesetzt, erscheint im Aufklappbereich unter
  „min. SoC" eine dritte Slider-Zeile **„max. Entladen"** mit dem Wert in W
  (z. B. „2.400 W"). Min/Max/Schritt kommen aus den Attributen der Entität; der
  Slider schreibt beim Loslassen per `input_number.set_value` und ist **immer
  bedienbar** (unabhängig von Laden/Auto). Gleiche Optik und Abstände wie die
  vorhandenen Slider; der Aufklappbereich wächst um eine Zeile.

## [0.7.7]

### Geändert

- **des-house-card:** Tages-Chart auf 30-Minuten-Raster (`group_by.duration`
  von `10min` auf `30min`) — weniger, breitere Säulen.

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
