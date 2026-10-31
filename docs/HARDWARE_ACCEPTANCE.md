# Hardware-Abnahme (Checkliste)

> Stand v0.1: Firmware-Build, Integrationstests und Editor-Tests laufen automatisiert. **Ein Test auf einem echten Guition-Display hat noch nicht stattgefunden.** Diese Checkliste beschreibt die Abnahme der Definition „funktionsfähig“.

Vorbereitung: HA ≥ 2026.1 über HTTPS, Chrome am PC, Display per USB, eine schaltbare Lampe in HA (z. B. `light.test`).

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| 1 | Integration per HACS installieren, HA neu starten, Integration hinzufügen | Menüpunkt „Guition Studio“ in der Seitenleiste | |
| 2 | Assistent → USB → Firmware herunterladen → installieren | Fortschritt im ESP-Web-Tools-Dialog, „Installation abgeschlossen“ | |
| 3 | WLAN im Dialog eingeben | Display zeigt „Noch kein Layout vorhanden“, WLAN-Symbol grün | |
| 4 | Geräte & Dienste → entdecktes ESPHome-Gerät hinzufügen | ohne Schlüsseleingabe möglich; HA-Symbol auf dem Display wird grün | |
| 5 | Im Assistenten Gerät wählen → Verknüpfen → „Startlayout übertragen“ | Uhr und Status erscheinen auf dem Display; Meldung „vom Display bestätigt“ | |
| 6 | Designer: `light.test` aus der Bibliothek auf die Seite ziehen → Übertragen | Kachel erscheint; Farbe entspricht dem Zustand der Lampe | |
| 7 | Kachel auf dem Display antippen | Lampe schaltet um; Kachel ändert innerhalb von < 1 s ihre Farbe | |
| 8 | Lampe in HA schalten | Display aktualisiert sich ohne Zutun | |
| 9 | Display vom Strom trennen und wieder anschließen | zuletzt übertragenes Layout erscheint nach dem Booten | |
| 10 | Zweite Seite anlegen, Navigationskachel, übertragen; wischen | Seitenwechsel per Wischen und per Kachel; Seitenpunkte | |
| 11 | Timeout 15 s einstellen und übertragen; warten; antippen | Display dimmt; erstes Tippen weckt, ohne eine Aktion auszulösen | |
| 12 | Dienst `guition_studio.notify` aufrufen | Pop-up erscheint | |
| 13 | WLAN des Displays abschalten, im Designer übertragen | verständliche Fehlermeldung nach 3 Versuchen; altes Layout bleibt | |
| 14 | Firmware-Manager → OTA erneut installieren | Fortschritt, Neustart, Display meldet sich mit Version | |
| 15 | Touch-Kalibrierung: alle vier Ecken antippen (3×3-Raster, Aktion „Umschalten“) | richtige Kachel reagiert; andernfalls `transform` (mirror/swap) prüfen | |

### Zusatz v0.2 (Phase 2)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| 16 | Dimmbare Lampe als „Licht mit Helligkeitsregler“ übertragen, Regler ziehen | Wert läuft live mit; beim Loslassen setzt HA die Helligkeit; Ziehen wechselt nicht die Seite | |
| 17 | Regler ganz nach links | Lampe geht aus | |
| 18 | Rollladen-Kachel: ▲ ■ ▼ | Rollladen fährt/stoppt; Position wird angezeigt | |
| 19 | Thermostat-Kachel: + / − | Zieltemperatur ändert sich um die Schrittweite des Geräts | |
| 20 | Mediaplayer-Kachel (2 Spalten): ⏯, ⏭, Lautstärke | Player reagiert; Interpret und Titel werden angezeigt | |
| 21 | Wetter-Kachel | Temperatur, Zustand und passendes Wetter-Icon | |
| 22 | Icons (z. B. Glühbirne, Heizkörper) prüfen | MDI-Icons werden scharf dargestellt, nicht als Kästchen | |
| 23 | Display noch mit Firmware 0.1 betreiben und ein Layout übertragen | Meldung „Firmware-Protokoll inkompatibel – bitte Firmware aktualisieren“ | |

### Zusatz v0.3 (Phase 3)

| # | Schritt | Erwartung | ✓ |
|---|---|---|---|
| 24 | Regel „Zustand: input_boolean.test wird on → Seite 2“, übertragen, Display dimmen lassen, Schalter in HA einschalten | Display wacht auf und zeigt Seite 2; erneutes „on“ ohne vorheriges „off“ löst nicht erneut aus | |
| 25 | Zeitregel auf die nächste Minute stellen | Seitenwechsel zur eingestellten Minute | |
| 26 | Nachtmodus „Feste Uhrzeiten“ so setzen, dass er jetzt aktiv ist (Helligkeit 10 %, Abdunklung 50 %) | Display deutlich dunkler; Diagnose zeigt „Nachtmodus aktiv“ | |
| 27 | Bildschirmschoner nach 30 s mit einem Sensor | Uhr, Datum und Wert erscheinen; erstes Antippen beendet ihn, ohne eine Kachel auszulösen | |
| 28 | Verlaufsgraph mit einem Temperatursensor | Säulenverlauf und Min–Max erscheinen spätestens nach der Übertragung bzw. 10 Minuten | |
| 29 | RGB-Kachel: Farbfelder und Regler | Lampe wechselt die Farbe bzw. die Helligkeit | |
| 30 | *Einstellungen → Updates* | Update-Entität des Displays mit installierter Version; „Installieren“ startet OTA mit Fortschritt | |
| 31 | Automation mit `notify.send_message` an die Notify-Entität des Displays | Pop-up erscheint | |
| 32 | Display kurz vom Strom trennen | Diagnose zählt einen Neustart | |

Bei Abweichungen: Diagnose-Export und ESPHome-Log anhängen.
