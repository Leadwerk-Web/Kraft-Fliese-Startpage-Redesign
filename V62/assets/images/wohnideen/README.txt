WOHNIDEEN – Bildablage
======================

Status: befuellt (11.08.2026). Alle 100 Bilder liegen hier als
<id>.webp, erzeugt aus Tims OneDrive-Ordner
"Kunden/kraft fliesen/Wohnideen" (Original: 776 MB, gemischt aus
JPG/TIFF/WebP) via tools/wohnideen-import.js.

Benennung: <Bild Dateiname aus der Excel>.webp
Also 1.webp, 2.webp, 3.webp ... 100.webp

Die Zuordnung Bild -> Titel/Untertitel/Produkte/Filter steht in
  assets/data/wohnideen.js
und stammt aus "Wohnideen Datenliste.xlsx" (Tim Kraft, 06.07.2026).

Format: verlustbehaftetes WebP, Qualitaet 86, max. 1600 px Breite.
Echtes lossless WebP wuerde bei Fotos deutlich groesser als JPEG
ausfallen, daher bewusst hohe Qualitaet statt echtem Lossless.
Ergebnis: 776 MB Originale -> 24,9 MB WebP.

Zwei Bilder (6.tif, 10.tif) sprengten libvips' TIFF-Speicherlimit
beim direkten Import; sie wurden vorab per .NET/System.Drawing nach
JPEG vorkonvertiert und liefen dann normal durchs Skript.

Sollen die Bilder erneut aus einer neuen Quelle importiert werden:
  node tools/wohnideen-import.js "<Quellordner>"
Fehlende Dateien zeigt die Galerie automatisch als schraffierten
Platzhalter mit Bildnummer, sobald eine Datei fehlt.
