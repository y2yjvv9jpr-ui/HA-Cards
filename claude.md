# claude.md — Arbeitsregeln für dieses Repo

Gilt für Claude Code und jede andere KI, die hier arbeitet. Abweichungen nur,
wenn Daniel sie im Prompt ausdrücklich freigibt.

## Was hier liegt

| Pfad              | Inhalt                                                          | Wer deployt                              |
| ----------------- | --------------------------------------------------------------- | ---------------------------------------- |
| `src/`, `dist/`   | Lovelace-Karten (TypeScript/Lit/Vite, ein Bundle)               | HACS aus dem gepushten Repo              |
| `yaml/packages/`  | Home-Assistant-Packages `pv_helper_*.yaml` (Helfer, Automationen) | **Daniel manuell** nach `/config/packages/` |
| `yaml/automations/` | Automationen, die in HA als UI-Automation gepflegt werden     | **Daniel manuell** im Automations-Editor |
| `yaml/ui/`        | Dashboard-YAML                                                  | **Daniel manuell** im Dashboard-Editor   |
| `todo.md`         | Offene Punkte, Stand und Reihenfolge                            | —                                        |

`yaml/packages/zendure_gielz1986_global.yaml` ist Fremdcode (Gielz zenSDK) und
wird hier nur zum Nachschlagen abgelegt — **nicht ändern**.

## Arbeitsweise (verbindlich)

1. **Erst abstimmen.** Konzept in Klartext beschreiben: was sich ändert, warum,
   welche Werte. Keine fertigen Lösungen, kein YAML, kein Code vor der Freigabe.
2. **Freigabe abwarten.** Umgesetzt wird nur, was Daniel ausdrücklich
   freigegeben hat („Go", „ja los", „ok mach"). Ein Screenshot oder eine
   Beschwerde ist keine Freigabe.
3. **Umsetzung per Claude Code**, ein Auftrag = ein Thema.
4. **Änderungen an Berechnungslogik** (Überschuss, Sollwerte, Schwellen,
   Zählerformeln, Prioritäten) **nur mit expliziter Freigabe** — auch dann,
   wenn sie als Nebeneffekt eines anderen Auftrags naheliegen. Im Zweifel
   fragen, nicht mitändern.
5. **Vollständige Dateien.** Bei jeder Änderung an einer Datei die komplette
   Datei ausgeben bzw. schreiben, nie Ausschnitte. Karten-YAML immer im Format
   des Karteneditors (Karte auf oberster Ebene).
6. **Jede Änderung wird angesagt.** Wenn eine Datei im Repo geschrieben oder
   geändert wurde, steht das ausdrücklich in der Antwort: Dateiname, was sich
   geändert hat, was Daniel in HA damit tun muss (kopieren, neu laden, Neustart,
   kalibrieren). Nichts wird stillschweigend geändert.
7. **Keine unbelegten Behauptungen.** Vermutungen als Vermutung kennzeichnen.
   Was nicht getestet wurde, wird nicht als funktionierend beschrieben.
8. **Kompakt, aber verständlich.** Mechanismus und Konsequenz erklären, keine
   Aneinanderreihung von Entitätsnamen. Präzise Identifier gehören in
   CC-Prompts und Dateien, nicht in Erklärungen.

## todo.md pflegen (gehört zu jedem Auftrag)

- Jeder Auftrag endet mit einem Update der `todo.md`: erledigte Punkte
  abhaken (`[x]`) und mit Datum versehen, neue Erkenntnisse und Folgeaufgaben
  eintragen, den Stand im Kopf (Datum/Uhrzeit) aktualisieren.
- Ein erledigter Punkt, der noch in HA einzuspielen ist, bleibt sichtbar mit
  dem Vermerk „→ in HA einspielen", bis Daniel es bestätigt.
- Die `todo.md` wird im selben Commit wie die zugehörige Änderung committed.

## Commits (auch für YAML)

- **Alles wird committed und gepusht** — Karten, `yaml/**`, `claude.md`, `todo.md`.
  Dateien, die nur im Arbeitsverzeichnis liegen, gelten als nicht erledigt.
- **Getrennt:** ein Commit betrifft genau eine Karte (oder genau ein
  gemeinsames Modul wie `chevron.ts`/`overlay.ts`) bzw. genau ein Package,
  eine Automation oder das Dashboard. Keine Sammelcommits.
- Commit-Nachricht: `<karte|package|automation|dashboard|repo>: <was>` — z. B.
  `des-storage-card: Chevron unten mittig`,
  `pv_helper_laden: Zendure lädt nur ohne ladende Hausakkus`,
  `repo: claude.md/todo.md`.
- Vor jedem Karten-Commit: `npm run build`, `node --check dist/daniels-energy-cards.js`,
  `git diff dist/` zeigt nur Build-Ergebnis. Keine Konfliktmarker im Repo.
- Version-Bump (SemVer) und CHANGELOG-Eintrag gehören in denselben Commit wie die Kartenänderung.
- **Nach dem Commit pushen.** Daniel testet über HACS aus dem Remote; ohne Push kein Test.
- Wenn Dateien außerhalb von Claude Code geändert wurden (z. B. direkt im
  Chat geschrieben), holt der nächste CC-Auftrag sie mit getrennten Commits
  nach, bevor er eigene Änderungen macht.

## Konventionen Home Assistant

- Helfer: `<domain>.pv_helper_<gegenstand>_<größe>`.
- Template-Sensoren und Automationen bekommen ihre Entity-ID aus dem **Namen/Alias**:
  daher immer `PV Helper <Gegenstand> <Größe>`. Umlaute werden von HA zu u/a/o
  (`Überschuss` → `uberschuss`); Entity-IDs im Code entsprechend schreiben.
- `example:` in Skript-`fields` muss ein String sein.
- Packages haben einen Kopfkommentar: Zweck, Regeln in Klartext, Datum.
- Deye-Register werden **nur** über `solarman.write_multiple_registers`
  (Funktionscode 16) mit Rücklesen geschrieben, nie über die Solarman-Entitäten
  (Funktionscode 6 wird vom Deye für viele Register abgelehnt, die Integration
  meldet das nicht). Registerliste in `yaml/packages/pv_helper_hausakku.yaml`.
- Time Of Use am Deye bleibt dauerhaft „Week" (Register 146 = 255); ohne TOU
  entlädt der Deye nicht ins Haus.

## Fachliche Vorgaben (Daniel, verbindlich)

- Ladepriorität: Hausakkus → Zendure → Aquarien-Heizer. Zendure lädt nicht,
  solange die Hausakkus laden.
- Entladepriorität: Zendure vor Hausakkus; Ziel Hausakku-Entnahme ≤ 50 W.
- Netzladen nie automatisch; nur über den Karten-Schalter „Laden" der Hausakkus.
- Karten-Schalter Laden|Auto ist der einzige Schalter für den jeweiligen Speicher.
- Statistiken (Laden/Entladen/Verbrauch) umfassen Hausakkus **und** Zendure.
- Hausverbrauch = Deye-AC-Ausgang + Netz + Zendure-Abgabe − Zendure-Aufnahme.
