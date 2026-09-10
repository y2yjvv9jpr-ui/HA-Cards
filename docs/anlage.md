# docs/anlage.md — Anlage, Entitäten, Geräteverhalten

Wissensstand 06.09.2026. Alles hier wurde beobachtet oder aus Profildateien
abgeleitet; Vermutungen sind als solche markiert.

## Anlage

| Komponente | Daten |
| --- | --- |
| Wechselrichter | Deye SUN-12K-SG04LP3 (3-phasig, LV), 15,8 kWp in 2 Strings (PV1 7,9 / PV2 7,9 kWp) |
| Hausakkus | 2 × 6,55 kWh (120 Ah, Pylontech-Protokoll) am Deye, Batterie-Modus „Capacity" (SoC-gesteuert) |
| Zusatzspeicher | Zendure SolarFlow 2400 AC+, 2,4 kWh, AC-gekoppelt im Haus (hinter dem Deye, einphasig) |
| Wärmespeicher | 3 Aquarien-Heizstäbe (Shelly) — 1200 L / 700 L / 600 L, je ~300–400 W |
| Integrationen | Deye: Solarman Stick Logger (davidrapan, v25.08.16, Profil intern `deye_p3.yaml`); Zendure: zenSDK/Gielz-Package (REST, lokal) |
| HA-Geräte-ID Deye | `5dc4516c56e7d29d70d39106cd746594` (für `solarman.write_multiple_registers`) |

## Deye — feste Einstellungen

- Work Mode: **Zero Export To CT**, Energy Pattern: **Load First**, Solar Sell an, Max Sell 12 kW, Zero-Export-Power 20 W.
- **Time Of Use: dauerhaft „Week"** (Register 146 = 255). Ohne TOU entlädt dieser Deye nicht ins Haus (06.09. bestätigt: TOU aus → idle bei 1,3 kW Last).
- TOU-Programme 1–6 (01/05/09/13/17/21 Uhr): Charging Disabled, SoC 15 %, Power 12 kW. Ziel: SoC auf 13 % (= Low Batt), damit nur eine Entladegrenze gilt — offen.
- Low Batt 13 %, Shutdown 10 %, Restart 50 %. Grid Charge aus, Start-SoC 30 %, 40 A. Gen Charge aus.
- Basic Setting „Lock out all changes" muss **aus** sein (war an → alle Änderungen per Modbus und Display abgelehnt).
- Uhr: „Time Syncs" an, drifted trotzdem (~2 min in 7 h). Karte zeigt Abweichung und kann sie setzen.

## Deye — Vorzeichen und Messwerte

| Sensor | Bedeutung |
| --- | --- |
| `sensor.inverter_external_power` | Netz gesamt: **positiv = Bezug, negativ = Einspeisung** |
| `sensor.inverter_battery_power` | Hausakkus: **positiv = Entladen, negativ = Laden** |
| `sensor.inverter_pv_power` | PV-Leistung **DC** (vor Wandlungsverlusten, ~8 %) |
| `sensor.inverter_power` | AC-Ausgang des Deye (gemessen, nach Verlusten; nachts ≈ −80 W Eigenverbrauch) |
| `sensor.inverter_load_power` | Deye-eigene Lastrechnung — **falsch, sobald der Zendure einspeist** (sieht ihn nicht als Quelle) |
| `sensor.inverter_battery` | SoC gesamt; `_battery_1`/`_2` je Pack |
| `sensor.inverterexcesspowertrend` | geglätteter Netzwert für die Heizer-Automation, **negativ = Überschuss** |
| `sensor.inverter_total_*` | Gesamtzähler kWh (0,1-Schritte). Liefern bei Stick-Aussetzern gelegentlich falsche Werte → Sprungschutz in `pv_helper_energiezaehler.yaml` |

## Deye — Register (deye_p3.yaml), schreibbar per FC16

| Register | Inhalt |
| --- | --- |
| 117 (0x75) | Battery Low SOC |
| 127 (0x7F) | Grid Charging Start SoC % |
| 128 (0x80) | Grid Charging Current A |
| 130 (0x82) | Grid Charging Schalter (0/1) |
| 146 (0x92) | Time Of Use: Bit 0 an, Bits 1–7 Mo–So; 255 = Week |
| 148–153 | Programm-Zeiten 1–6 |
| 166–171 (0xA6–0xAB) | Programm-SoC 1–6 |
| 172–177 (0xAC–0xB1) | Programm-Charging 1–6 (0 Disabled, 1 Grid) |
| 62–63 (0x3E–0x40) | Datum/Uhrzeit (per `datetime.set_value` schreibbar) |

**Schreibweg:** Entitäts-Writes der Integration (Funktionscode 6) werden vom
Deye bei vielen Registern mit „Illegal Data Address" abgelehnt, die Integration
zeigt das nicht (Wert springt still zurück). `solarman.write_multiple_registers`
(Funktionscode 16) wird angenommen. Änderungen an TOU-Registern wirkten teils
verzögert (Vermutung: erst zum nächsten Programm-Zeitpunkt). Deshalb: immer
FC16 + Rücklesen + Wiederholung (Skript `pv_helper_deye_register_schreiben`).

## Solarman-Integration

- Abfrage alle 5 s („Modifikator" ganz links), Fetch dauert 0,4–9,5 s → Stick
  dauerbelegt, 26 Reconnects in 2 Tagen (05./06.09.). Intervall erhöhen ist
  offen; der Konfigurationsdialog verlangt dafür einen Profilwechsel
  (`deye_sg04lp3.yaml` ist nicht mehr gelistet, `deye_p3.yaml` ist der Nachfolger).
- Lesen ist zuverlässig; Schreiben nur per Aktion (siehe oben).

## Zendure SolarFlow 2400 AC+ (zenSDK/Gielz)

- Steuerung: `input_select.zendure_operation_mode` (Standby, Manual, Smart Matching, …,
  Quick Charge, Quick Discharge). Wir nutzen nur **Standby, Quick Charge, Quick Discharge**;
  Smart Matching (Gielz-Regelung) wird nicht mehr benutzt.
- Leistung: `input_number.zendure_setting_max_charge_power` / `_max_discharge_power`
  — **Minimum 400 W** (Helfer-Range). Quick Charge/Discharge folgen diesen Werten
  (bestätigt). Unter 400 W ginge nur Modus Manual mit `input_number.zendure_manual_power` (offen).
- SoC-Grenzen: `input_number.zendure_setting_maximum_allowed_state_of_charge` (Ladegrenze,
  gilt in **allen** Modi; Hysterese ≥ 2 % zum Wiederanlauf) und
  `..._minimum_allowed_state_of_charge` (aktuell 20 %, war 30 %).
- **Gielz-SoC-Schutz** (`input_boolean.zendure_setting_soc_protection_disabled` = off → aktiv):
  fällt der SoC unter das Minimum, lädt das Paket mit 400 W aus dem Netz nach — auch im
  Standby. Minimum nie über den aktuellen SoC ziehen. Automation `zendure_zensdk_gielz_global`
  läuft alle 10 min.
- Gielz „Standby" = Limits 0 W, kein echtes Aus.
- Messwerte: `sensor.zendure_power_from_home` (Aufnahme W), `sensor.zendure_power_to_home`
  (Abgabe W), `sensor.zendure_power` (signiert, + = Laden), `sensor.zendure_total_state_of_charge`,
  `sensor.zendure_set_charge_power` / `_set_discharge_power` (tatsächliche Gerätelimits),
  `sensor.zendure_relay_mode` (Oplaadstand = Lade-, Ontlaadstand = Entladestellung).
- Wirkungsgrad: keine veröffentlichte Kurve; Messungen ~86–88 % Round-Trip bei 800 W,
  kein Sweet Spot über ~200 W erkennbar. Unter ~100 W dominiert der Eigenverbrauch.

## Aquarien-Heizer

| Aquarium | Schalter | Leistung | Modus-Helfer |
| --- | --- | --- | --- |
| 1200 L | `switch.aquariumsolarheizer1_switch_0` | `sensor.aquariumsolarheizer1_switch_0_power` | `input_number.aq_zusatzheizer_mode_1000l` |
| 700 L | `switch.aquariumsolarheizer2_switch_0` | `sensor.aquariumsolarheizer2_switch_0_power` | `input_number.aq_zusatzheizer_mode_700l` |
| 600 L | `switch.aquarienheizer600l` | `sensor.aquarienheizer600l_leistung` | `input_number.aq_zusatzheizer_mode_600l` |

Modus-Helfer: 1 = An, 2 = Auto, 3 = Aus. Automation „PV Solar Überschuss
Aquarienheizung" (UI-Automation, 30-s-Takt): Ein ab −600 W, Aus ab −200 W am
Trend-Sensor, bereinigt um die Zendure-Abgabe; Einschalten nur, wenn der Zendure
voll ist / am Deckel lädt / nicht im Auto-Modus ist (`zendure_frei`).

## Luftentfeuchter Arbeitszimmer (Arete Two 25 L, Tuya)

Steht auf der Dashboard-Seite „Haus“ (`des-dehumidifier-card`). Anbindung über
die Tuya-Integration; Präfix aller Entitäten:
`…arete_r_two_25l_dehumidifier_air_purifier…`.

| Zweck | Entität |
| --- | --- |
| Ist-Luftfeuchte (%) | `sensor.arete_r_two_25l_dehumidifier_air_purifier_luftfeuchtigkeit` |
| Ziel + Schreiben | `humidifier.arete_r_two_25l_dehumidifier_air_purifier` (Ziel = Attribut `humidity`, `humidifier.set_humidity`) |
| Ein/Aus | `fan.arete_r_two_25l_dehumidifier_air_purifier` (`fan.turn_on`/`turn_off`) |
| Max-Trocknen | `select.arete_r_two_25l_dehumidifier_air_purifier_countdown` (Optionen aus der Entität, „Abbrechen“ = aus) |
| Kindersicherung | `switch.arete_r_two_25l_dehumidifier_air_purifier_kindersicherung` |
| Störung Tank voll (error) | `binary_sensor.arete_r_two_25l_dehumidifier_air_purifier_tank_voll` |
| Störung Nass (error) | `binary_sensor.arete_r_two_25l_dehumidifier_air_purifier_nass` |
| Störung Temperaturfehler (error) | `binary_sensor.arete_r_two_25l_dehumidifier_air_purifier_temperaturfehler` |
| Abtauen (warning) | `binary_sensor.arete_r_two_25l_dehumidifier_air_purifier_abtauen` |

- Tuya erlaubt die Zielfeuchte **30–80 % in 5er-Schritten**.
- **Tuya liefert keine Rest-Zeit des Countdowns**, nur die gewählte Stufe
  (`select`). Deshalb zeigt die Karte den Countdown als gewählte Option, nicht als
  ablaufende Zeit.

## Rollläden

Stehen auf der Dashboard-Seite „Haus" (`des-cover-card`). Positionen sind die
rohe HA-Position (`current_position`, 100 = ganz offen, 0 = zu). Steuerung über
`cover.open_cover`/`close_cover`/`stop_cover` und `cover.set_cover_position`.

- **Gruppe:** `cover.rollladen` (Gruppenzeile „Haus").

**Erdgeschoss**

| Raum | Entität |
| --- | --- |
| Flur | `cover.jalousie_eg_flur_jalousie_eg_flur` |
| Arbeitszimmer vorne | `cover.jalousie_eg_arbeitszimmer_vorn_2` |
| Arbeitszimmer Seite | `cover.jalousie_eg_arbeitszimmer_seite` |
| Couch klein | `cover.jalousie_eg_couch_klein` |
| Couch groß | `cover.jalousie_eg_couch_gross_2` |
| Esszimmer | `cover.shelly2pmg4_48f6eed04f08_jalousie_eg_esszimmer` |
| Küche | `cover.shellyswitch25_e8db84aa7195` |
| Technikraum | `cover.jalousie_eg_technikraum_jalousie_eg_technikraum` |
| Gäste-WC | `cover.jalousie_eg_wc_jalousie_eg_wc` |

**Obergeschoss**

| Raum | Entität |
| --- | --- |
| Bad | `cover.jalousie_og_bad` |
| Ankleide | `cover.jalousie_og_ankleide` |
| Schlafzimmer | `cover.jalousie_og_schlafzimmer_2` |
| Kinderzimmer Marie | `cover.jalousie_og_marie_jalousie_og_marie` |
| Anekas Zimmer | `cover.jalousie_og_aneka_jalousie_og_aneka` |

**Szenen-Kacheln** (die Karte ruft den jeweiligen Dienst auf):

| Kachel | Aktion |
| --- | --- |
| Tag | `script.turn_on` → `script.guten_morgen` |
| Nacht | `script.turn_on` → `script.gute_nacht` |
| Vormittag | `input_boolean.turn_on` → `input_boolean.helperrssunvormittag` |
| Nachmittag | `input_boolean.turn_on` → `input_boolean.helperrssunnachmittag` |
| Aquarien | `automation.trigger` → `automation.aquarium_arbeitszimmer_sonnenschutz` (mit `skip_condition: true`) |

- **Aquarien-Sonnenschutz:** die Automation `automation.aquarium_arbeitszimmer_sonnenschutz`
  fährt im Tageslauf um **09:00** die Rollläden **Arbeitszimmer vorne + Seite auf
  40 %** (Sonnenschutz fürs Aquarium). Die Kachel „Aquarien" löst sie außerhalb der
  Zeit per `automation.trigger` mit `skip_condition: true` aus (Bedingungen
  übersprungen), sodass sie sofort läuft.

## Eigene Helfer (Packages)

| Package | Enthält |
| --- | --- |
| `pv_helper_laden.yaml` | Zendure-Lademodus (Laden/Auto), Überschuss- und Sollwert-Sensoren, Voll/Ladestopp/Entladestopp/Hausakku-lädt, Automationen Lademodus / Überschussladen / Bedarfsentladen |
| `pv_helper_hausakku.yaml` | Hausakku-Lademodus (Laden/Auto), Netzladestrom, Skript Register schreiben, Automationen Lademodus / Ladeende |
| `pv_helper_energiezaehler.yaml` | Zendure-Integrale, geschützte `_gesamt`-Summen, Utility-Meter Tag/Woche/Monat/Jahr |
| `pv_helper_charts.yaml` | Solar-direkt-Leistung und deren Integral |
| `pv_helper_haus.yaml` | Hausverbrauch-Leistung |
| `pv_helper_speicher.yaml` | Speicherleistung gesamt (signiert) |
| `yaml/scripts/pv_helper_energiezaehler_kalibrieren.yaml` | Kalibrierung Woche/Monat/Jahr |

Die Berechnungsregeln stehen in `docs/logik.md`.
