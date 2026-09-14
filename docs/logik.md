# docs/logik.md — Wie welche Werte berechnet werden

Stand 14.09.2026. Nummeriert, damit man sich in Prompts darauf beziehen
kann („Regel L3"). Spalte „Vorgabe Daniel" = die ursprüngliche Anforderung;
„Abweichung" = wo die Umsetzung anders ist und warum. Vorzeichen siehe
`docs/anlage.md`.

## A. Leistungen (Sekundenwerte)

| Nr | Wert | Berechnung | Datei |
| --- | --- | --- | --- |
| A1 | Überschuss Ü_L `pv_helper_uberschuss_leistung` | PV − Hausverbrauch = `sensor.inverter_pv_power` − A9 (v4, 14.09.). Das ist, was gerade gespeichert werden kann — unabhängig davon, wer es nimmt. Nur aus PV und Hausverbrauch, keine Ladeleistung/Einspeisung/Heizer. | pv_helper_laden |
| A2 | Zendure-Ladesollwert Ü_Z `pv_helper_zendure_ladeleistung_soll` | voll ? Ü_L − 50 : (Ü_L − Vorzug) / 2 (v4, 14.09.), Sensor begrenzt 0 … Ladeleistung-Maximum (2400); Werte < 400 = Stoppzone. **voll** = hausakku_soc ≥ voll_soc (SoC unavailable → nicht voll). Unter voll_soc haben die Hausakkus den Vorzug (1000 W), darüber teilt sich Ü_L halbe-halbe; ab voll_soc gehen die Hausakkus als voll durch und der Zendure nimmt alles (− 50 W Reserve). hausakku_soc = `sensor.inverter_battery` (nur Umschalter — der Sensor hängt NICHT an dessen Verfügbarkeit); Vorzug = `input_number.pv_helper_ladeteilung_ziel` (1000); voll_soc = `input_number.pv_helper_hausakku_voll_soc` (90). Beispiele: PV 3000/Haus 500 → Ü_L 2500 → Ü_Z 750 (Hausakku 1750); ab SoC 90 % → Ü_Z 2450→Clamp 2400. Der ans Gerät geschriebene Wert wird in B2 auf 400 … Maximum geklemmt. | pv_helper_laden |
| A3 | Zendure-Entladesollwert `pv_helper_zendure_entladeleistung_soll` | aktuelle Abgabe + Netz + Akku − 50 W, begrenzt 0 … Entladeleistung-Maximum (2400 seit 06.09., vorher 800). Hausakku-Entnahme erhöht, Hausakku-Ladung und Einspeisung senken. Unter Minimum (400) = Stoppzone. | pv_helper_laden |
| A4 | Hausakkus laden `pv_helper_hausakku_laedt` | Akku < −100 W | pv_helper_laden |
| A5 | Zendure voll `pv_helper_zendure_voll` | SoC ≥ Ladegrenze **oder** Quick Charge nimmt 2 min < 100 W an | pv_helper_laden |
| A6 | Ladestopp `pv_helper_zendure_ladestopp` | Quick Charge **und** Ü_L < Stopp (800), 30 s lang (v4, 14.09.). | pv_helper_laden |
| A7 | Entladestopp `pv_helper_zendure_entladestopp` | Quick Discharge **und** A3 < Minimum, 30 s lang (12.09.) | pv_helper_laden |
| A8 | Speicher gesamt `pv_helper_speicher_leistung` | Akku + Zendure-Abgabe − Zendure-Aufnahme (positiv = liefert ins Haus) | pv_helper_speicher |
| A9 | Hausverbrauch `pv_helper_haus_leistung` | Deye-AC-Ausgang + Netz + Zendure-Abgabe − Zendure-Aufnahme, ≥ 0 | pv_helper_haus |
| A10 | Solar direkt `pv_helper_solar_direkt_leistung` | PV − Einspeisung − Hausakku-Ladung − Zendure-Aufnahme, ≥ 0 | pv_helper_charts |

## B. Regeln Zendure (Automationen, 30-s-Takt, nur im Lademodus **Auto**)

| Nr | Regel | Umsetzung | Vorgabe Daniel | Abweichung |
| --- | --- | --- | --- | --- |
| B1 | Laden starten | Standby **und** nicht voll (A5) **und** Ü_L > Start (1400) → Quick Charge mit clamp(A2, 400, Maximum), Totband 20 W (v4, 14.09.) | „Regelung nur aus PV und Hausverbrauch; 1000 W Vorzug Hausakkus, darüber halbe-halbe; ab 90 % Hausakku-SoC alles in den Zendure; Start 1400 / Stopp 800 auf Ü_L." | Start am Überschuss Ü_L (1400); Minimum 400 W (Gerätegrenze `max_charge_power` ≥ 400). |
| B2 | Laden regeln | jede 30 s Ladeleistung = clamp(A2, 400, Maximum), Totband 20 W, hoch **und** runter sofort. | (wie B1) | keine |
| B3 | Laden beenden | A6 (30 s: Ü_L < Stopp (800)) **oder** A5 → Standby (v4, 14.09.) | (wie B1) | Stopp am Überschuss Ü_L (< 800); Hysterese Stopp/Start 800/1400 auf Ü_L. |
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

## F. Bekannte Lücken / Erkenntnisse

- **14.09. (v4): Ladeleistungen taugen nicht als Regelgröße.** v1–v3.1
  scheiterten, weil sie Ladeleistungen (Hausakku-Ladung, Zendure-Aufnahme,
  Einspeisung) in die Regel nahmen — die hängen über den Deye vom eigenen
  Sollwert ab (Bilanz Ü_L − L = Z + E + V, wobei die verzögerte Nachführung des
  Deye die Werte kurzzeitig doppelt zählt) und trieben die Regel gegen Min/Max
  (Überschwingen ~1.750 W, festgeklemmter Soll 2.200–2.400, Oszillation).
  **Lösung v4:** Regelgrößen sind nur PV und Hausverbrauch (Ü_L = PV − Haus,
  A1); daraus Ü_Z (A2) mit Hausakku-Vorzug bzw. — ab voll_soc — allem für den
  Zendure. Der SoC ist nur Umschalter.
- **14.09. (v4): Pendeln möglich zwischen voll_soc (90 %) und dem Deye-Abregeln.**
  Ab voll_soc gilt der Hausakku als voll und Ü_Z springt auf Ü_L − 50, obwohl
  der Deye die Hausakku-Ladung erst kurz vor 100 % zurücknimmt. Beobachten;
  ggf. voll_soc anheben oder Hysterese ergänzen.
- B1/B4: 100–400 W Bereich nicht nutzbar (Gerätegrenze) — Manual-Modus prüfen.
- v4: Der Heizer-Term ist aus dem Überschuss entfernt (`pv_helper_heizer_leistung`
  gelöscht). Die Heizer-Priorität liegt weiter allein in der Heizer-Automation
  (D2, Bedingung `zendure_frei`); PV − Haus (A1) bildet die Heizerlast ab, sobald
  sie läuft.
- C2: Programm-SoC 13 % noch nicht gesetzt.
- C3: ungetestet.
- E4: erledigt 10.09. (Deye-Verbrauchszähler ersetzt durch Integral der Hausleistung).
