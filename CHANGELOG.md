# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format grob nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

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
