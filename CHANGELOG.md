# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format grob nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.2.3]

### Geändert

- **des-storage-card (thermal_group):** Der Status-Punkt vor dem Item-Namen ist
  um 1 px angehoben, damit er optisch mittig zur Textzeile sitzt. Punkt und
  Name liegen weiterhin in einem Flex-Container mit `align-items: center`;
  umgesetzt als `transform`, damit Zeilenhöhe und Flex-Layout unberührt
  bleiben.

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
