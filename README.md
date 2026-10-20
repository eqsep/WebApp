# Date-Seite

Kleine statische Website (HTML, CSS, JavaScript), gehostet über GitHub Pages.

## Dateien
- `index.html` – Struktur der Seite
- `style.css` – Design
- `script.js` – Logik und Einstellungen (Namen, Menü, ntfy-Topic ganz oben)
- `.nojekyll` – sagt GitHub Pages, die Dateien unverändert auszuliefern

## Lokal testen
In VS Code die Erweiterung "Live Server" installieren, dann Rechtsklick auf `index.html` → "Open with Live Server".

## Veröffentlichen
1. Änderungen committen und mit `git push` nach GitHub schicken.
2. Im Repo: Settings → Pages → Source: "Deploy from a branch" → Branch `main`, Ordner `/ (root)` → Save.
3. Nach ca. 1 Minute ist die Seite unter `https://DEIN-USERNAME.github.io/REPO-NAME/` erreichbar.
