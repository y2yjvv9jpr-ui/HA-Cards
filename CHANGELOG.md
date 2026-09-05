# Changelog

Alle nennenswerten Änderungen an diesem Projekt werden hier festgehalten.
Format grob nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [SemVer](https://semver.org/lang/de/).

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
