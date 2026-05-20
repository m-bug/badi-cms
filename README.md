# Freibad Musterstadt — Beispiel-Website mit Decap CMS

Statische Website (HTML, CSS, Vanilla JS) mit Inhalten aus Markdown/YAML.  
Decap CMS schreibt Änderungen ins Git-Repository; Netlify baut bei jedem Push neu.

## Struktur

```
├── index.html              # Startseite mit allen Bereichen
├── css/  js/               # Darstellung & client-seitiges Laden
├── content/
│   ├── blog/               # Blog-Artikel (.md)
│   ├── events/             # Termine / Aktuelles (.md)
│   └── manifest.json       # Liste der sichtbaren .md-Dateien
├── data/
│   ├── opening-hours.yml
│   └── restaurant.yml
├── static/uploads/         # PDFs, Bilder (Speisekarte)
└── admin/                  # Decap CMS (/admin/)
```

## Lokal ansehen

`fetch()` funktioniert nicht über `file://` — ein lokaler Webserver ist nötig:

```bash
cd /pfad/zu/sample-cms
python3 -m http.server 8080
```

Dann im Browser: http://localhost:8080

## CMS lokal testen (optional)

Terminal 1 — Website:

```bash
python3 -m http.server 8080
```

Terminal 2 — Decap Proxy (schreibt in lokale Dateien):

```bash
npx decap-server
```

Im Browser: http://localhost:8080/admin/

`admin/config.yml` hat `local_backend: true` für diesen Modus. Für Produktion auf Netlify Git Gateway nutzen (siehe unten).

## Netlify + Decap (Produktion)

1. Repository auf GitHub/GitLab anlegen und diesen Ordner pushen.
2. In [Netlify](https://www.netlify.com/) neues Site aus dem Repo verbinden — **Build command** leer lassen, **Publish directory**: `.` (steht in `netlify.toml`).
3. **Identity** aktivieren → **Registration**: Invite only (empfohlen).
4. **Identity → Services → Git Gateway** aktivieren.
5. In `admin/config.yml` optional `backend.repo` setzen, falls nötig (bei Git Gateway meist nicht).
6. Mitarbeiter unter Identity → Invite users einladen.
7. CMS: `https://deine-site.netlify.app/admin/`

### Einloggen (nach Einladung)

1. Einladungs-E-Mail öffnen → Link klicken → du landest auf der **Startseite** mit `#invite_token=…` in der URL.
2. Es öffnet sich ein **Netlify-Dialog** zum Passwort setzen (dafür muss `netlify-identity-widget.js` in `index.html` geladen sein — ist im Repo so eingebaut).
3. Nach dem Speichern wirst du automatisch zu **`/admin/`** weitergeleitet.
4. Später: **`https://deine-site.netlify.app/admin/`** → **Login** → E-Mail + Passwort.

**Kein Dialog nach Klick auf den Einladungs-Link?** Meist fehlt das Identity-Widget auf der Startseite (nur unter `/admin/` reicht nicht). Einmal deployen, Link aus der Mail erneut öffnen. In der Adresszeile sollte `#invite_token=` stehen.

Passwort vergessen: Login-Maske → **Recover password**.

Voraussetzungen in Netlify: **Identity enabled**, **Git Gateway** aktiv, Registration z. B. **Invite only**.

Nach **Publish** im CMS: Commit ins Repo → Netlify Deploy automatisch.

## Neuen Blog-Artikel oder Termin anlegen

1. Im CMS Collection **Blog** oder **Aktuelles / Termine** → **New** → ausfüllen → **Publish**.
2. Unter **Seitendaten → Inhaltsverzeichnis** den neuen **Dateinamen** eintragen (z. B. `mein-artikel.md`), sonst erscheint der Beitrag nicht auf der Startseite.
3. Entwürfe: Feld **Entwurf** aktiv lassen — Blog-Artikel werden dann nicht angezeigt.

## Speisekarte (PDF)

Im CMS unter **Restaurant** die PDF hochladen oder in `static/uploads/` ablegen und Pfad in `data/restaurant.yml` setzen (z. B. `/static/uploads/speisekarte.pdf`).

## Technik-Hinweise

- Markdown wird im Browser mit [marked](https://marked.js.org/) gerendert.
- YAML/JSON mit [js-yaml](https://github.com/nodeca/js-yaml) (CDN).
- Kein Build-Schritt — für sehr viele Artikel wäre später ein Static-Site-Generator sinnvoll.

## Lizenz

Beispielprojekt — frei verwendbar.
