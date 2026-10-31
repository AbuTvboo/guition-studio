# Installationsanleitung

## Voraussetzungen

- Home Assistant ab 2026.1 (getestet mit 2026.10.4) mit ESPHome-Integration (Standard)
- Guition ESP32-S3-4848S040 (4", 480 × 480, ST7701S, GT911) und ein USB-C-**Daten**kabel
- Für die USB-Installation aus dem Browser: Chrome, Edge oder Opera am Computer **und** Home Assistant über **HTTPS** (z. B. Nabu Casa, Reverse Proxy) oder über `http://localhost:8123` auf demselben Rechner. Web Serial funktioniert nur in einem sicheren Kontext.

## 1. Integration über HACS installieren

1. HACS → ⋮ → *Benutzerdefinierte Repositories* → Repository-URL eintragen, Kategorie **Integration**.
2. „Guition Studio“ suchen → *Herunterladen*.
3. Home Assistant neu starten.

Manuell: den Ordner `custom_components/guition_studio` nach `/config/custom_components/` kopieren und HA neu starten.

## 2. Integration hinzufügen

*Einstellungen → Geräte & Dienste → Integration hinzufügen → Guition Studio.*
Die Firmware-Quelle (GitHub-Repository) kann so bleiben. Danach erscheint links in der Seitenleiste **Guition Studio** (nur für Administratoren sichtbar).

## 3. Display einrichten (Assistent)

*Guition Studio → Meine Displays → Neues Display einrichten*

1. **Display hinzufügen:** Name, Hardwareprofil, Methode „Neu installieren (USB)“.
2. **Gerät verbinden:** Display per USB an den Computer anschließen.
3. **Firmware installieren:** Falls noch keine Firmware in HA liegt, „Neueste geprüfte Firmware herunterladen“ (SHA-256 wird geprüft). Dann „Gerät verbinden & Firmware installieren“ wählen, den Port auswählen und bei der Erstinstallation „Gerät löschen“ bestätigen. Am Ende fragt der Dialog die WLAN-Zugangsdaten ab (Improv).
4. **WLAN & Home Assistant:** HA meldet „Neues Gerät entdeckt (ESPHome)“. Unter *Geräte & Dienste* auf **Hinzufügen** klicken. HA erzeugt dabei automatisch den Verschlüsselungsschlüssel und speichert ihn auf dem Display. Im Assistenten erscheint das Gerät danach, du wählst es aus und klickst auf „Verknüpfen & weiter“.
5. **Designer öffnen:** Ein Startlayout (Uhr + Status) ist angelegt. Mit „Startlayout übertragen“ prüfst du die Verbindung.

### Einfachster Weg: Online-Installer

https://abutvboo.github.io/guition-studio/ in Chrome oder Edge öffnen. Die Seite läuft immer über HTTPS und funktioniert deshalb auch, wenn Home Assistant nur per `http://` erreichbar ist. Der Assistent in Guition Studio öffnet sie automatisch, wenn eine Installation im Panel nicht möglich ist.

### Ohne Web Serial

Den Link „firmware.factory.bin herunterladen“ verwenden und flashen:

```bash
pip install esptool
esptool.py --chip esp32s3 write_flash 0x0 firmware.factory.bin
```

WLAN danach über https://www.improv-wifi.com/ (USB) einrichten, anschließend weiter mit Schritt 4.

### Offline / eigene Firmware

`python scripts/package_firmware.py` erzeugt `dist/firmware/<version>/`. Diesen Ordner nach `/config/guition_studio/firmware/<version>/` kopieren. Er erscheint dann im Firmware-Manager als „lokal“.

## 4. Seiten gestalten

- Entitäten aus der Bibliothek unten auf eine Seite **ziehen** oder auswählen und **Enter** drücken.
- Kacheln verschieben (auch auf andere Seiten), über die blaue Ecke vergrößern, rechts die Eigenschaften anpassen.
- **„Auf Display übertragen“**: Das Layout wird geprüft, übertragen und vom Display bestätigt.

Tastatur: `Tab` Kachel wählen · Pfeile verschieben · `Umschalt`+Pfeile Größe ändern · `Bild↑/↓` auf eine andere Seite · `Strg+C/V/D` · `Entf` · `Strg+Z/Y`.

## Sicherheitshinweise

- Zwischen dem Flashen und dem Hinzufügen in HA spricht das Display unverschlüsselt (noch kein Schlüssel vorhanden). Diesen Schritt bitte direkt nacheinander im eigenen Netz erledigen.
- Die Firmware enthält keine Zugangsdaten und keinen HA-Token. Sie öffnet weder einen Access Point noch ein Captive Portal oder einen OTA-Port.
