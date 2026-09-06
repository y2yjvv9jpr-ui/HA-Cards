# todo.md — offene Punkte (Stand 06.09.2026, 18:30)

Reihenfolge = Vorschlag. Jeder Punkt wird erst abgestimmt, dann freigegeben,
dann umgesetzt (siehe claude.md).

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
- [ ] Tageszähler 06.09. kalibrieren: verbrauch 18.5 / laden 12.5 / entladen 14.9
      (Offsets des Sprungs 7,5 / 3,6 / 8,1 abgezogen; ab 07.09. 00:00 exakt).
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

- [ ] Entlade-Hysterese: Bedarfsentladen erst ab Minimum-SoC + 5 % starten
      (sonst Pingpong mit der Gielz-Schutzladung).
- [ ] Minimum-SoC zurück auf 30 % (aktuell 20 %) — Daniels Entscheidung.
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
      umgestellt (type column, `stack_group: quellen`, `group_by.fill: last`) —
      stapelt zuverlässig. → per HACS auf 0.7.2.
- [ ] **Speicher-Füllstand** (Dashboard) bleibt bewusst Fläche — als Balken
      wertlos (Daniel). Offen: echte gestapelte Flächen nur über anderes Tool.
      Optionen: (a) `plotly-graph-card` standalone (Plotly stapelt Flächen,
      eigene Config, kein Perioden-Umschalter); (b) überlappende Flächen mit
      Summen-Helfer (`sensor.pv_helper_speicher_gespeichert_kwh` =
      Hausakkus+Zendure, hinten Gesamt, vorne Hausakkus). Entscheidung offen.
      Hinweis: ApexCharts wird kaum noch weiterentwickelt.
- [ ] des-storage-card: geschätzte Restzeit der Hausakkus im Betrieb prüfen
      (Glättung, „< 10 min"/„> 48 h").
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
