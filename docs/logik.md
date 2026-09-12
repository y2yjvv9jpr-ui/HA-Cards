# docs/logik.md — Wie welche Werte berechnet werden

Stand 12.09.2026. Nummeriert, damit man sich in Prompts darauf beziehen
kann („Regel L3"). Spalte „Vorgabe Daniel" = die ursprüngliche Anforderung;
„Abweichung" = wo die Umsetzung anders ist und warum. Vorzeichen siehe
`docs/anlage.md`.

## A. Leistungen (Sekundenwerte)

| Nr | Wert | Berechnung | Datei |
| --- | --- | --- | --- |
| A1 | Überschuss (für Zendure-Laden) `pv_helper_uberschuss_leistung` | Einspeisung + Auto-Heizerleistung − Hausakku-Entnahme + Teilungsanteil = −Netz + Heizer − max(0, Akku) + Teilung (12.09.). Heizer = `pv_helper_heizer_leistung` (Summe der Aquarienheizer, deren Modus-Helfer auf 2/Auto steht). Teilung = hausakku_ladung − Ziel, wenn hausakku_ladung ≥ Stopp, sonst 0; hausakku_ladung = max(0, −Akku). Ziel/Stopp = Ladeteilung-Helfer (Auslieferung 1000/500). | pv_helper_laden |
| A2 | Zendure-Ladesollwert `pv_helper_zendure_ladeleistung_soll` | aktuelle Aufnahme + A1 − 50 W, begrenzt auf 0 … Ladeleistung-Maximum (2400). Unter 400 = Stoppzone. | pv_helper_laden |
| A3 | Zendure-Entladesollwert `pv_helper_zendure_entladeleistung_soll` | aktuelle Abgabe + Netz + Akku − 50 W, begrenzt 0 … Entladeleistung-Maximum (2400 seit 06.09., vorher 800). Hausakku-Entnahme erhöht, Hausakku-Ladung und Einspeisung senken. Unter Minimum (400) = Stoppzone. | pv_helper_laden |
| A4 | Hausakkus laden `pv_helper_hausakku_laedt` | Akku < −100 W | pv_helper_laden |
| A5 | Zendure voll `pv_helper_zendure_voll` | SoC ≥ Ladegrenze **oder** Quick Charge nimmt 2 min < 100 W an | pv_helper_laden |
| A6 | Ladestopp `pv_helper_zendure_ladestopp` | Quick Charge **und** hausakku_ladung < Stopp (500) **und** (A2 < 400 **oder** (hausakku_ladung > 100 **und** A1 < 100 W)), 30 s lang (12.09.). Solange die Hausakkus ≥ Stopp laden, bleibt der Zendure mind. auf 400 W (Hysterese Stopp/Start 500/1400), statt zu takten. | pv_helper_laden |
| A7 | Entladestopp `pv_helper_zendure_entladestopp` | Quick Discharge **und** A3 < Minimum, 30 s lang (12.09.) | pv_helper_laden |
| A8 | Speicher gesamt `pv_helper_speicher_leistung` | Akku + Zendure-Abgabe − Zendure-Aufnahme (positiv = liefert ins Haus) | pv_helper_speicher |
| A9 | Hausverbrauch `pv_helper_haus_leistung` | Deye-AC-Ausgang + Netz + Zendure-Abgabe − Zendure-Aufnahme, ≥ 0 | pv_helper_haus |
| A10 | Solar direkt `pv_helper_solar_direkt_leistung` | PV − Einspeisung − Hausakku-Ladung − Zendure-Aufnahme, ≥ 0 | pv_helper_charts |

## B. Regeln Zendure (Automationen, 30-s-Takt, nur im Lademodus **Auto**)

| Nr | Regel | Umsetzung | Vorgabe Daniel | Abweichung |
| --- | --- | --- | --- | --- |
| B1 | Laden starten | Standby **und** nicht voll (A5) **und** (A1 > 450 W **oder** hausakku_ladung > Start (1400)) → Quick Charge mit A2 (clamp 400…Maximum, Totband 20 W); auch parallel zu ladenden Hausakkus (12.09.) | „Ladung ab 1400 W Hausakku-Ladung auf beide verteilen, Ziel Hausakku ~1000 W, Zendure erst unter 500 W Hausakku-Ladung wieder aus; Zendure vor Aquarienheizern; Zendure entlädt nie in die Hausakkus; Zendure-Takt 30 s" | Schwelle 450 statt 100, Minimum 400 W (Gerätegrenze `max_charge_power` ≥ 400). |
| B2 | Laden regeln | jede 30 s Ladeleistung = A2, Totband 20 W, hoch **und** runter sofort | „Ladeleistung = Überschuss − 50 W, max. 2400" | keine |
| B3 | Laden beenden | A6 (30 s: Hausakku-Ladung < Stopp **und** (Soll < 400 **oder** Hausakkus laden ohne Einspeisung)) **oder** A5 → Standby (12.09.) | „Zendure erst unter 500 W Hausakku-Ladung wieder aus; Zendure vor Aquarienheizern; Zendure entlädt nie in die Hausakkus; Zendure-Takt 30 s" | Stoppgrenze 400 W statt 50 W (Gerätegrenze); Hysterese Stopp/Start 500/1400 |
| B4 | Entladen starten | Standby **und** SoC > Minimum-SoC **und** Hausakku-Entnahme > Entlademinimum + 50 W (aktuell 450 W) → Quick Discharge mit A3 | „Sobald > 100 W aus den Hausakkus kommen, regelt der Zendure gegen" | Start bei 450 statt 100 W, weil das Gerät nicht unter 400 W entlädt; mit 100 W Start würde er das Haus überversorgen und die Hausakkus laden. Unter 400 W nur mit Modus Manual (offen). |
| B5 | Entladen regeln | jede 30 s Entladeleistung = A3, Totband 30 W | „Delta unter 100 W drücken, Totband ±30 W" | Ziel ist Hausakku-Entnahme ≈ 50 W (Reserve), Totband 30 W |
| B6 | Entladen beenden | **sofort** (ohne Verzögerung), sobald Quick Discharge **und** hausakku_ladung > 100 W → Standby (Zendure entlädt nie in die Hausakkus, 12.09.); sonst A7 (30 s) **oder** SoC ≤ Minimum-SoC → Standby; Neustart erst ab SoC ≥ Minimum-SoC + 5 % | „Zendure entlädt nie in die Hausakkus; Zendure-Takt 30 s" | keine |
| B7 | Karten-Schalter | Laden → Quick Charge 2400 W bis Ladegrenze; Auto → Standby, dann B1–B6 | „Laden = hart laden, Auto = Regel" | keine |

## C. Regeln Hausakkus (Deye)

| Nr | Regel | Umsetzung | Vorgabe Daniel | Abweichung |
| --- | --- | --- | --- | --- |
| C1 | Laden aus PV | macht der Deye selbst (Load First); vor dem Zendure (B1 über A4) | „Hausakkus zuerst" | keine |
| C2 | Entladen | macht der Deye selbst bis Low Batt 13 %; TOU muss dafür an sein | — | Programm-SoC steht auf 15 % → faktisch 15 % Grenze; Umstellung auf 13 % offen |
| C3 | Karten-Schalter Laden | Register 127/128 = [100, Netzladestrom] und 130 = 1 (FC16, Rücklesen, 3 Versuche) → Deye lädt aus dem Netz bis 100 %; Ladeende-Automation setzt bei ≥ 100 % auf Auto | „Laden = Netzladen erzwingen (Winter, Kalibrierung)" | ungetestet (Hausakkus waren voll) |
| C4 | Karten-Schalter Auto | 130 = 0, 127 = 30 | „Auto = wie bisher, nie Netzladen" | keine |

## D. Regeln Aquarien-Heizer (UI-Automation, 30-s-Takt)

| Nr | Regel | Umsetzung | Vorgabe Daniel | Abweichung |
| --- | --- | --- | --- | --- |
| D1 | Überschuss der Heizer | Trend-Sensor + Zendure-Abgabe (Zendure-Entladung ist kein Überschuss) | — | keine |
| D2 | Einschalten | D1 < −600 W **und** `zendure_frei` (Zendure voll / lädt am Deckel / Lademodus nicht Auto / nicht erreichbar); Reihenfolge 1200 → 700 → 600 L, 10 s Abstand | „Erst Zendure, dann Aquarien" | keine |
| D3 | Ausschalten | D1 > −200 W; Reihenfolge 600 → 700 → 1200 L, 5 s Abstand | „Heizer gehen zuerst wieder aus" | keine |
| D4 | Handmodi | 1 = an, 3 = aus, jederzeit | — | keine |

## E. Energiezähler

| Nr | Wert | Berechnung | Anmerkung |
| --- | --- | --- | --- |
| E1 | Zendure Laden/Entladen gesamt | Integral (kWh) aus Aufnahme bzw. Abgabe, ab 05.09.2026 | monoton |
| E2 | Laden gesamt | Deye-Gesamtladung + E1-Laden | Sprungschutz: neuer Wert nur bei ≤ 5 kWh Abweichung vom letzten |
| E3 | Entladen gesamt | Deye-Gesamtentladung + E1-Entladen | Sprungschutz |
| E4 | Verbrauch gesamt | Integral von A9 (Hausleistung, AC-seitig inkl. Zendure), seit 10.09.2026 | Sprungschutz. Vorher Deye-Verbrauchszähler + Zendure-Korrektur — der Deye zählt Netzladen der Hausakkus als Hausverbrauch (10.09.: 17,4 statt 12,2 kWh) |
| E5 | Produktion / Import / Export gesamt | Deye-Gesamtzähler | nur Sprungschutz |
| E6 | Solar direkt gesamt | Integral von A10 | ersetzt seit 06.09. die Zählerformel (Verbrauch − Netz − Entladen), die nachts durch Verluste negativ wurde |
| E7 | Tag/Woche/Monat/Jahr | Utility-Meter auf E2–E5 | Tag zusätzlich für Laden/Entladen/Verbrauch; Produktion/Import/Export Tag direkt vom Deye |
| E8 | Kalibrierung | Woche/Monat/Jahr = aktueller Gesamtwert − Wert zu Periodenbeginn (Referenzen 05.09.2026); Verbrauch = Produktion + Import − Export + Entladen − Laden derselben Periode (seit 10.09.) | Skript; Referenzen bei Periodenwechsel nachziehen |

**Gestapelter Chart (Verbrauch nach Quelle):** Die negative Reihe (Einspeisung)
steht **zuerst** in der Reihenfolge, sonst reißt der Stapel unter 0 eine Lücke.
Alle Reihen mit `statistics.align: start`, damit die Stunden-/Tageswerte am
Balkenanfang sitzen und Reihen bündig übereinanderliegen.

## F. Bekannte Lücken

- B1/B4: 100–400 W Bereich nicht nutzbar (Gerätegrenze) — Manual-Modus prüfen.
- A1/D1: Beim Übernehmen der Auto-Heizerleistung in den Überschuss entsteht für
  höchstens einen 30-s-Takt Netzbezug, bis die Heizer-Automation die Heizer
  abschaltet (Zendure zieht die Heizerleistung, Heizer laufen noch kurz weiter).
- C2: Programm-SoC 13 % noch nicht gesetzt.
- C3: ungetestet.
- E4: erledigt 10.09. (Deye-Verbrauchszähler ersetzt durch Integral der Hausleistung).
