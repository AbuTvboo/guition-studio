# Kommunikationsprotokoll (Version 2)

## Transportweg

| Richtung | Mechanismus | Absicherung |
|---|---|---|
| HA → Display | ESPHome-Aktionen `esphome.<node>_gs_*` über die native API | Noise-Verschlüsselung der ESPHome-API, Schlüssel von HA provisioniert |
| Display → HA | `homeassistant.event` vom Typ `esphome.guition_studio` | gleiche verschlüsselte Verbindung; HA akzeptiert `esphome.*`-Events auch ohne „Aktionen erlauben“ |

Das Display ruft **niemals** selbst HA-Dienste auf. Es meldet nur `tap`/`hold`/`set`/`btn` mit Kachel-ID. Bei `set`/`btn` akzeptiert HA nur Bedienungen, die zum Kacheltyp passen, prüft die Wertebereiche und steuert ausschließlich die Entität der Kachel (`resolve_control()` in `layout.py`). Die Aktion wird im *in HA gespeicherten, bestätigten* Layout nachgeschlagen. Unbekannte Kachel-IDs werden ignoriert.

## Aktionen (HA → Display)

| Aktion | Variablen | Zweck |
|---|---|---|
| `gs_layout_begin` | `session:int, total:int, crc:int` | neue Übertragung; `total` in Bytes (UTF-8), `crc` = CRC32 (zlib) als int32 |
| `gs_layout_chunk` | `session:int, index:int, data:string` | Teilstück ≤ 1024 Bytes, nur an UTF-8-Zeichengrenzen geteilt, streng aufsteigender `index` |
| `gs_layout_commit` | `session:int` | prüfen, speichern, anzeigen, `ack` senden |
| `gs_states` | `data:string` | `{"e":{"light.x":{"o":1,"a":1,"d":"An · 50 %","n":50}},"v":{"t_1":0}}` (o = an, a = verfügbar, d = Anzeigetext, optional n = 0–100 für Helligkeit/Position/Lautstärke, s = Zweitzeile wie Zieltemperatur oder Medientitel, i = Icon für Wetter; v = Sichtbarkeit pro Kachel), ≤ 1500 Bytes je Nachricht |
| `gs_page` | `page:int` | Seite anzeigen (weckt das Display, beendet den Bildschirmschoner) |
| *(Layout `set`)* | `ss, sse, sst, ssm, slu, sli, slc` | Bildschirmschoner: Zeit, Werte, Titel; Modus (`ssm` 1 = Diashow, 2 = Gebetszeiten), Bild-URL (mit Display-Schlüssel), Intervall, Uhr |
| *(Layout `set`, `ssm`=2)* | `spn, spe, spk, spx, spb` | Gebetszeiten: Namen, Timestamp-Sensoren (HA sendet sie als `HH:MM` in der HA-Zeitzone), Art (1 = Gebet, 0 = Sonnenaufgang), Texte der Countdown-Zeile (Präfix, Trenner, Stunden-/Minuteneinheit, „Jetzt“-Präfix), Kalligraphie-Hintergrund an/aus |
| `gs_mode` | `night:int, brightness:int, dim:int` | Nachtmodus an/aus, max. Helligkeit in %, Abdunklung 0–80 % |
| `gs_notify` | `title, message:string, seconds:int` | Pop-up |
| `gs_rollback` | – | vorheriges Layout aktivieren |
| `gs_hello` | – | Status anfordern |
| `gs_ota` | `url, checksum:string` | HTTP-OTA mit MD5 |

## Events (Display → HA)

`event.data = {type, payload (JSON-String), node, device_id (von HA ergänzt)}`

| type | payload |
|---|---|
| `hello` | `{"proto":2,"fw":"0.2.0","hw":"guition-4848s040","rev":3,"crc":…,"page":0,"heap":…,"psram":…,"up":…,"max":32768,"layout":true}` |
| `ack` | `{"s":session,"ok":true,"rev":3,"crc":…,"err":""}`, Fehlercodes: `crc, size, oom, sequence, overflow, incomplete, session, nvs, version, json:*, schema:*` |
| `tap` / `hold` | `{"t":"t_ab12cd34","p":"p_…"}`; bei der Wisch-Kachel zusätzlich `"i":1` = Index der gerade angezeigten Entität (HA bedient genau diese) |
| *(Layout, Kachel `swipe`)* | `"it":[[entity, titel, icon], …]`: bis zu 4 Entitäten; `e` = erste Entität |
| `set` | `{"t":"t_…","p":"p_…","v":35}`: Schieberegler losgelassen (nur `dimmer`, 0–100; 0 = aus) |
| `btn` | `{"t":"t_…","p":"p_…","b":"down"}`: Taste in einer Kachel. `cover`: up/stop/down · `thermostat`: minus/plus · `media`: prev/play/next/vol_down/vol_up |
| `page` | `{"page":1,"id":"p_…"}` |
| `setting` | `{"k":"brightness","v":70}`: im Einstellungsmenü geändert. Schlüssel: brightness, standby, timeout, screensaver, night (lokal) sowie theme, home (HA überträgt neu) |
| `hb` | `{"up":3600,"heap":…,"psram":…}`: Heartbeat alle 5 Minuten |
| `ota` | `{"state":"start|progress|done|error","p":40}` |
| `rollback` | `{"ok":true,"rev":2,"crc":…}` |

## Ablauf einer Übertragung

1. Editor → `guition_studio/layout/apply` → Validierung (`layout.py`), Revision +1, Entwurf speichern
2. Kompilieren ins Geräteformat, Größenprüfung (≤ 32 768 Bytes)
3. `begin` → `chunk`×n → `commit`, dann Warten auf `ack` (20 s)
4. `ok` und CRC stimmt → gilt als bestätigt (`applied`), Zustandsabos neu, alle Zustände senden
5. Fehler: bis zu 3 Versuche mit Backoff. Schema-, JSON-, Versions- und Größenfehler werden nicht wiederholt. Das Display behält sein altes Layout.
6. `hello` mit abweichender CRC (z. B. nach Neu-Flash) → automatische erneute Übertragung

## Layoutformat im Editor (Schema 1)

```jsonc
{
  "schema": 1, "revision": 4,
  "settings": { "theme": "modern_dark", "brightness": 80, "standby_brightness": 10, "timeout": 60,
                "home_after": 0, "home_page": "p_…", "show_header": true, "show_dots": true, "swipe": true, "language": "de" },
  "pages": [{ "id": "p_…", "name": "Wohnzimmer", "background": null, "cols": 3, "rows": 3,
    "tiles": [{ "id": "t_…", "type": "light", "x": 0, "y": 1, "w": 1, "h": 1, "entity": "light.decke",
      "title": "Decke", "icon": "power", "format": "",
      "style": { "background": null, "color": null, "icon_color": null, "on_color": null, "on_text_color": null,
                 "font_size": "m", "radius": 16, "border_width": 0, "border_color": null, "opacity": 100 },
      "show_title": true, "show_state": true, "show_icon": true,
      "tap_action": { "action": "default" }, "hold_action": { "action": "none" },
      "visibility": [{ "entity": "sun.sun", "operator": "eq", "value": "below_horizon" }] }] }]
}
```

Grenzen: 10 Seiten, Raster 1×1 bis 6×6, 160 Kacheln, IDs `[A-Za-z0-9_-]{1,24}`, Titel ≤ 64 Zeichen.
Das **Geräteformat** (kompakte Schlüssel `v, rev, set, pages[].t[]`) erzeugt `compile_device_layout()`. Theme-Farben werden dabei bereits aufgelöst, sodass das Gerät nur fertige Farben erhält.

Die Geometrie (Kopfzeile 44 px, Punkte 22 px, Rand 8 px, Abstand 8 px, Ganzzahldivision) ist in `guition_studio.h`, `const.py` und `frontend/src/geometry.ts` identisch. Dadurch entspricht die Vorschau pixelgenau dem Display.
