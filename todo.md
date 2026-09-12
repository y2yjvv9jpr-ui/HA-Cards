# todo.md — offene Punkte (Stand 12.09.2026)

Reihenfolge = Vorschlag. Jeder Punkt wird erst abgestimmt, dann freigegeben,
dann umgesetzt (siehe claude.md).

## 12.09. — im Repo, in HA einzuspielen

- [ ] 12.09. **pv_helper_laden** Ladeteilung/Entladestopp/30 s → in HA einspielen,
      **Neustart nötig** (neue `input_number`: `pv_helper_ladeteilung_start`/
      `_ziel`/`_stopp`), Helferwerte **1400/1000/500** setzen. Inhalt: Überschuss =
      Einspeisung + Auto-Heizerleistung − Hausakku-Entnahme + Teilungsanteil (ab
      1400 W Hausakku-Ladung anteilig, Ziel ~1000 W, aus unter 500 W); neuer
      Template-Sensor `pv_helper_heizer_leistung`; alle Stopp-Binärsensoren
      30 s statt 1 min; Bedarfsentladen stoppt sofort, sobald der Zendure entlädt
      und die Hausakkus laden (> 100 W).
- [ ] 12.09. **Hausverbrauchs-Differenz** (L3): Zählerstand-Vergleich Bezug vs.
      Deye-Import ausstehend.

## Karten-Konvention

- [x] 11.09. **des-garage-card** (v0.18.0): eingeklappt kompakt — Chip-Zeile
      (umbrechend) statt 2-Spalten-Raster; Chevron direkt darunter. Licht-Pille
      immer sichtbar („Licht aus" grün / „Licht an" amber). Aufgeklappter Bereich
      unverändert. → **per HACS auf 0.18.0**.
- [x] 11.09. Haus-Dashboard: Garagenkarte auf `rows: 3` (2 war für zwei
      Chip-Umbruchzeilen + Chevron zu knapp); settings-Pille „Mäher lädt" →
      „Ladestation aktiv". → Dashboard neu einspielen. Reine Dashboard-Änderung,
      keine neue Kartenversion.
- [x] 11.09. **des-garage-card** (v0.18.1): Chips ohne Rahmen (nur Punkt + Name,
      12 px Abstand) → passen möglichst in eine Zeile; keine Leistung im Chip.
      Metazeile bei genau einem aktiven Gerät „&lt;Name&gt; an · &lt;W&gt; W".
      Dashboard-Höhe zurück auf `rows: 2`. → **per HACS auf 0.18.1**, Dashboard
      neu einspielen; auf schmalen Screens kann die Chip-Zeile umbrechen (dann
      ggf. rows 3).
- [x] 11.09. An/Aus-Reihenfolge vereinheitlicht: gemeinsame `ON_OFF_OPTIONS`
      (Aus links, An rechts – wie ein Schalter) in `segmented.ts`; umgestellt in
      des-cover-card (v0.17.1), des-light-card (v0.17.2), des-garage-card
      (v0.17.3), des-dehumidifier-card (v0.17.4). Dreier-Controls (Bett,
      Storage) unverändert. → **per HACS auf 0.17.4**.

## Haus-Seite (neue Dashboardseite)

- [x] 10.09. **des-dehumidifier-card** (v0.10.0): neue Karte für den
      Luftentfeuchter (Arete Two 25 L, Tuya) — Ist gegen Ziel, 24-h-SVG-Verlauf,
      Störungs-/Status-Pillen, Aufklapp-Bedienung (Ein/Aus, Zielfeuchte,
      Max-Trocknen, Kindersicherung). service.ts um `writePower` (fan/switch/
      input_boolean) und `writeHumidity` (`humidifier.set_humidity`) erweitert.
      Dashboard-Datei `yaml/ui/Haus Dashboard.yaml` (Ansicht „Haus“, path `haus`,
      Theme kibibit) angelegt. → **per HACS auf 0.10.0 aktualisieren**, Seite
      „Haus“ in HA anlegen (Dashboard-YAML einspielen), **Entity-IDs prüfen**.
- [x] 10.09. **des-dehumidifier-card** (v0.12.2): Korrekturen nach erstem Test —
      Chart lässt der Chevron-Zeile Platz (kein Kleben am Rand); Balken-Skala nur
      noch Endwerte „30 … 80“; Countdown-Off-Default `cancel` (case-insensitiv,
      akzeptiert `Abbrechen`), Anzeige aus `hass.formatEntityState`; graue
      Schloss-Pille bei aktiver Kindersicherung (vor Max-Trocknen).
      → **per HACS auf 0.12.2**.
- [x] 10.09. **des-dehumidifier-card** (v0.12.3): toter Chevron behoben —
      `overflow: hidden` auf `ha-card` (aus 0.12.2) schnitt das Aufklapp-Dropdown
      weg (overlay.ts braucht `overflow: visible`); entfernt. x-Achse: Plot 8 px
      rechts der y-Labels, erste Uhrzeit linksbündig, „jetzt" rechtsbündig, Ticks
      auf vollen 6-h-Stunden (00/06/12/18). → **per HACS auf 0.12.3**.
- [ ] Verlauf im Live-Betrieb gegenchecken: liefert
      `history/history_during_period` die Feuchte sauber, sitzt die Zielmarke,
      passen die Achsen (Uhrzeiten ohne Kollision, Chevron öffnet)? Countdown-
      Pille/Segmented gegen die echten Select-Optionen prüfen (Beschriftung
      „1 h“/„2 h“, Off erkannt). Schloss-Pille bei aktiver Kindersicherung sichtbar?
- [x] 10.09. **des-cover-card** (v0.12.0): Rollladenkarte — Gruppenzeile „Haus"
      (`cover.rollladen`), fünf Szenen-Kacheln (Tag/Nacht/Vormittag/Nachmittag/
      Aquarien) und aufgeklappt die Einzelrollläden nach Etage (Positionsbalken,
      Prozent, ▲ ■ ▼; Stopp blau bei opening/closing). service.ts um `writeCover`,
      `writeCoverPosition`, `isWritableCover` und `callAction` erweitert. Karte
      links neben der Entfeuchterkarte im Dashboard. → **per HACS auf 0.12.0**,
      Dashboard-Datei `yaml/ui/Haus Dashboard.yaml` in HA einspielen,
      **Entity-IDs prüfen** (Cover, Skripte, input_boolean, Aquarien-Automation).
- [x] 10.09. **des-cover-card** (v0.12.1): Korrekturen nach erstem Test —
      neues Modul `src/icon-buttons.ts` (eigene Rahmen, 3 px Gap, aktiver Rahmen
      nicht mehr abgeschnitten); Button-Reihenfolge überall **▼ ■ ▲** (zu/stop/
      auf); zugeklappt kein Leerraum unter den Kacheln (Chevron direkt darunter),
      Standardhöhe 3 Zeilen, Dashboard `rows: 3`. → **per HACS auf 0.12.1**,
      Dashboard-Datei neu einspielen.
- [ ] Rollladenkarte live gegenchecken: liefern alle Cover `current_position`
      (voller Balken = offen)? Fahren ▼ ■ ▲ richtig, wird Stopp bei Fahrt blau?
      Passt die Karte bei `rows: 3` (Kopf, Gruppe, Kacheln, Chevron ohne
      Abschneiden)? Szenen-Kacheln lösen die richtigen Skripte/Booleans/die
      Aquarien-Automation aus; nicht existente Ziele werden gedimmt.
- [x] 10.09. **des-light-card** + **des-bed-light-card** (v0.13.0): zwei
      Lichtkarten. Wohnzimmer funktional (An/Aus, Helligkeit, `on_action`;
      `light.spots_wohnzimmer`, `switch.licht_esstisch` → `script.esstisch_ambiente`,
      `switch.licht_couchtisch`). Bett vorerst **nur Oberfläche** (Demo-Werte,
      lokal). service.ts um `writeLight`/`isWritableLight` erweitert. Beide im
      Dashboard (columns 12, rows 3). → **per HACS auf 0.13.0**, Dashboard
      einspielen, **Wohnzimmer-Entity-IDs prüfen**.
- [ ] Wohnzimmer-Lichtkarte live gegenchecken: Helligkeit von
      `light.spots_wohnzimmer` (Attribut `brightness`), schaltet „Essen" das
      Ambiente-Skript, Segmented-Zustände korrekt?
- [ ] **Bettlicht-Steuerung in HA reparieren** (derzeit defekt); danach
      Helfer-Package `haus_helper_licht_bett.yaml` (`input_select` je Zeile,
      `input_number` je Modus für Helligkeit/Weißton/Farbton/Sättigung) und die
      **Bettkarte verdrahten** (Entity-Binding statt Demo).
- [x] 10.09. **des-settings-card** (v0.14.0): Haus-Betriebsmodi als An/Aus-Zeilen
      (`input_boolean.helperluftungsmodus` Lüftung/blau, `input_boolean.urlaub`
      Urlaub/amber), Pillen für aktive Modi, Metazeile „Automatik"/„n
      Abweichungen". writeSwitch. Im Dashboard (columns 12, rows 2).
      → **per HACS auf 0.14.0**, Dashboard einspielen, Entity-IDs prüfen.
- [x] 10.09. Damit sind alle Haus-Karten gebaut (Rollläden, Wohnzimmer,
      Bett, Luftentfeuchter).
- [x] 10.09. **des-cover-card** (v0.16.0): Automatik-Zeile (`modes`) mit Pillen
      (Lüftung/blau, Urlaub/amber) unter den Szenen-Kacheln; **des-settings-card
      entfernt**, Funktion in der Rollladenkarte. Dashboard: Settings-Karte raus,
      Rollladenkarte um `modes` ergänzt und auf `rows: 4` erhöht.
      → **per HACS auf 0.16.0**, Haus-Dashboard neu einspielen, Entity-IDs prüfen.
- [ ] Offen Haus-Seite: **Bettlicht-Steuerung reparieren** + Verdrahtung (s. o.);
      **Lampe-außerhalb-geschaltet-Automation**; **Wirkung der Betriebsmodi**
      (Lüftungs-/Urlaubsmodus) dokumentieren, sobald Daniel sie beschrieben hat.

## Garage-Seite

- [x] 10.09. **des-garage-card** (v0.15.0): Statusübersicht (2-Spalten-Kacheln,
      Statuspunkt + Leistung, „Licht an"-Pille) und aufgeklappt eine Schalttabelle
      mit Leistung, Verbrauch je Zeitraum (aus `recorder/statistics_during_period`,
      ohne Helfer) und An/Aus je Gerät. Neue Datei `yaml/ui/Garage Dashboard.yaml`
      (Ansicht „Garage", Theme „Caule Black Yellow"). → **per HACS auf 0.15.0**,
      Garage-Seite anlegen (Dashboard-YAML einspielen), **Entity-IDs prüfen**;
      bisherige Button-/mini-graph-Karten der Seite entfallen.
- [ ] Garagenkarte live gegenchecken: liefern die `energy`-Sensoren Statistik
      (`statistics_during_period`)? Zeiträume korrekt, Statuspunkte plausibel,
      passt die Kartenhöhe (rows 4)?
- [x] 10.09. Garagenkarte auf die **Haus-Seite** verschoben; eigene
      Garage-Seite entfällt. `yaml/ui/Garage Dashboard.yaml` gelöscht, Karte
      unverändert hinter der Bett-Karte im Haus-Dashboard.
      → **Haus-Dashboard neu einspielen**, **Garage-Seite in HA löschen**.
- [x] 11.09. **des-garage-card** (v0.17.0): `settings`-Block (aufgeklappt) —
      `input_boolean.helper_moweron` „Mähroboter Laden aktiv" mit Pille „Mäher
      lädt" (blau). → **per HACS auf 0.17.0**, Haus-Dashboard neu einspielen,
      Entity-ID `input_boolean.helper_moweron` prüfen.

## 0a. 10.09. — im Repo, in HA einzuspielen

- [x] 10.09. Temperatur-Einfärbung zentralisiert (v0.11.0): neues Modul
      `src/temperature.ts` (`temperatureLevel(temp, profile, override?)`, Profile
      **battery**/**inverter**, gemeinsame Pillen-Styles). des-storage-card nutzt
      Profil battery (Kopf-Pille + Pack-Tabelle, Verhalten unverändert);
      des-inverter-card zeigt die WR-Temperatur jetzt als Pille in der Kopfzeile
      (Profil inverter, > 60 gelb, > 75 rot), Thermometer in der Leistungszeile
      entfällt, DC-Temperatur in der Fußzeile eingefärbt. Grenzen je Karte per
      `temp_warn_c`/`temp_alert_c` überschreibbar. → per HACS auf 0.11.0.
- [x] 10.09. Zendure-Zusatzakku (AB3000X, Gesamt 5,3 kWh): `pv_helper_speicher.yaml`
      liefert `pv_helper_hausakku_energie` (SoC × 13,1) und `pv_helper_zendure_energie`
      (SoC × `zendure_total_capacity`); Chart „Speicher-Füllstand" liest diese
      (Achse 0–18,5 kWh). → Package einspielen (Template neu laden), Dashboard-YAML.
- [x] 10.09. `pv_helper_laden.yaml`: Lademodus mit dritter Option **Aus** (Standby,
      Automationen inaktiv — zum An-/Abstecken von Packs); Template-Schalter
      `switch.pv_helper_zendure_notstromsteckdose` (gridOffMode 0/2 per
      rest_command.zendure_setting). → einspielen, **Neustart** (neue Option/Schalter).
- [x] 10.09. des-storage-card (v0.9.0): Dreier-Segmented-Control Laden|Auto|Aus
      (`off_state`, nur select) als eigene Zeile über den Slidern;
      `backup.switch_entity` (Notstromsteckdose ein/aus im Aufklappbereich);
      `packs:` (je Pack SoC/Temperatur/Zellbalance). Notstrom-Badge aus Entität
      **umgedreht**: Treffer in `active_states` = grün „Notstrom bereit", kein
      Treffer = rot „Notstrom aus" (feste Formen `active`/`ready` unverändert).
      → per HACS auf 0.9.0 aktualisieren; Dashboard-YAML liegt schon passend im Repo.
- [x] 10.09. des-storage-card (v0.9.1): `packs` als kompakte Tabelle
      (Akku · kWh · SoC · SoH · °C · Zellen) statt Textzeilen; neue Pack-Felder
      `capacity_kwh` (kWh-Spalte = SoC × Kapazität) und `soh`; Notstrom-Schalter
      auf Bedienelement-Größe gebracht (kompakter ha-switch). → per HACS auf 0.9.1.
- [x] 10.09. des-storage-card (v0.9.2): Notstromsteckdosen-Zeile jetzt **über**
      der Pack-Tabelle (Reihenfolge: Umschalter, Slider, Notstromsteckdose,
      Tabelle); Spalte **SoH entfernt** (Gerät liefert lokal keinen Wert), kWh
      weiter aus `packs[].capacity_kwh`. Slider „max. Entladen" liest den
      Startwert bereits aus der Entität (der 2400-Reset kam vom `initial:` des
      Helfers). → per HACS auf 0.9.2.
- [x] 10.09. des-storage-card (v0.9.3): Pack-Tabelle mit zwei kWh-Spalten —
      **Kapazität** (aus `packs[].capacity_kwh`) und **Rest** (SoC × Kapazität);
      Reihenfolge Akku · Kapazität · Rest · SoC · °C · Zellen. → per HACS auf 0.9.3.
- [x] 10.09. `pv_helper_speicher.yaml`: Gesamtenergie-Sensor
      `pv_helper_speicher_energie` (Hausakkus + Zendure). → Package neu einspielen
      (Template neu laden).
- [x] 10.09. Chart „Speicher-Füllstand" auf zwei Achsen: Gesamt-Linie (linke
      Achse 0–18,5 kWh) über Flächen je Speicher (rechte Achse 0–13,1 kWh).
      → Dashboard-YAML in HA ersetzen.
- [ ] docs/logik.md B7 (Karten-Schalter Zendure) und docs/anlage.md
      (Notstromsteckdose-Schalter, Lademodus **Aus**) nachziehen — Geräteregeln
      stehen bisher nur im Package-Kopf von `pv_helper_laden.yaml`.
- [x] 10.09. `initial:` an allen pv_helper-Helfern entfernt (Lademodus Zendure/Hausakku,
      Lade-/Entladeleistung, Netzladestrom): HA setzte sie bei jedem Neustart zurück
      (Laden → Auto, max. Entladen → 2400). Jetzt bleibt der letzte Wert erhalten.
      → Packages einspielen, Neustart; danach Werte einmal auf der Karte setzen.
      Kehrseite: „Laden" überlebt einen Neustart (Daniel informiert).
- [x] 10.09. `pv_helper_zendure_packs.yaml`: Kapazität je Pack (REST, Pack-Typ → kWh);
      SoH liefert das Gerät lokal nicht. → einspielen, Neustart.
- [ ] 10.09. Pingpong am Minimum: Gielz-Schutzladung lädt bei 15 % auf ~20 %, unsere
      Entlade-Hysterese startet ab 20 % → Kreislauf. Entscheidung: Schutz abschalten
      (`input_boolean.zendure_setting_soc_protection_disabled` an) ODER Startschwelle
      auf Minimum + 10 %. Empfehlung: Schutz aus.
- [x] 10.09. Füllstand-Chart: eine Achse (0–18,5 kWh), Linie Gesamt + überlagerte
      Flächen; Hausakkus wieder aus dem SoC-Sensor (Historie bleibt), Zendure/Gesamt
      aus den neuen kWh-Sensoren (Historie ab 10.09.). → Dashboard-YAML einspielen.
- [x] 10.09. `pv_helper_energiezaehler.yaml`: Verbrauch = Integral der Hausleistung
      (`pv_helper_energie_verbrauch_integral` aus `pv_helper_haus_leistung`) statt
      Deye-Verbrauchszähler (zählte Netzladen als Hausverbrauch: 17,4 statt 12,2 kWh).
      → Datei einspielen, **Neustart** (neuer Integration-Sensor), dann Kalibrierskript
      einmal ausführen (setzt Tag/Woche/Monat/Jahr-Verbrauch aus der Bilanz).
- [x] 10.09. Kalibrierskript: Verbrauch Woche/Monat/Jahr/Tag = Produktion + Import −
      Export + Entladen − Laden derselben Periode (keine Referenzwerte mehr nötig).
      → Skript in HA (YAML-Modus) ersetzen.
- [x] 10.09. docs/logik.md E4/E8 nachgezogen.

## 0. Gesamtlogik verständlich machen

- [x] 06.09. `docs/logik.md` (nummerierte Regeln A1…F mit Vorgabe/Abweichung) und
      `docs/anlage.md` (Anlage, Entitäten, Register, Geräteverhalten) angelegt, in
      `claude.md` verknüpft. → Daniel prüft die Abweichungen (Spalte rechts) und
      entscheidet, was bleibt, was vereinfacht wird, was raus muss.

## 1. Fixes vom 06.09.

- [x] 06.09. `pv_helper_laden.yaml`: Zendure lädt nur, wenn Hausakkus nicht > 100 W
      laden; Ladestopp auch bei ladenden Hausakkus. In HA eingespielt, Priorität
      am Vormittag bestätigt (Hausakkus voll → Zendure lädt).
- [x] 06.09. `pv_helper_energiezaehler.yaml`: Sprungschutz > 5 kWh. In HA eingespielt.
- [x] 06.09. `pv_helper_charts.yaml`: Solar direkt aus integrierter Leistung. In HA
      eingespielt (Entität umbenannt).
- [x] 06.09. `pv_helper_haus.yaml`: Haus = Deye-AC-Ausgang + Netz + Zendure-Abgabe −
      Zendure-Aufnahme. In HA eingespielt.
- [x] 06.09. Kalibrierskript `yaml/scripts/pv_helper_energiezaehler_kalibrieren.yaml`
      auf `_gesamt`-Quellen umgestellt (Referenzwerte unverändert, Zendure-Integral
      war an allen Periodenanfängen 0). → in HA (Skript, YAML-Modus) einspielen
      und einmal ausführen.
- [x] 06.09. `pv_helper_energiezaehler.yaml`: Sprungschutz auch für Produktion/
      Import/Export (`_gesamt`-Summen), Utility-Meter darauf umgehängt. → in HA
      einspielen (Template neu laden; Utility-Meter-Quellen greifen nach Neustart).
- [x] 06.09. Dashboard-Chart: Netz/Einspeisung lesen `_import_gesamt`/`_export_gesamt`,
      Einspeisung hellrot statt grün. → Dashboard-YAML in HA ersetzen.
- [x] 06.09. Ausreißer −8.000 kWh in der Langzeitstatistik von `inverter_total_energy_export`
      (Neustart 09:00): irrelevant, Chart liest jetzt `_export_gesamt`; Sensorverlauf sauber.
- [x] 06.09. Tageszähler-Kalibrierung obsolet (ab 07.09. 00:00 exakt).
- [x] 06.09. Chart: Lücke unter 0 beim Einspeisungs-Balken — Ursache: negative
      Statistik-Änderungen anderer Reihen werden mitgestapelt. Fix: Solar/Speicher/Netz
      per `transform` auf ≥ 0, Einspeisung per `transform` negativ (statt `invert`).
      → Dashboard-YAML (Chart-Karte) in HA ersetzen.
- [x] 06.09. Chart-Lücke endgültig gelöst über die **Reihenfolge**: negative
      Reihe (Einspeisung) steht zuerst, dann Solar/Speicher/Netz; zusätzlich
      `statistics.align: start` und `show.legend_value: false` in allen vier
      Zeiträumen. In `docs/logik.md` Block E vermerkt. (Extern in HA gemacht,
      ins Repo nachgezogen.)
- [x] 06.09. Chart „Speicher-Füllstand" fertig: gestapelte kWh-Flächen
      (Hausakkus `x*13.1/100`, Zendure `x*2.4/100`), yaxis 0–15.5,
      `extend_to: false`, Zeiträume Tag + Woche.
- [x] 06.09. Chart „Speicher-Füllstand“: Stapelung zusätzlich in
      `apex_config.chart.stacked: true` gesetzt (Tag und Woche) — das
      `stacked: true` der Karte allein reichte ApexCharts nicht. (Extern in HA
      gemacht, ins Repo nachgezogen.)
- [x] 06.09. Debug-Sektionen im Dashboard entfernt (power-flow-card-plus und
      die zweite Hauskarte); Datei endet nach dem Füllstand-Chart.
- [x] 06.09. des-chart-card (v0.6.5): Legende bekommt Default-Abstand zwischen
      Marker und Text (`legend.markers.offsetX: -4`, ~6 px) und
      `legend.itemMargin.horizontal: 10`, per Deep-Merge unter Nutzer-
      `apex_config.legend`. → Karte per HACS auf 0.6.5 aktualisieren.
- [ ] Repo direkt in HA einbinden statt manuell kopieren: Git-Pull (Add-on oder
      Cron) nach `/config/ha-cards`, `packages: !include_dir_named ha-cards/yaml/packages`;
      Heizer-Automation und Kalibrierskript als Packages; optional Dashboard im
      YAML-Modus aus dem Repo. Gielz-Datei aus dem Package-Ordner nehmen. (Daniel: später.)
- [ ] Prüfen, ob `inverter_total_load_consumption` (Deye-Verbrauchszähler) den
      gleichen Zendure-Fehler hat wie `inverter_load_power`: Tagesverbrauch Deye
      gegen Chart-Summe (Solar + Speicher + Netz) über einen ganzen Tag.

## 2. Hausakkus (Deye)

- [ ] Karten-Schalter Laden|Auto testen (`pv_helper_hausakku.yaml`, schreibt
      Register 127/128/130 per FC16 mit Rücklesen) — sobald die Hausakkus nicht
      voll sind (abends). Erwartung: Laden → Netzladen binnen ~30 s, Auto → Ende.
- [ ] Programm-SoC 1–6 auf 13 % setzen (= Low-Batt-Grenze), damit nur eine
      Entladegrenze gilt. Offen: wirken Programm-Register sofort oder erst zum
      nächsten Programm-Zeitpunkt? (Test 166 = 14 lief 06.09. 01:15, Ergebnis prüfen.)
- [ ] „SoC-Bug": Pendeln discharging/idle/charging alle paar Sekunden
      (05.09. 18:05–21:08) — Ursache noch nicht analysiert.
- [x] 06.09. Deye-Uhr: Abweichung springt zwischen 1 und 3 min (Time Syncs des
      Deye); Toleranz der Uhr-Pille auf 5 min gesetzt (`time_warn_minutes: 5` im
      Dashboard). → Zeile in der Inverter-Karte in HA ergänzen.

## 3. Zendure

- [x] 06.09. Entlade-Hysterese: Bedarfsentladen startet erst ab Minimum-SoC + 5 %
      (`startbereit` in `pv_helper_laden.yaml`, docs/logik B6). → in HA einspielen
      (Automationen neu laden).
- [x] 06.09. Zendure Minimum-SoC auf 15 % gesetzt (Daniel, nach Recherche).
- [x] 07.09. des-storage-card (v0.8.0): Slider „max. Entladen" (W) im
      Aufklappbereich, wenn `discharge_limit_entity` gesetzt; schreibt
      `input_number.pv_helper_zendure_entladeleistung_maximum`. Helfer min
      100 → 400 (Gerätegrenze), Zendure-Karte im Dashboard ergänzt. → Karten per
      HACS auf 0.8.0, Package neu einspielen + **HA-Neustart** (Helfer-Range
      ändert sich), Dashboard-Zeile ergänzen.
- [ ] Leistungen unter 400 W: Modus **Manual** mit
      `input_number.zendure_manual_power` prüfen (Laden 100–400 W, Entladen 100–400 W).
- [ ] Gielz-Automation `zendure_zensdk_gielz_global` (10-min-Takt) daraufhin
      prüfen, ob sie mit unseren Modi kollidiert (Standby = Limits 0, kein echtes Aus).

## 4. Solarman-Integration

- [ ] Profil `deye_sg04lp3.yaml` ist in v25.08.16 nicht mehr gelistet; intern
      läuft `deye_p3.yaml`. Umstellung im Konfigurationsdialog nur mit Backup und
      anschließender Entitätsprüfung (IDs dürfen sich nicht ändern).
- [ ] Abfrageintervall: „Modifikator" ganz links = 5 s bei Fetch-Dauer bis 9,5 s
      → Stick dauerbelegt, 26 Reconnects in 2 Tagen. Nach Profilwechsel Modifikator
      erhöhen.

## 5. Karten (HA-Cards)

- [x] 06.09. des-inverter-card: Export-Balken unter PV2 (v0.6.0). Wert = Summe
      der `grid_power_entities` invertiert (nur Einspeisung, < 40 W → 0 W),
      Balken relativ zu `kwp_total`. In Sections-View auf Überlauf prüfen
      (Bar-Abstand vorsorglich leicht verringert). → per HACS aktualisieren.
- [x] 06.09. Export-Farbe vereinheitlicht (v0.6.1): gemeinsamer Token
      `--des-export-color` (`src/tokens.ts`), Standard `#639922` (Olivgrün der
      Statistik-Export-Zeile), `#F29B9A` entfällt. Stats- und Inverter-Karte
      nutzen den Token; Dashboard-Chart „Einspeisung" auf `#639922` (Literal,
      Chart liest keine CSS-Variablen). → Karte per HACS aktualisieren,
      Dashboard-YAML in HA ersetzen. **Achtung:** Solar-Reihe im Chart ist
      ebenfalls `#639922` → Solar und Einspeisung jetzt gleichfarbig (Einspeisung
      liegt unter 0). Falls unerwünscht: Solar-Farbe abstimmen und ändern.
- [x] 06.09. Farbkollision aufgelöst (v0.6.2): neuer Token
      `--des-production-color` (`#2e7d32`, HA-Erfolgsgrün), Stats-Karte
      „Produktion" nutzt ihn; Dashboard-Chart „Solar" auf `#2e7d32`. Solar (grün)
      und Einspeisung (`#639922`, oliv) jetzt wieder unterscheidbar. → Karte per
      HACS aktualisieren, Dashboard-YAML in HA ersetzen (Chart zieht erst danach
      nach).
- [x] 06.09. Farb-Audit (v0.6.3): projektweit genau zwei Energie-Grüns +
      Status-Grün als Tokens (`--des-production-color` #2e7d32,
      `--des-export-color` #639922, `--des-status-ok-color` #2e7d32). Alle
      Karten (Haus/Wechselrichter/Statistik/Speicher) ziehen daraus; verstreute
      `--success-color`-Grüns entfernt. Sichtbar: Einspeisung jetzt überall oliv
      (Hauskarte Pille+Tageswert, Inverter Phasentabelle). Dashboard-Chart trug
      die Zielwerte schon. → Karten per HACS auf 0.6.3 aktualisieren.
- [x] 06.09. Farb-Audit korrigiert (v0.6.4): nur zwei Energie-Tokens —
      `--des-production-color` = `var(--success-color, #2e7d32)` (Theme-Grün),
      `--des-export-color` = `#2e7d32` (fest). `--des-status-ok-color` entfernt,
      Status wieder auf `--success-color`; `#639922` raus. Hauskarten-
      Kopfzeilenpille (Einspeisung/Netzbezug) + Option `grid_min_w` entfernt
      (Export steht auf der Inverter-Karte). Chart: Solar `var(--success-color)`,
      Einspeisung `#2e7d32`. → Karten per HACS auf 0.6.4, Dashboard-YAML in HA
      ersetzen. **Prüfen:** löst apexcharts-card `var(--success-color)` im
      Solar-Balken auf? Falls nicht, Rückmeldung — dann Hex `#2e7d32`. Am
      Dashboard-House-Card-Config ist `grid_min_w: 40` jetzt wirkungslos (wird
      ignoriert), kann bei Gelegenheit raus.
- [x] 06.09. des-house-card umgebaut (v0.7.0): Kopfzeile rechts drei Pillen
      Solar/Speicher/Netz (W, Farbquadrat, 0 W → grau), Legendenzeilen entfernt,
      Mix-Balken bleibt. Neu darunter Flächen-Chart mit Umschalter Tag/Woche/
      Monat/Jahr (eingebettete apexcharts-card): Tag = W (avg 10 min), Woche/
      Monat/Jahr = kWh (statistics change, align start). Quellen per Config mit
      Standard-Helfern. rows 6 (min 5), Dashboard-Hauskarte auf rows 6. → per
      HACS auf 0.7.0, Dashboard-YAML in HA ersetzen. **Prüfen:** Sections-View
      kein Überlauf; löst apexcharts `var(--des-production-color)` im Solar auf?
- [x] 06.09. des-chart-card (v0.7.1): gestapelte Flächen stapeln nicht. Fix:
      `stacked: true` wird top-level **und** auf `apex_config.chart` gesetzt,
      plus default `group_by.fill: last`. **Ergebnis:** hat den Kern nicht gelöst
      — Ursache ist ein **Upstream-Bug**: ApexCharts ≥ 3.44.1 (in apexcharts-card
      2.2.3, der aktuellsten Version, gebündelt) stapelt **Flächen** nicht mehr,
      **Säulen** schon (apexcharts.js#4132). Zusätzlich stapelt es mit `yaxis`
      teils nur mit `stack_group` je Reihe (apexcharts-card#827).
- [x] 06.09. des-house-card (v0.7.2): Quellen-Chart auf gestapelte **Säulen**
      umgestellt. v0.7.3: Dauer-Ladekringel behoben (ungültiges
      `apex_config.chart.type: column` entfernt; Serientyp bleibt in
      `all_series_config`). v0.7.4: Pillen-Farbquadrate immer farbig, Solar-Reihe
      auf `var(--success-color)` (Token löste im Chart nicht auf → war schwarz),
      Chart-Legende entfernt, Höhe wieder rows 4 (bündig mit den Nachbarkarten).
      v0.7.5: Chevron-Overlay repariert (overflow-Cap von ha-card auf .card),
      Pillen ohne Textlabel (nur Farbe + Wert), Perioden-Umschalter in die
      Verbrauchszeile → mehr Höhe für den Chart. v0.7.6: rows 4 blieb zu eng;
      daher eingeklappt wieder die klassische Darstellung (Kopf, Verbrauchszahl,
      Mix-Balken, Legendenzeilen Solar/Speicher/Netz), Chart + Umschalter nur im
      Aufklapp-Dropdown (+ Heute-Werte). v0.7.7: Tages-Chart auf 30-min-Raster.
      → per HACS auf 0.7.7.
- [ ] **Speicher-Füllstand** (Dashboard) bleibt bewusst Fläche — als Balken
      wertlos (Daniel). Offen: echte gestapelte Flächen nur über anderes Tool.
      Optionen: (a) `plotly-graph-card` standalone (Plotly stapelt Flächen,
      eigene Config, kein Perioden-Umschalter); (b) überlappende Flächen mit
      Summen-Helfer (`sensor.pv_helper_speicher_gespeichert_kwh` =
      Hausakkus+Zendure, hinten Gesamt, vorne Hausakkus). Entscheidung offen.
      Hinweis: ApexCharts wird kaum noch weiterentwickelt.
- [x] 07.09. des-storage-card (v0.8.1): Restzeit verschwand bei −290 W/75 %
      wiederholt für ~1 min — Ursache: Mittel-Reset bei jedem Richtungs-Pendeln
      des geteilten Akku-Sensors startete das 60-s-Warmup neu. Fix: Reset erst
      nach 30 s stabiler neuer Richtung, bis dahin letzter Wert; Debug-Attribut
      `data-eta-state`. → per HACS auf 0.8.1. Im Betrieb gegenchecken (bleibt die
      Zeit jetzt beim Pendeln stehen?).
- [ ] des-inverter-card: Uhr-Pille läuft; Zeitzonen-Unterschied Browser/HA nur
      unterwegs relevant.
- [ ] Karten-Konfiguration: Zendure-Karte und Hausakku-1-Karte zeigen auf die
      `pv_helper_*_lademodus`-Helfer (Hausakku 2 bleibt `controls: false`).
- [ ] Prompt A `des-chart-card` / Prompt B Raster (aus Teil 1) — Reste prüfen.

## 6. Repo

- [ ] Heizer-Automation „PV Solar Überschuss Aquarienheizung" als Datei nach
      `yaml/automations/` übernehmen (liegt bisher nur in der HA-UI).
- [x] 06.09. Kalibrierskript ins Repo (`yaml/scripts/`), committet.
- [ ] Dashboard-YAML in `yaml/ui/` nach jeder Kartenänderung mitziehen.
- [x] 06.09. Ausstehende Commits erledigt: pv_helper_laden, pv_helper_energiezaehler,
      pv_helper_charts, pv_helper_haus, pv_helper_hausakku, pv_helper_speicher,
      zendure_gielz1986_global, Dashboard, claude.md/todo.md, yaml/scripts — gepusht.
