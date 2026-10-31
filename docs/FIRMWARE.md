# Firmware

## Aufbau

`firmware/guition-studio.yaml` ist die Konfiguration der vorgefertigten Release-Firmware:

- `display: mipi_rgb` mit dem offiziellen Boardmodell **`GUITION-4848S040`** (ST7701S, 18-Bit-RGB, Pins aus dem ESPHome-Modell) und SPI-Init-Bus GPIO48/47
- `touchscreen: gt911` an I²C (SDA GPIO19, SCL GPIO45)
- Hintergrundbeleuchtung per LEDC an GPIO38 (`light: Hintergrundbeleuchtung`)
- Octal-PSRAM mit 80 MHz, 16 MB Flash, ESP-IDF
- `logger: hardware_uart: UART0`: Die USB-C-Buchse hängt an einem USB-UART-Wandler, und GPIO19/20 (natives USB) sind durch Touch bzw. den RGB-Bus belegt
- `improv_serial` für die WLAN-Einrichtung, kein Fallback-AP und kein Captive Portal (das wäre ein ungeschützter Upload-Weg)
- `api: encryption: {}`: Home Assistant setzt den Schlüssel beim ersten Verbinden
- `ota: platform: http_request` lässt sich nur über die API-Aktion `gs_ota` auslösen
- Komponente **`guition_studio`** (`firmware/components/guition_studio/`) als Runtime-Layout-Engine

Build mit ESPHome 2026.10.1, lokal verifiziert (v0.3.0): RAM 33,6 % (115 KB), Flash 1,45 MB von 8 MB (App-Partition).

## Warum eine eigene Runtime-Komponente?

Die ESPHome-LVGL-Konfiguration ist statisch: Seiten und Widgets werden beim Kompilieren erzeugt. Neue Seiten bräuchten also jedes Mal einen neuen Build. Die Komponente `guition_studio` erzeugt LVGL-Objekte stattdessen **zur Laufzeit** aus einem JSON-Layout:

- Empfang über die ESPHome-API-Aktionen `gs_layout_begin/chunk/commit` (max. 32 KB, konfigurierbar bis 128 KB)
- Prüfung von CRC32, JSON und Schema (IDs, Grenzen, Überlappung, Navigationsziele) **bevor** etwas gespeichert wird
- Speicherung im NVS-Namensraum `gstudio`: Das aktive Layout wird vorher als `prev` gesichert. Beim Booten wird das aktive Layout mit CRC geprüft, bei Fehlern greift `prev`, sonst ein eingebauter Hinweisbildschirm.
- JSON-Puffer liegen im PSRAM
- Pro Kachel ein `lv_obj` mit Labels; Seiten werden ein- und ausgeblendet; Wischen über LVGL-Gesten; Tap/Long-Press-Erkennung mit Schutz vor Fehlauslösung beim Aufwecken und Wischen
- Dimmen nach Inaktivität, Rückkehr zur Startseite, Benachrichtigungs-Overlay auf `lv_layer_top()`
- Die eingebauten Montserrat-Schriften (12/16/20/28/40) und das Slider-Widget werden über versteckte Widgets in der YAML aktiviert, weil ESPHome nur referenzierte Schriften und Widgets kompiliert.
- Icons: 134 Material Design Icons als vorab erzeugte LVGL-Schriften (`gs_icon_font_20/28/40.c`, Tabelle in `gs_icons.h`). Neue Icons in `scripts/icons.json` eintragen und neu erzeugen:
  `npm i @mdi/font@7.4.47 lv_font_conv@1.5.2` und dann `node scripts/gen-icons.mjs node_modules/@mdi/font node_modules/lv_font_conv/lv_font_conv.js`
- Kacheln mit Bedienelementen: Dimmer (`lv_slider`, die Geste zum Seitenwechsel ist auf dem Regler gesperrt), Tastenleisten für Rollladen, Thermostat und Medien

Die Komponente unterstützt LVGL 8 und 9 über Kompatibilitätsmakros.

## Eigene Firmware bauen

```bash
pip install esphome==2026.10.1
esphome compile firmware/guition-studio.yaml
python scripts/package_firmware.py          # -> dist/firmware/<version>/ inkl. SHA256SUMS
```

Eigene Anpassungen (z. B. Rotation: `rotation:` am Display und `transform:` am Touch) in einer Kopie der YAML vornehmen. Die Aktionsnamen `gs_*`, `on_event` mit `homeassistant.event: esphome.guition_studio` und `project.version` müssen erhalten bleiben, sonst findet Guition Studio das Gerät nicht.

Über ESPHome-Dashboard/CLI mit eigenem Schlüssel: `api: encryption: key: !secret …` setzen und denselben Schlüssel in HA eintragen.

## Wiederherstellung

1. Ein fehlgeschlagenes OTA-Update aktiviert die neue Partition nicht. Die alte Firmware läuft weiter.
2. Startet das Gerät nicht mehr: per USB neu installieren (Firmware-Manager → Installation per USB oder esptool, siehe INSTALLATION.md).
3. Kein Port bzw. kein Download-Modus: **BOOT** gedrückt halten, **RESET** kurz drücken, BOOT loslassen. Der ROM-Bootloader des ESP32-S3 lässt sich nicht überschreiben, das Gerät kann also immer neu geflasht werden.
4. Komplett zurücksetzen: Bei der Installation „Gerät löschen“ wählen. Danach in HA das ESPHome-Gerät entfernen und neu hinzufügen.
5. Das zuletzt bestätigte Layout liegt in HA. Meldet sich das Gerät mit abweichendem Layout, überträgt Guition Studio es automatisch erneut.
