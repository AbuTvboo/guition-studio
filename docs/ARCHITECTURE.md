# Architektur & Entscheidungen

```
┌────────────── Home Assistant ──────────────┐        ┌──── Guition ESP32-S3-4848S040 ────┐
│ Panel (Lit/TS)  ⇄ WebSocket guition_studio/* │        │ ESPHome 2026.10 + LVGL 9.6          │
│ manager.py: Transfer, ACK, Retry, Zustände   │ ─API─▶ │ guition_studio: JSON → LVGL zur      │
│ layout.py: Validierung, Compiler             │ ◀─Evt─ │ Laufzeit, NVS mit Rollback, Touch    │
│ firmware.py: Release-Download, OTA, Manifest │ ─HTTP▶ │ http_request-OTA (nur über API)      │
│ store.py: .storage/guition_studio.data       │        │ mipi_rgb GUITION-4848S040, GT911     │
└──────────────────────────────────────────────┘        └─────────────────────────────────────┘
```

## Trennung HACS ↔ Firmware

HACS installiert nur die Integration samt fertig gebautem Editor (`www/`). Die Firmware wird **nicht** in Home Assistant kompiliert. Sie kommt als geprüftes GitHub-Release (`firmware.factory.bin`, `firmware.ota.bin`, `SHA256SUMS`, gebaut von `.github/workflows/release.yml`) oder als lokaler Build. Für die Grundinstallation sind weder ESPHome-Dashboard noch Compiler nötig.

## Drag-and-Drop: warum keine Fremdbibliothek?

Evaluiert wurden gridstack.js, interact.js und SortableJS:

- Das HA-Panel läuft in verschachteltem Shadow DOM. gridstack nutzt dokumentweite Selektoren für Drag-in und hat dort bekannte Probleme. Mit `embed_iframe` würde das funktionieren, aber in einem iframe ohne `allow="serial"` ist **Web Serial blockiert**, und damit die USB-Installation.
- Benötigt werden Gruppen-Drag mehrerer Kacheln, Verschieben zwischen mehreren Rastern, Drop aus der Bibliothek, Tastaturbedienung und ein Raster, das mit der Firmware identisch rechnet. Diese Kombination bietet keine der Bibliotheken.

Deshalb gibt es eine kleine eigene Engine auf Basis von **Pointer Events** (Maus, Stift und Touch in einem Modell, `touch-action: none`). Die Rasterlogik ist rein funktional in `model.ts` und mit Vitest getestet. Sortieren der Seiten: natives HTML5-Drag plus ↑/↓-Schaltflächen für Tastatur und Touch.

## Sicherheit

- Panel und WebSocket-Befehle nur für Admins (`require_admin`)
- Keine Tokens oder Zugangsdaten in der Firmware; API-Schlüssel per HA-Provisionierung
- Kein AP, kein Captive Portal, kein offener OTA-Port; OTA nur per verschlüsselter API-Aktion mit MD5
- Layoutdaten sind reine Darstellungsdaten. Aktionen werden in HA aus dem bestätigten Layout aufgelöst. Dienstaufrufe kann nur ein Admin im Editor festlegen.
- Validierung doppelt: in HA (`layout.py`) und auf dem Gerät (`parse_layout_`), mit Größenlimits für Payload, Strings, Seiten, Raster und Kacheln
- Firmware-Downloads werden per SHA-256 geprüft und atomar abgelegt. Der Download-Endpunkt liefert per Whitelist nur zwei Dateinamen und Versionsordner.
- Backups enthalten keine Geheimnisse

## Automatisierung

- **Regeln und Nachtmodus** wertet `manager.py` aus. Die Logik liegt in `automation.py` (ohne HA-Abhängigkeit, getestet): eine minütliche Prüfung für Zeitregeln und das Nachtfenster, Zustandsabos für Regel-Entitäten (nur beim Wechsel in den Zustand). Die Regeln gelten für das *bestätigte* Layout, also für das, was das Display tatsächlich zeigt.
- **Nachtmodus auf dem Gerät:** `gs_mode(night, brightness, dim)`. Das Display begrenzt die Hintergrundbeleuchtung und legt eine nicht klickbare schwarze Folie auf `lv_layer_top()`.
- **Bildschirmschoner** läuft vollständig auf dem Gerät (Inaktivitätszeit von LVGL); die angezeigten Werte kommen über die normalen Zustands-Pushes.
- **Graph:** Recorder-Historie → Stufenfunktion mit 48 Punkten → auf 0–100 skaliert → `g`/`gr` im Zustandsprotokoll. Auf dem Gerät als Säulen aus einfachen `lv_obj`, ohne Abhängigkeit vom LVGL-Chart.
- **Entitäten:** `update`/`notify` pro Display (`entity.py`). Sie werden über den Dispatcher `guition_studio_displays_changed` dynamisch angelegt und entfernt und über die MAC-Adresse an das ESPHome-Gerät gehängt.

## Grenzen von v0.3

| Thema | Status |
|---|---|
| Kamera-Kachel | bewusst nicht umgesetzt (Videostream über die ESPHome-API auf einem ESP32-Panel nicht sinnvoll) |
| Graph | Säulendarstellung mit 48 Punkten; keine Achsenbeschriftung |
| Nachtmodus | Theme bleibt gleich (Abdunklung statt Farbwechsel); ein Theme-Wechsel bräuchte eine erneute Übertragung |
| Icons auf dem Gerät | 134 MDI-Icons (kuratierte Auswahl, erweiterbar über `scripts/icons.json` + `gen-icons.mjs`, Flash-Bedarf ca. 120 KB) |
| Rollladen-Position per Schieberegler | ▲ ■ ▼ vorhanden; ein Positionsregler ist im Protokoll vorbereitet (`set` + `n`), aber noch nicht umgesetzt |
| Bildschirmrotation, Touch-Empfindlichkeit | erfordern eigenen Build; in den Einstellungen gesperrt |
| Bildschirmschoner / Nachtmodus | Dimmen und Rückkehr zur Startseite vorhanden; Nachtmodus per Automation (`show_page`, Theme-Wechsel) |
| Gruppen-Drag | innerhalb und zwischen Seiten; Ausrichten/Verteilen noch nicht |
| Oberflächensprache | Deutsch; Texte zentral in den Views, i18n-Extraktion geplant |
| Weitere Displays | `HARDWARE_PROFILES` und `hardware` in Firmware und Protokoll vorbereitet |

## Roadmap

- **Phase 2 (0.2, erledigt):** Dimmer-, Thermostat-, Rollladen-, Medien- und Wetter-Kacheln, MDI-Iconfont
- **Phase 3 (0.3, erledigt):** Seitenwechsel-Regeln, Nachtmodus, Bildschirmschoner, Graph, RGB, Update-/Notify-Entitäten, Heartbeat
- **Danach:** weitere Hardwareprofile (z. B. andere Guition-Größen), Übersetzungen der Oberfläche, Theme-Zeitpläne, Rollladen-Positionsregler
