# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format grob nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

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
