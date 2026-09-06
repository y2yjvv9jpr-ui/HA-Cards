# todo.md — offene Punkte (Stand 06.09.2026, 09:00)

Reihenfolge = Vorschlag. Jeder Punkt wird erst abgestimmt, dann freigegeben,
dann umgesetzt (siehe claude.md).

## 0. Gesamtlogik verständlich machen

- [ ] Nummerierte Tabelle: welcher Wert wird wie berechnet (Leistungen, Sollwerte,
      Schwellen, Zähler), gegen Daniels ursprüngliche Vorgaben; Abweichungen
      markieren; entscheiden, was bleibt, was vereinfacht wird, was raus muss.
      Entscheidung 06.09.: erst die offensichtlichen Abweichungen fixen (Punkt 1),
      Tabelle danach.

## 1. Fixes vom 06.09. — im Repo, in HA noch einzuspielen

- [x] `pv_helper_laden.yaml`: Zendure lädt nur, wenn Hausakkus nicht > 100 W
      laden (`binary_sensor.pv_helper_hausakku_laedt`); Ladestopp auch bei
      ladenden Hausakkus. → in HA einspielen, testen.
- [x] `pv_helper_energiezaehler.yaml`: Sprungschutz > 5 kWh in den `_gesamt`-Summen.
      → einspielen, danach Tageszähler kalibrieren (verbrauch 8.0, laden 1.2,
      entladen 6.6 vom 06.09.); Wochen-/Monats-/Jahreszähler mit Kalibrierskript.
- [x] `pv_helper_charts.yaml`: Solar direkt = Integration von
      max(0, PV − Einspeisung − Hausakku-Ladung − Zendure-Ladung). → Neustart,
      alte Entität `sensor.pv_helper_energie_solar_direkt` löschen, neue `_2`
      auf den alten Namen umbenennen.
- [x] `pv_helper_haus.yaml`: Haus = Deye-AC-Ausgang + Netz + Zendure-Abgabe −
      Zendure-Aufnahme (statt PV + Speicher + Netz; DC/AC-Verluste ~8 % raus).
      → Template neu laden, gegen Deye-Last prüfen.
- [ ] Kalibrierskript `script.pv_helper_energiezaehler_kalibrieren` auf die
      `_gesamt`-Quellen umstellen (Datei liegt nicht im Repo — nachreichen).
- [ ] Prüfen, ob `inverter_total_load_consumption` (Deye-Verbrauchszähler) den
      gleichen Zendure-Fehler hat wie `inverter_load_power`: Tagesverbrauch Deye
      gegen Chart-Summe (Solar + Speicher + Netz) über einen ganzen Tag.

## 2. Hausakkus (Deye)

- [ ] Karten-Schalter Laden|Auto testen (`pv_helper_hausakku.yaml`, schreibt
      Register 127/128/130 per FC16 mit Rücklesen). Erwartung: Laden → Netzladen
      binnen ~30 s, Auto → Ende.
- [ ] Programm-SoC 1–6 auf 13 % setzen (= Low-Batt-Grenze), damit nur eine
      Entladegrenze gilt. Offen: wirken Programm-Register sofort oder erst zum
      nächsten Programm-Zeitpunkt? (Test 166 = 14 lief um 01:15, Ergebnis prüfen.)
- [ ] „SoC-Bug": Pendeln discharging/idle/charging alle paar Sekunden
      (05.09. 18:05–21:08) — Ursache noch nicht analysiert.
- [ ] Deye-Uhr drifted ~2 min in 7 h trotz „Time Syncs" — beobachten; ggf.
      Automation, die bei ≥ 2 min automatisch stellt.

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
- [ ] Kalibrierskript ins Repo.
- [ ] Dashboard-YAML in `yaml/ui/` nach jeder Kartenänderung mitziehen.
