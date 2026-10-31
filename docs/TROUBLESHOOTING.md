# Fehlerbehebung

| Problem | Ursache / Lösung |
|---|---|
| „USB-Installation im Browser nicht möglich“ | HA nicht über HTTPS oder localhost geöffnet bzw. Browser ohne Web Serial. Chrome/Edge verwenden oder den esptool-Weg aus INSTALLATION.md nehmen. |
| Kein serieller Port sichtbar | Ladekabel ohne Datenleitungen; CH340-Treiber unter Windows installieren; BOOT halten + RESET drücken. |
| Installer meldet falschen Chip | Das Board ist kein ESP32-S3-4848S040, oder es ist ein anderes Board angeschlossen. |
| Gerät erscheint nicht im Assistenten | Wurde es in *Geräte & Dienste* als ESPHome-Gerät hinzugefügt? Ist es online? In der Diagnose prüfen, ob „Aktionen ✓“ angezeigt wird. Bei eigener Firmware müssen die `gs_*`-Aktionen vorhanden sein. |
| HA fragt nach einem Verschlüsselungsschlüssel | Das Gerät hat bereits einen Schlüssel (z. B. aus einer früheren Kopplung). Schlüssel eingeben oder das Gerät bei der Neuinstallation löschen. |
| „Keine Bestätigung vom Display erhalten“ | Display offline oder WLAN schwach (Sensor „WLAN-Signal“). Unter Diagnose „Status abfragen“ klicken. Das alte Layout bleibt aktiv. |
| „Prüfsumme stimmt nicht“ | Paketverlust; wird automatisch bis zu 3× wiederholt. |
| „Layout ist zu groß“ | Mehr als 32 KB im Geräteformat. Lange Titel kürzen oder Seiten bzw. Kacheln reduzieren. |
| Kachel zeigt „Nicht verfügbar“ | Die Entität ist in HA `unavailable` oder gelöscht. Im Designer ist die Kachel ausgegraut und markiert. |
| Tippen bewirkt nichts | Aktion „Standard“ macht bei Sensoren nichts. Aktion in der Eigenschaftsleiste setzen. Unter Diagnose → Protokoll erscheint jede Berührung. |
| OTA schlägt fehl | Unter *Einstellungen → System → Netzwerk* muss eine interne HA-URL gesetzt sein, die das Display erreicht. Wiederherstellung: siehe FIRMWARE.md. |
| Display bleibt schwarz | Hintergrundbeleuchtung (Entität „Hintergrundbeleuchtung“) prüfen; Standby-Helligkeit 0 % plus Timeout schaltet das Licht ganz aus, ein Tippen weckt das Display. |

Protokolle: *Guition Studio → Diagnose & Protokolle* (Export als JSON) sowie die Diagnose-Datei unter *Geräte & Dienste → Guition Studio → ⋮ → Diagnose herunterladen*. Firmware-Logs: ESPHome → Gerät → Protokolle.
