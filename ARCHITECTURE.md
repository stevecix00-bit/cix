# Media Center PWA — Piano e architettura

Media center web installabile (PWA) per gestire e riprodurre video locali e remoti, con metadati di film/serie, tracking degli episodi e interfaccia originale.

## 1. Funzionalità (v1)

1. **Libreria**: film e serie TV in un unico posto, con filtri (da vedere, in corso, completati, preferiti).
2. **Fonti video**: file locali dal dispositivo e URL diretti inseriti dall'utente (mp4, webm, HLS .m3u8).
3. **Metadati**: locandina, trama, cast, valutazioni, stagioni/episodi da TMDB.
4. **Tracking**: sync con Trakt (cronologia, progresso episodi, watchlist).
5. **Player**: riprendi da dove eri, sottotitoli, velocità, Picture-in-Picture, tasti rapidi.
6. **Offline/PWA**: installabile, interfaccia e libreria disponibili offline.
7. **Interfaccia**: tema scuro in stile cinema, layout responsive (telefono, tablet, desktop).
8. **Lista canali automatica**: import di playlist M3U/M3U8 da URL indicato dall'utente, aggiornamento automatico a intervalli (6 ore – 7 giorni), gruppi, preferiti, ricerca e riproduzione HLS. Nessuna lista predefinita inclusa.

Fuori scope v1: download di video, scraping di siti di terze parti, liste di canali preinstallate, account propri con backend.

## 2. Stack

| Livello | Scelta | Note |
|---|---|---|
| UI | React + TypeScript + Vite | Veloce, ecosistema ampio |
| Stile | Tailwind CSS + design tokens | Tema e interfaccia facili da cambiare |
| Stato | Zustand | Leggero |
| Dati locali | IndexedDB con Dexie | Libreria, progressi, impostazioni |
| PWA | vite-plugin-pwa (Workbox) | Service worker, manifest, cache offline |
| Video | `<video>` + hls.js | HLS dove il browser non lo supporta nativamente |
| File locali | File System Access API (+ fallback `<input type="file">`) | Su iOS/Safari il supporto è limitato: solo fallback |
| Metadati | TMDB API | Serve chiave API e attribuzione nell'app |
| Tracking | Trakt API (OAuth) | Lo scambio token richiede il client secret |
| Proxy sottile | Cloudflare Workers (o Netlify Functions) | Nasconde chiavi TMDB/Trakt, gestisce OAuth |
| Hosting | GitHub Pages (frontend) | Deploy con GitHub Actions |
| Test | Vitest + Playwright | Unit e end-to-end |

## 3. Struttura del repository

```
/
├─ src/
│  ├─ app/            # routing, layout, provider
│  ├─ features/
│  │  ├─ library/     # griglia, filtri, ricerca
│  │  ├─ details/     # scheda film/serie, stagioni, episodi
│  │  ├─ player/      # player, sottotitoli, resume
│  │  ├─ sources/     # aggiunta file locali / URL
│  │  ├─ trakt/       # login, sync
│  │  └─ settings/
│  ├─ data/
│  │  ├─ db.ts        # schema Dexie
│  │  ├─ tmdb.ts      # client TMDB
│  │  └─ trakt.ts     # client Trakt
│  ├─ ui/             # componenti riusabili, design tokens, temi
│  └─ main.tsx
├─ worker/            # proxy (Cloudflare Worker): /tmdb/*, /trakt/oauth
├─ public/            # icone PWA, manifest
├─ e2e/
├─ .github/workflows/ # ci.yml, deploy.yml
├─ ARCHITECTURE.md
└─ README.md
```

## 4. Modello dati (IndexedDB)

- **MediaItem**: id, tipo (movie | show), tmdbId, titolo, anno, poster, trama, generi, stato (to_watch | watching | watched), preferito
- **Episode**: id, showId, stagione, numero, titolo, tmdbId, watched
- **Source**: id, mediaId/episodeId, tipo (local | url), uri o handle del file, mime, aggiunta il
- **Progress**: sourceId, posizione (s), durata (s), aggiornato il
- **Settings**: tema, lingua metadati, token Trakt, preferenze player

## 5. Flussi principali

1. **Aggiungere un titolo**: ricerca TMDB → scelta → salvataggio in IndexedDB con metadati e poster in cache.
2. **Collegare una fonte**: scegli file locale o incolla URL → associa a film/episodio → riproduzione.
3. **Riproduzione**: player carica la fonte, riprende da `Progress`, salva la posizione ogni pochi secondi, a fine video marca come visto e (se collegato) invia a Trakt.
4. **Login Trakt**: OAuth tramite il Worker, token salvato localmente; sync bidirezionale di cronologia e watchlist.

## 6. Limiti della PWA da conoscere

- Il browser non può leggere pagine di altri siti (CORS): funzionano URL diretti ai file video o a stream HLS che il server serve con CORS corretti. Per questo la v1 non include estrazione di link da pagine web.
- Su iOS i file locali non restano accessibili tra le sessioni come su Chrome/Android: l'utente deve riselezionarli.
- Codec e contenitori supportati (mkv, ecc.) dipendono dal browser.
- Se in futuro servono accesso completo al filesystem, codec extra o scansione di cartelle, il passaggio a un'app nativa o a un wrapper (Capacitor) è l'evoluzione naturale: l'architettura sopra è pensata per riusare quasi tutto il codice.

## 7. Roadmap a milestone

1. **M0 – Setup**: repo, Vite + React + TS, Tailwind, lint/format, CI, deploy su GitHub Pages.
2. **M1 – Shell e design system**: navigazione, temi, token grafici, componenti base, manifest PWA.
3. **M2 – Libreria e dati**: schema Dexie, integrazione TMDB (via Worker), ricerca, schede dettaglio.
4. **M3 – Fonti e player**: file locali, URL, HLS, resume, sottotitoli.
5. **M4 – Serie TV**: stagioni/episodi, stato visto, "prossimo episodio".
6. **M5 – Trakt**: OAuth, sync.
7. **M6 – Rifinitura**: offline, accessibilità, test e2e, performance.

## 8. Flusso di lavoro su GitHub

- Branch `main` protetto; sviluppo su branch `feat/...` con pull request.
- Un **issue per milestone** con checklist, raccolti in un GitHub Project (kanban).
- GitHub Actions: `ci.yml` (lint, test, build) su ogni PR; `deploy.yml` su merge in `main`.
- Segreti (chiavi TMDB/Trakt) solo nel Worker e nei secrets del repo, mai nel codice del frontend.

## 9. Note legali e di licenza

- L'app non fornisce né ospita contenuti: riproduce solo ciò che l'utente possiede o ha diritto di vedere.
- Nome, logo, grafica e codice devono essere originali: nessun asset o sorgente di Veezie.st.
- TMDB richiede attribuzione e il suo logo nell'app; Trakt richiede di registrare un'app e rispettare i suoi termini.
