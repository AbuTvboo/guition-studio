# Changelog

## 0.5.13 – Vereinslogos im Fußball-Bildschirmschoner
- **Vereinslogos** neben den Mannschaftsnamen („Bayern 🛡 – 🛡 Dortmund“). Home Assistant lädt jedes Logo einmal von ESPN, schneidet den transparenten Rand ab und verkleinert es auf 18 × 18 Pixel mit weicher Kante (in der 12-px-Ansicht 13 px). Das Display behält bis zu 120 Logos bis zum nächsten Neustart, jedes Logo wird also nur einmal übertragen (≈ 1 KB).
- Die Liste erscheint sofort; die Logos werden nachgeladen, sobald sie da sind.

## 0.5.12 – Fußball-Bildschirmschoner
- **Neuer Bildschirmschoner „Fußball – heutige Spiele“:** Er zeigt alle heutigen Spiele der gewählten Ligen. Standard sind **1. Bundesliga, Süper Lig und LaLiga**. Wählbar sind außerdem 2. Bundesliga, Premier League, Serie A, Ligue 1 und Champions League.
  - Je Spiel stehen Anstoßzeit, Heim- und Gastmannschaft da. Bei laufenden Spielen kommt der **Live-Spielstand in Grün mit Minute** dazu (oder „HZ“), bei beendeten Spielen das Endergebnis.
  - Die Schrift ist so klein wie nötig, damit möglichst viele Spiele auf den Bildschirm passen: 16 px, bei vielen Spielen 12 px. Reicht der Platz trotzdem nicht, blättert die Liste alle 8 Sekunden weiter (Anzeige oben „1/2“).
  - An Tagen ohne Spiele erscheinen die **nächsten Spiele mit Wochentag**.
  - Die Daten holt Home Assistant von ESPN (öffentlich, ohne Konto): alle 10 Minuten, während Spiele laufen jede Minute. Bekannte Namen werden eingedeutscht bzw. ins Türkische korrigiert (Köln, Beşiktaş, Fenerbahçe …).
- **Neuer Modus „Gebetszeiten & Fußball im Wechsel“:** Die beiden Ansichten wechseln sich ab, alle 10 s bis 2 min einstellbar. Gebetszeiten allein und Fußball allein gibt es weiterhin.
- Mit Türkisch als Sprache stehen auch die Fußball-Texte auf Türkisch („Bugün“, „Sonraki maçlar“, „İY“).

## 0.5.11 – Schnelles Update & zweites Kalligraphie-Design
- **Firmware wieder klein (≈ 1,6 MB statt 3,3 MB):** Die Hintergründe stecken jetzt als JPEG in der Firmware (zusammen 48 KB statt 1,8 MB) und werden erst beim Öffnen des Bildschirmschoners in den PSRAM entpackt (etwa 0,2 s, danach zwischengespeichert). Firmware-Updates dauern dadurch wieder so lange wie vor 0.5.10.
- Größerer Empfangspuffer (4 KB statt 512 Byte) für Firmware-Updates und Diashow-Bilder.
- **Zwei Hintergründe zur Wahl:**
  - **Basmala:** Mihrab-Bogen, Sternmuster, Basmala
  - **Moschee:** Sternenhimmel mit Mondsichel, goldene Moschee-Silhouette, große „Allah“-Kalligraphie
  - die drei Farbvarianten aus 0.5.10 sind entfallen (eine gewählte Variante wird zur Basmala)

## 0.5.10 – Wisch-Kachel folgt dem Finger, hoch/runter & mehr Kalligraphie
- **Wisch-Kachel folgt dem Finger:** Der Inhalt bewegt sich beim Wischen mit und wird dabei blasser. Nach dem Loslassen gleitet er hinaus, und die nächste Entität gleitet von der anderen Seite herein. Bei zu kurzem Weg federt er zurück.
- **Kein versehentliches Schalten mehr:** Bewegt sich der Finger mehr als ein paar Millimeter, gilt die Berührung als Wischen. Tippen und langes Drücken werden dann nicht ausgelöst. Das gilt für alle Kacheln, auch beim Seitenwechsel.
- **Wisch-Kachel hoch/runter:** neue Einstellung *Wischrichtung* (⇆ links/rechts oder ⇅ hoch/runter). In der Bibliothek gibt es beide Varianten direkt. Bei hoch/runter stehen die Punkte senkrecht am rechten Rand, und waagerechtes Wischen wechselt weiterhin die Seite.
- Neue Kalligraphie-Hintergründe (siehe 0.5.11).

## 0.5.9 – Gebetszeiten auf Türkisch & mit Kalligraphie
- **Türkische Namen:** Unter Automatik → Bildschirmschoner → Gebetszeiten lässt sich die Sprache wählen: Deutsch (Fajr, Dhuhr, Asr …) oder **Türkçe** (İmsak, Güneş, Öğle, İkindi, Akşam, Yatsı). Die Countdown-Zeile heißt dann z. B. „Sonraki vakit: Öğle · 1 sa 23 dk“, zur Gebetszeit „Şimdi: Öğle“.
- **Hintergrund mit islamischer Kalligraphie:** dunkles Blau mit dezentem achtzackigem Sternmuster, ein goldener Bogen (Mihrab) um die Uhr und unten die **Basmala** in Gold, gesetzt in der Schrift Amiri. Das nächste Gebet ist passend dazu golden hervorgehoben. Abschaltbar („Schlicht“). Das Bild steckt in der Firmware, es wird nichts nachgeladen.
- Die Display-Schriften enthalten jetzt auch die türkischen Buchstaben İ ı Ğ ğ Ş ş.
- Neue Firmware erforderlich (0.5.9). Ältere Firmware zeigt weiter deutsche Texte ohne Hintergrund.

## 0.5.8 – Wisch-Kachel
- **Neue Wisch-Kachel:** bis zu 4 Entitäten in **einer** Kachel. Wischst du auf dem Display über die Kachel nach links oder rechts, zeigt sie die nächste bzw. vorige Entität. Die neue Anzeige gleitet von der Seite herein. Die Seite wechselt dabei nicht. Punkte oben rechts zeigen, welche Entität gerade zu sehen ist.
- Tippen bedient immer die **gerade angezeigte** Entität (z. B. Licht umschalten). Leuchtet die angezeigte Entität, färbt sich die Kachel ein, wie bei normalen Licht- und Schalterkacheln.
- Im Designer liegt sie in der Bibliothek unter **System → „Wisch-Kachel (bis 4 Entitäten)“**. Titel und Icon werden beim Auswählen automatisch vorgeschlagen, die Reihenfolge lässt sich ändern.

## 0.5.7 – Gebetszeiten & kein Flackern mehr beim Update
- **Neuer Bildschirmschoner „Islamische Gebetszeiten“:** Uhrzeit und Datum, darunter Fajr, Sonnenaufgang, Dhuhr, Asr, Maghrib und Isha. Das **nächste Gebet** ist farbig hervorgehoben, darüber steht ein Countdown („Nächstes Gebet: Asr in 1 h 23 min“). Zur Gebetszeit steht 15 Minuten lang „Jetzt: …“. Die Zeiten kommen aus der Home-Assistant-Integration **Islamic Prayer Times**, dort stellst du auch die Berechnungsmethode ein. Im Designer werden die Sensoren automatisch erkannt, du kannst sie aber auch von Hand wählen.
- Zeitstempel-Sensoren werden jetzt in der **Zeitzone von Home Assistant** angezeigt. Vorher galt die Zeitzone des Betriebssystems, und in Docker ohne `TZ` lagen die Zeiten dadurch um eine Stunde daneben.
- **Neues Farbdesign der Oberfläche:** Petrol als Hauptfarbe, Bernstein als Akzent, kühle Grautöne, dunkle Titelleiste. Eingabefelder, Hinweise, Tabellen und Menü sind überarbeitet. Hell- und Dunkelmodus folgen automatisch dem Home-Assistant-Design. Alle Funktionen sind gleich geblieben.
- **Firmware-Update ohne Flackern:** Die Display-Interrupt-Routine, die den Bildpuffer nachlädt, liegt jetzt im internen RAM (`CONFIG_LCD_RGB_ISR_IRAM_SAFE`). Vorher pausierte sie bei jedem Flash-Schreibvorgang. Zusätzlich synchronisiert sich das Bild bei VSYNC neu, und der PSRAM-Cache ist größer.

## 0.5.6 – Bessere Entitätsauswahl & einstellbares Wetter
- **Neue Entitätsauswahl:** zeigt nur passende Entitäten für den Kacheltyp (bei der Wetter-Kachel z. B. alle Wetter-Entitäten), mit Name, Bereich und aktuellem Wert. Sie versteht deutsche Suchbegriffe wie „wetter“, „licht“, „lampe“, „rollladen“, „heizung“, „steckdose“ oder „musik“. Bedienbar mit Maus, Touch und Tastatur.
- Verständlichere Meldung, wenn eine Entität nicht zum Kacheltyp passt (z. B. „Dieser Kacheltyp braucht eine Wetter-Entität (weather.…)“)
- **Wetter-Kachel einstellbar:** Zustand, Höchst-/Tiefstwert, Luftfeuchte, Wind, Luftdruck und 3-Tage-Vorhersage einzeln ein- und ausschaltbar, pro Kachel
- Unterstützen-Link (PayPal) unter *Einstellungen*

## 0.5.5 – Vollständiges Wetter & weniger Flimmern beim Update
- **Wetter-Kachel mit allen Daten:** Zustand auf Deutsch, Temperatur, Höchst-/Tiefstwert, Luftfeuchte und Wind. Bei 2×2 zusätzlich eine **3-Tage-Vorhersage** mit Wochentag, Icon und Temperaturen. Home Assistant holt die Vorhersage über `weather.get_forecasts` (30 Minuten zwischengespeichert, alle 10 Minuten aktualisiert). Seit HA 2024 steht sie nicht mehr in den Attributen.
- Die Eigenschaftsleiste zeigt Wetter, Sensoren usw. jetzt formatiert („Teilweise bewölkt“ statt `partlycloudy`) und beim Wetter zusätzlich Feuchte, Wind und Luftdruck.
- **Firmware-Update ohne Bildstörungen:** Programmcode läuft jetzt aus dem PSRAM (`CONFIG_SPIRAM_XIP_FROM_PSRAM`). Flash-Schreibvorgänge (OTA, Einstellungen) blockieren dadurch den Bildspeicher nicht mehr, was vorher Flimmern und Springen verursachte. Die Update-Seite mit Fortschrittsbalken (seit 0.5.4) erscheint ab dem Update *von* 0.5.4 oder neuer.

## 0.5.4 – Umlaute, Update-Anzeige & Farbwähler
- **Behoben: Umlaute und Sonderzeichen als Rechtecke.** Die in LVGL eingebauten Schriften enthalten nur ASCII. Die Firmware nutzt jetzt eigene Montserrat-Schriften mit ä ö ü ß, „ “, ·, –, …, °, € usw. (erzeugt mit `scripts/gen-fonts.mjs`).
- **Update-Seite beim Firmware-Update:** Das Display zeigt „Firmware-Update läuft – nicht vom Strom trennen“ mit Fortschrittsbalken und Prozent, danach „Update abgeschlossen“ bzw. bei Fehlern eine Meldung (die alte Firmware bleibt dann aktiv).
- **Farbwähler für RGB-Lichter:** Langes Tippen auf eine RGB-Kachel (z. B. WLED) öffnet am Display ein Farbfenster mit 12 Farben, 6 Pastelltönen, 5 Weißtönen (Kerze bis Kalt) und Helligkeitsregler. Home Assistant prüft Farbton, Sättigung und Farbtemperatur auf gültige Bereiche.

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
