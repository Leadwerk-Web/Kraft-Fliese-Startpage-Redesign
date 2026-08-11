/* ============================================================
   Wohnideen-Import: Originale -> webfertige JPGs
   ============================================================
   Die Originale aus dem OneDrive-Ordner
     Kunden/kraft fliesen/Wohnideen
   sind gemischt (JPG, TIFF, WebP) und teils sehr gross
   (bis ~178 MB). Browser koennen TIFF nicht darstellen, deshalb
   ist die Konvertierung Pflicht, nicht nur Optimierung.

   Dieses Skript nimmt alle Dateien, deren Name eine Zahl ist
   (1.jpg, 18.tif, 61.webp ...), skaliert sie auf Webgroesse und
   schreibt sie als <id>.webp nach V62/assets/images/wohnideen/.

   WebP statt JPEG: bei Fotos ist echtes verlustfreies WebP meist
   groesser als ein JPEG aehnlicher Qualitaet, deshalb wird hier
   mit hoher, optisch verlustfreier Qualitaet (86) komprimiert.
   Fuer echtes lossless: QUALITAET_MODUS auf 'lossless' setzen,
   Dateien werden dann spuerbar groesser.

   Aufruf:
     node tools/wohnideen-import.js "<Quellordner>"

   Beispiel (nachdem der OneDrive-Ordner lokal verfuegbar ist):
     node tools/wohnideen-import.js "$env:USERPROFILE\OneDrive\Kunden\kraft fliesen\Wohnideen"
   ============================================================ */

const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const ZIEL = path.join(REPO, 'V62', 'assets', 'images', 'wohnideen');
const MAX_BREITE = 1600;
const QUALITAET = 86;
const QUALITAET_MODUS = 'lossy'; // 'lossy' (empfohlen fuer Fotos) oder 'lossless'

// sharp liegt in V61/node_modules und wird von dort geladen
let sharp;
try {
    sharp = require(path.join(REPO, 'V61', 'node_modules', 'sharp'));
} catch (err) {
    console.error('sharp nicht gefunden. Erwartet unter V61/node_modules/sharp.');
    console.error('Falls noetig: cd V61 && npm install sharp');
    process.exit(1);
}

const quelle = process.argv[2];
if (!quelle) {
    console.error('Kein Quellordner angegeben.');
    console.error('Aufruf: node tools/wohnideen-import.js "<Quellordner>"');
    process.exit(1);
}
if (!fs.existsSync(quelle)) {
    console.error('Quellordner existiert nicht: ' + quelle);
    process.exit(1);
}

fs.mkdirSync(ZIEL, { recursive: true });

// Pro id nur eine Datei verarbeiten, falls es 7.jpg und 7.tif gaebe
const proId = new Map();
for (const name of fs.readdirSync(quelle)) {
    const basis = path.basename(name, path.extname(name));
    if (!/^\d{1,3}$/.test(basis)) continue;
    const id = parseInt(basis, 10);
    if (id < 1 || id > 100) continue;
    if (!proId.has(id)) proId.set(id, name);
}

const ids = [...proId.keys()].sort((a, b) => a - b);
console.log(ids.length + ' Quelldateien gefunden, Ziel: ' + ZIEL);

let ok = 0;
const fehler = [];

(async () => {
    for (const id of ids) {
        const von = path.join(quelle, proId.get(id));
        const nach = path.join(ZIEL, id + '.webp');
        try {
            const info = await sharp(von, { limitInputPixels: false })
                .rotate()
                .resize({ width: MAX_BREITE, withoutEnlargement: true })
                .webp(QUALITAET_MODUS === 'lossless'
                    ? { lossless: true, effort: 6 }
                    : { quality: QUALITAET, effort: 6 })
                .toFile(nach);
            ok++;
            const kb = Math.round(info.size / 1024);
            console.log('  ' + String(id).padStart(3) + '  ' + proId.get(id).padEnd(12) + ' -> ' + id + '.webp (' + kb + ' KB)');
        } catch (err) {
            fehler.push({ id: id, datei: proId.get(id), grund: err.message });
            console.error('  ' + String(id).padStart(3) + '  FEHLER bei ' + proId.get(id) + ': ' + err.message);
        }
    }

    console.log('\nFertig: ' + ok + ' von ' + ids.length + ' konvertiert.');

    const fehlend = [];
    for (let i = 1; i <= 100; i++) {
        if (!fs.existsSync(path.join(ZIEL, i + '.webp'))) fehlend.push(i);
    }
    if (fehlend.length) {
        console.log('Es fehlen noch die Bilder: ' + fehlend.join(', '));
    } else {
        console.log('Alle 100 Wohnideen-Bilder liegen bereit.');
    }
    if (fehler.length) process.exitCode = 1;
})();
