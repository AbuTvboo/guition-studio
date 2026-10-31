# Changelog

## 0.5.3 – Touch an der richtigen Stelle
- **Behoben:** Berührungen kamen punktgespiegelt an (✕ oben rechts löste z. B. „Nachtmodus“ aus). Das ESPHome-Displaymodell `GUITION-4848S040` dreht das Bild per `mirror_x`/`mirror_y` um 180°, der Touch-Controller GT911 wurde nicht mitgedreht. Die Firmware spiegelt den Touch jetzt passend.
- Neu: **Touch-Ausrichtung** unter *Einstellungen* (Standard / 180° / links-rechts / oben-unten), um abweichende Board-Revisionen ohne Neu-Flashen zu korrigieren

## 0.5.2 – Bildschirmdrehung & leichteres Öffnen der Einstellungen
- **Bildschirmdrehung 0° / 90° / 180° / 270°:** Bild und Touch drehen sich gemeinsam, ohne neu zu flashen. Einstellbar unter *Einstellungen*, im Designer (*Displayeinstellungen*) und direkt im Display-Menü. Die Drehung bleibt nach einem Neustart erhalten.
- **Einstellungen am Display öffnen:** 3 Sekunden auf die **Kopfzeile oder eine beliebige leere Fläche** drücken. Die Bildschirmränder leuchten dabei zunehmend **gelb**, nach 3 Sekunden öffnet sich das Menü. Loslassen bricht ab. Die Zeit misst die Firmware selbst, unabhängig davon, wie oft der Touch-Controller beim Halten meldet.

## 0.5.1 – Bildschirmschoner leichter finden
- Neuer Knopf **„⏾ Automatik“** in der Werkzeugleiste des Designers: öffnet Bildschirmschoner, Diashow, Nachtmodus und Seitenwechsel-Regeln direkt
- Dieselben Einstellungen zusätzlich auf der Seite **Einstellungen** (mit „Speichern & auf Display übernehmen“)

## 0.5.0 – Diashow als Bildschirmschoner
- **Diashow:** Der Bildschirmschoner kann Fotos aus einem Ordner in Home Assistant zeigen (*Medien → Meine Medien*). Einstellbar im Designer unter *Automatik → Bildschirmschoner → Anzeige: Diashow*: Ordner, Bildwechsel (5 s – 5 min), zufällig oder der Reihe nach, „Ausfüllen“ oder „Ganzes Bild“, Uhrzeit ein/aus.
- **Gestreamt, nicht gespeichert:** Home Assistant verkleinert jedes Foto auf 480 × 480 (Quellformate JPEG, PNG, WebP, BMP, GIF; Drehung laut EXIF) und liefert immer nur das nächste Bild aus. Das Display hält höchstens zwei entpackte Bilder im Arbeitsspeicher (≈ 0,9 MB von 8 MB PSRAM, nur während der Diashow). Der Flash wird nicht beschrieben.
- **Ohne Flackern:** Das nächste Bild wird im Hintergrund in einen zweiten Puffer entpackt und erst dann eingeblendet.
- **Geschützt:** Der Bilder-Endpunkt verlangt einen zufälligen Schlüssel pro Display, der nur über die verschlüsselte ESPHome-Verbindung zum Display gelangt. Ausgeliefert werden nur Bilder aus dem gewählten Medienordner (kein Zugriff auf andere Pfade). Der Schlüssel ist nicht in Backups enthalten.
- Ist der Ordner leer oder nicht erreichbar, zeigt der Schoner die Uhr und versucht es mit wachsendem Abstand erneut.

Protokoll 5 (Bildschirmschoner-Felder `ssm`, `slu`, `sli`, `slc`). Voraussetzung: In Home Assistant ist eine interne URL eingetragen (*Einstellungen → System → Netzwerk*).

## 0.4.0 – Einstellungen am Display & neue Vorlagen

**Einstellungsmenü direkt am Display**
- Öffnen über die neue Kachel **„Einstellungen“** (Elementbibliothek → Systemfunktionen) oder **3 Sekunden auf die Uhr** oben rechts drücken
- Helligkeit und Standby-Helligkeit (Schieberegler mit Live-Vorschau), Bildschirm-Timeout, Nachtmodus und Bildschirmschoner an/aus
- Design und Startseite wechseln: Home Assistant überträgt dafür das zuletzt bestätigte Layout neu (unfertige Entwürfe werden nicht mitgeschickt)
- Info: WLAN-Signal, IP-Adresse, Home-Assistant-Verbindung, Firmware, Layout-Revision, freier Speicher
- Neustart mit Sicherheitsabfrage (zweimal tippen)
- Änderungen gelten sofort, bleiben nach einem Neustart erhalten und werden in Guition Studio übernommen, damit spätere Übertragungen sie nicht zurücksetzen. Home Assistant nimmt nur bekannte Einstellungen mit geprüften Wertebereichen an.
- Ein Nachtmodus, der von Hand am Display umgeschaltet wurde, gilt bis zum nächsten geplanten Wechsel

**8 neue Vorlagen** (jetzt 14): Eingang & Flur, Badezimmer, Kinderzimmer, Energie-Dashboard, Garten & Außen, Homeoffice, Einfach (große Kacheln) und Smart Home komplett (4 Seiten mit Navigation, Nachtmodus und Bildschirmschoner)

Protokoll 4 (neue Kachel `settings`, Aktion 7, Event `setting`). Displays brauchen Firmware 0.4.0. Das Update geht direkt über die Update-Entität in Home Assistant.

## 0.3.1 – Einfachere Installation
- **Online-Installer** unter https://abutvboo.github.io/guition-studio/ (GitHub Pages, immer HTTPS): Firmware per USB direkt im Browser installieren, auch wenn Home Assistant nur über `http://` erreichbar ist. Keine Browser-Flags, kein HTTPS-Setup nötig. WLAN wird im selben Dialog eingerichtet, danach erscheint „Zu Home Assistant hinzufügen“.
- Der Assistent in Guition Studio erkennt `http://`, Brave und Smartphones und bietet statt einer Fehlermeldung direkt den sicheren Installer an. Andere Wege (esptool, improv-wifi.com) sind ausklappbar.
- Bei jedem Release aktualisiert eine GitHub-Action den Installer automatisch mit der geprüften Firmware (SHA-256).

## 0.3.0 – Phase 3 „Erweiterte Funktionen“

**Intelligente Automatisierung (ohne YAML, Reiter „Automatik“ im Designer)**
- Seitenwechsel-Regeln: „Um HH:MM → Seite“ oder „Wenn Entität wird / größer / kleiner … → Seite“. Flankengetriggert, weckt das Display. Bis zu 20 Regeln.
- Nachtmodus nach Uhrzeit oder Sonnenstand (`sun.sun`): maximale Helligkeit, zusätzlicher Abdunklungsfilter (0–80 %), optionaler Seitenwechsel bei Beginn
- Bildschirmschoner: Uhr, Datum und bis zu zwei Werte nach einstellbarer Inaktivität; das erste Antippen beendet ihn ohne Aktion

**Erweiterte Widgets**
- Verlaufsgraph (`graph`): 1–48 h aus dem Recorder, 48 Säulen, Min/Max-Anzeige, Aktualisierung alle 10 Minuten
- RGB-Licht (`rgb`): Helligkeitsregler und fünf Farbfelder (Warmweiß, Rot, Grün, Blau, Violett)
- Kamera bleibt bewusst gesperrt: Ein Videostream über die ESPHome-API auf einem ESP32-Panel ist technisch nicht sinnvoll.

**Home-Assistant-Entitäten pro Display**
- `update.*`: Firmware-Version, Update-Hinweis unter *Einstellungen → Updates*, Installation per Klick (lädt die Firmware bei Bedarf herunter, prüft sie und installiert per OTA mit Fortschritt)
- `notify.*`: Display als Ziel für `notify.send_message` in Automationen
- Die Entitäten hängen am verknüpften ESPHome-Gerät und werden beim Entfernen eines Displays aufgeräumt.

**Überwachung und Stabilität**
- Heartbeat des Displays alle 5 Minuten (Laufzeit, freier RAM/PSRAM), Erkennung von Neustarts, Minimum des freien RAM, Anzeige in der Diagnose
- Ein Seitenwechsel aus HA weckt das Display und beendet den Bildschirmschoner
- Protokoll 3 (neue Aktion `gs_mode`, Event `hb`, Graphdaten `g`/`gr`); ältere Firmware wird als inkompatibel gemeldet

## 0.2.0 – Phase 2 „Bedienkomfort“

**Neue Kacheltypen (Firmware + Editor + Home Assistant)**
- **Licht mit Helligkeitsregler** (`dimmer`): Schieberegler auf dem Display, Tippen schaltet um
- **Rollladen** (`cover`): ▲ ■ ▼ und Position
- **Thermostat** (`thermostat`): aktuelle Temperatur, Zieltemperatur, − / + in der Schrittweite des Geräts (begrenzt auf min/max)
- **Mediaplayer** (`media`): Interpret – Titel, Status, ⏮ ⏯ ⏭, ab 2 Spalten zusätzlich Lautstärke − / +
- **Wetter** (`weather`): Temperatur, Zustand und Luftfeuchte, Icon passend zum Wetter
- Der Editor wählt den Kacheltyp automatisch passend zur Entität (z. B. dimmbare Lampe → Dimmer, `climate` → Thermostat) und prüft, ob die Domain zum Typ passt

**Material Design Icons auf dem Display**
- 134 MDI-Icons (u. a. Glühbirne, Deckenlampe, Rollladen, Heizkörper, Wetter) als LVGL-Schrift in 20/28/40 px
- Icon-Auswahl im Editor mit Suche
- Eine einzige Quelle (`scripts/icons.json`) erzeugt Firmware-Schrift, C++-Tabelle, Python- und TypeScript-Liste (`scripts/gen-icons.mjs`)
- Alte Icon-Namen aus 0.1 werden automatisch umgesetzt (z. B. `charge` → `flash`)

**Protokoll 2**
- Neue Gerätemeldungen `set` (Regler) und `btn` (Taste in einer Kachel)
- Zustände enthalten zusätzlich `n` (0–100), `s` (Zweitzeile) und `i` (Icon)
- Sicherheit: Home Assistant akzeptiert nur Bedienungen, die zum Kacheltyp passen, prüft Wertebereiche und steuert ausschließlich die Entität der Kachel
- Firmware 0.1 wird als inkompatibel erkannt („bitte Firmware aktualisieren“)

**Vorlagen** auf neue Kacheln und Icons umgestellt (Wohnzimmer mit Wetter/Dimmer/Rollladen, Heizung mit Thermostaten, Mediensteuerung mit Mediaplayer-Kachel).

## 0.1.0 – Phase 1 MVP
Erste Version: HACS-Integration, Designer, Laufzeit-Layout-Engine, Übertragung mit ACK/Retry/Rollback, USB-Installation, OTA, Vorlagen, Backups.
