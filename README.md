# Guition Studio

[![Buy me a coffee via PayPal](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-00457C?logo=paypal&logoColor=white)](https://paypal.me/sebagueven)

**Visueller Display-Designer und Geräteverwaltung für das Guition ESP32-S3-4848S040 – direkt in Home Assistant.**

Firmware einmal installieren → Seiten per Drag-and-Drop gestalten → „Auf Display übertragen“ → das neue Layout erscheint sofort auf dem Display. Ein erneutes Flashen ist nicht nötig, YAML musst du nicht anfassen.

| Komponente | Technik | Ordner |
|---|---|---|
| Home-Assistant-Integration (HACS) | Python, Config Flow, WebSocket-API, Storage | `custom_components/guition_studio/` |
| Visueller Editor (Seitenleisten-Panel) | TypeScript, Lit 3, eigene Pointer-Events-Drag-and-Drop-Engine | `frontend/` → gebaut nach `custom_components/guition_studio/www/` |
| Gerätefirmware | ESPHome 2026.10.1, ESP-IDF 5.5, LVGL 9.6, eigene Runtime-Komponente | `firmware/` |
| Flash/OTA | ESP Web Tools (USB, Web Serial), HTTP-OTA über die verschlüsselte API | `firmware.py`, `views/installer.ts` |
| Tests | pytest (Unit + HA-Integration), Vitest, ESPHome-Build | `tests/`, `frontend/test/` |

## Funktionsumfang

- Neu in 0.3: Seitenwechsel-Regeln, Nachtmodus, Bildschirmschoner, Verlaufsgraph, RGB-Kachel sowie Update- und Notify-Entitäten pro Display
- Neu in 0.2: Dimmer-, Rollladen-, Thermostat-, Mediaplayer- und Wetter-Kacheln sowie 134 Material Design Icons

Details stehen im [CHANGELOG](CHANGELOG.md).


- Installation über HACS, Einrichtung über einen grafischen Config Flow, Menüpunkt **„Guition Studio“** in der Seitenleiste (nur für Admins)
- Bereiche: Übersicht · Meine Displays · Display-Designer · Firmware-Manager · Vorlagen · Einstellungen · Diagnose & Protokolle
- Einrichtungsassistent in 5 Schritten: USB-Installation per Web Serial (ESP Web Tools), Chip-Prüfung, WLAN-Einrichtung per Improv, Kopplung mit HA, Startlayout
- Designer: alle Seiten nebeneinander im Maßstab 1:1 (480 × 480 px), Zoom, Raster und Drop-Zonen, Kollisionserkennung, Einrasten, Mehrfachauswahl, Verschieben zwischen Seiten, Größe ziehen, Undo/Redo, automatisches Speichern als Entwurf, vollständige Tastaturbedienung, Touch-Bedienung
- Elementbibliothek mit Suche nach Name, Entity-ID, Gerät, Bereich und Domain, mit 13 Kategorien und Favoriten
- Eigenschaftsleiste: Titel, Entität, Icon, Farben, Zustandsfarben, Schriftgröße, Radius, Rahmen, Deckkraft, Größe/Position, Tippen- und Lange-Tippen-Aktion, Sichtbarkeitsbedingungen
- Kacheltypen in der Firmware: Licht, Licht mit Helligkeitsregler, Schalter, Sensorwert, Uhrzeit, Navigation, Text, Aktion (Szene/Skript/Taste), WLAN-/HA-Status, Rollladen, Thermostat, Mediaplayer, Wetter
- 134 Material Design Icons auf dem Display, Icon-Auswahl mit Suche im Editor
- Navigation: Seitenpunkte, Wischen, Zurück, Startseite, „gehe zu Seite“, automatische Rückkehr zur Startseite
- Echte Synchronisation: versioniertes JSON-Layout, Übertragung in Paketen mit CRC32, Bestätigung durch das Gerät, 3 Wiederholversuche, atomare Speicherung im Flash mit Rollback, Wiederherstellung nach Neustart
- Live-Zustände per Push (kein Polling). Ein Tippen auf dem Display löst die in HA hinterlegte Aktion aus.
- 5 Designs (Modern Light/Dark, Minimal, Pastel, AMOLED Black), 6 Vorlagen, eigene Vorlagen, JSON-Import/-Export, Backup/Restore, Layout auf ein anderes Display kopieren, automatisches Startlayout aus einem Bereich
- Firmware-Manager: GitHub-Release-Download mit SHA-256-Prüfung, OTA-Update, dokumentierte Wiederherstellung
- Dienste für Automationen: `guition_studio.notify` (Pop-up), `guition_studio.show_page` (Seitenwechsel), `guition_studio.push_layout`
- Pro Display eine `update`-Entität (Firmware-Updates in HA) und eine `notify`-Entität (`notify.send_message`)
- Reiter „Automatik“: Seitenwechsel-Regeln (Uhrzeit/Zustand), Nachtmodus (Uhrzeit/Sonne), Bildschirmschoner mit Uhr, **Diashow** (Fotos aus Home Assistant, gestreamt, nicht gespeichert) oder **islamischen Gebetszeiten** (aus der Integration „Islamic Prayer Times“)
- Einstellungsmenü direkt am Display (Kachel „Einstellungen“ oder 3 s auf die Uhr drücken)

Was **noch nicht** enthalten ist, ist in der Oberfläche als „nicht verfügbar“ markiert und in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#grenzen-von-v02) beschrieben (z. B. Kamera, Rotation).

## Schnellstart

**Firmware installieren:** https://abutvboo.github.io/guition-studio/ in Chrome oder Edge öffnen, Display per USB anschließen und auf „Installieren“ klicken.

1. **HACS → Benutzerdefinierte Repositories →** dieses Repository als „Integration“ hinzufügen und „Guition Studio“ installieren. Danach Home Assistant neu starten.
2. **Einstellungen → Geräte & Dienste → Integration hinzufügen → „Guition Studio“**.
3. In der Seitenleiste **Guition Studio → Meine Displays → Neues Display einrichten** öffnen und dem Assistenten folgen.

Ausführlich: [docs/INSTALLATION.md](docs/INSTALLATION.md) · Firmware: [docs/FIRMWARE.md](docs/FIRMWARE.md) · Protokoll: [docs/PROTOCOL.md](docs/PROTOCOL.md) · Probleme: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) · Hardware-Abnahme: [docs/HARDWARE_ACCEPTANCE.md](docs/HARDWARE_ACCEPTANCE.md)

## Getestete Versionen

| Software | Version |
|---|---|
| Home Assistant | 2026.10.4 (Integrationstests), Mindestversion laut `hacs.json`: 2026.1.0 |
| ESPHome | 2026.10.1 (ESP-IDF 5.5.6, LVGL 9.6.0) |
| Node.js / TypeScript / Vite / Vitest | 24 / 5.9.3 / 8.3.5 / 5.0.5 |
| Lit / ESP Web Tools / @material/web | 3.3.3 / 10.4.0 / 2.4.1 (gepinnt, siehe `frontend/package.json`) |

## Entwicklung

```bash
# Python-Tests (Unit + echte HA-Integrationstests, Linux/macOS)
pip install pytest-homeassistant-custom-component && pytest

# Editor
cd frontend && npm ci && npm test && npm run build   # schreibt nach custom_components/guition_studio/www
npm run dev   # Standalone-Harness mit Mock-Backend (nur Entwicklung)

# Firmware
pip install esphome==2026.10.1
esphome compile firmware/guition-studio.yaml
python scripts/package_firmware.py
```

Releases: Ein Tag `vX.Y.Z` startet `.github/workflows/release.yml`. Die Action baut die Firmware und veröffentlicht `firmware.factory.bin`, `firmware.ota.bin`, `SHA256SUMS` und `guition_studio.zip`. Die Versionen in `firmware/guition-studio.yaml` und `manifest.json` müssen zum Tag passen. Für Forks die Firmware-Quelle in `const.py` (`DEFAULT_FIRMWARE_REPO`) anpassen oder in den Integrationsoptionen ändern.

## Unterstützen

Guition Studio ist kostenlos und entsteht in meiner Freizeit. Wenn es dein Zuhause ein bisschen schöner macht, kannst du mir einen Kaffee spendieren ☕ – danke!

[![Buy me a coffee via PayPal](https://img.shields.io/badge/Buy%20me%20a%20coffee-PayPal-00457C?logo=paypal&logoColor=white)](https://paypal.me/sebagueven)

## Lizenz

MIT. Inspiriert von der Benutzerfreundlichkeit von Projekten wie Tessera und EspControl. Es wurden kein Code und kein Design übernommen.
