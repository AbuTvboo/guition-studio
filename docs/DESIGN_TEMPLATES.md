# Designvorlagen

Ab Version 0.5.29 unterstützen Editor und Display Raumhintergründe, Helligkeitsringe und Raumkarten mit mehreren Gerätezeilen. Dafür die Integration **und die Display-Firmware** auf mindestens 0.5.29 aktualisieren.

1. Unter **Vorlagen** eines der acht Designs übernehmen.
2. Im Designer die gewünschten Home-Assistant-Entitäten zuordnen. Vorlagen enthalten bewusst keine fremden Entity-IDs oder fest eingebrannten Zustände.
3. Bei **Raumkarten bunt** und **Bunt verspielt** die Raumkarte auswählen und bis zu vier Geräte hinzufügen. Jede Zeile zeigt den eigenen Zustand. Antippen bedient genau dieses Gerät; Sensorzeilen lösen keine Aktion aus.
4. Bei **Neon Dimmer** und **Cyan Glow** dem Ring eine Licht-Entität zuordnen. Den Ring ziehen, um die Helligkeit einzustellen; Tippen in die Mitte schaltet das Licht.
5. Szenen und globale Aktionen wie „Alles aus“ mit den eigenen Szenen, Skripten oder Gruppen verbinden. Anschließend **Auf Display übertragen** wählen.

Im Designer lassen sich unter **Raumhintergrund** acht Motive auswählen. Bei Dimmern bietet **Helligkeitsregler** die Wahl zwischen Schieberegler und Leuchtring. Mehrgeräte-Kacheln können unter **Gerätedarstellung** zwischen Wisch-Kachel und Raumkarte wechseln.

Die Vorlagen sind für 480 × 480 Pixel angepasst: Schrift, Icons und Anordnung können von den hochauflösenden Designreferenzen abweichen. Die Raumillustrationen enthalten keine Bedienelemente; Werte, Beschriftungen und Aktionen werden zur Laufzeit dargestellt. Die Bilder liegen in der Firmware, externe Bilddienste werden nicht benötigt.

Die Raumkarten des Designs „Raumkarten bunt“ öffnen per langem Druck die vorhandenen Detailseiten für Wohnzimmer, Küche und Büro. Die darin enthaltenen Kacheln ebenfalls mit Entitäten belegen.
