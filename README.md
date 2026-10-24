# Date-Seite

Kleine statische Website (HTML, CSS, JavaScript), gehostet über GitHub Pages.

## Dateien
- `index.html` – Struktur der Seite
- `style.css` – Design
- `script.js` – Logik und Einstellungen (Namen, Menü, ntfy-Topic ganz oben)
- `.nojekyll` – sagt GitHub Pages, die Dateien unverändert auszuliefern

## Automatische Mail einrichten (Web3Forms)
1. Auf https://web3forms.com die eigene E-Mail-Adresse eintragen und "Create Access Key" klicken.
2. Den Key aus der Bestätigungsmail kopieren und in `script.js` bei `WEB3FORMS_KEY` einfügen.
3. Der Key darf öffentlich im Code stehen, er kann nur Mails an deine Adresse auslösen.
4. Optional: `NTFY_TOPIC` füllen, dann kommt zusätzlich eine Push-Nachricht aufs Handy.

## Lokal testen
In VS Code die Erweiterung "Live Server" installieren, dann Rechtsklick auf `index.html` → "Open with Live Server".

## Veröffentlichen
1. Änderungen committen und mit `git push` nach GitHub schicken.
2. Im Repo: Settings → Pages → Source: "Deploy from a branch" → Branch `main`, Ordner `/ (root)` → Save.
3. Nach ca. 1 Minute ist die Seite unter `https://DEIN-USERNAME.github.io/REPO-NAME/` erreichbar.

## Personalisierte Links
- `https://eqsep.github.io/WebApp/Anna` zeigt überall "Anna" (leitet über `404.html` auf `?n=Anna` um und stellt die schöne Adresse wieder her).
- Funktioniert auch direkt: `https://eqsep.github.io/WebApp/?n=Anna`.
- Ohne Namen erscheint der Fallback aus `CONFIG.SIE` ("Gast").
- Der Name steht außerdem im Betreff der Bestell-Mail, so siehst du, wer bestellt hat.
- Wichtig: `404.html` muss im Hauptordner des Repos liegen. `REPO` darin muss genau so heißen wie dein Repo.
