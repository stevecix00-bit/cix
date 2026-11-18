# CIX

Media center web (PWA) con interfaccia scura: libreria di film e serie TV, lista canali da playlist M3U con aggiornamento automatico, player integrato. Piano completo in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Stato

- M0 – Setup: fatto (Vite, React, TypeScript, Tailwind, PWA, CI, deploy su GitHub Pages)
- M1 – Interfaccia e design system: fatto (navigazione, tema scuro, logo, home con hero e righe, ricerca, impostazioni)
- Lista canali: import di playlist M3U/M3U8 da URL, aggiornamento automatico (6 ore – 7 giorni), gruppi, preferiti, ricerca, player HLS
- Prossimi: M2 (TMDB), M3 (fonti video e player), M4 (serie), M5 (Trakt), M6 (rifinitura)

## Avvio

```bash
npm install
npm run dev        # sviluppo
npm run typecheck
npm test
npm run build
```

## Liste canali

CIX non include né distribuisce liste di canali: l'utente aggiunge dalla pagina **Canali** l'indirizzo di una propria playlist M3U/M3U8. La lista viene riscaricata da sola quando è più vecchia dell'intervallo scelto (controllo all'avvio e ogni 30 minuti).

Se il server della lista non invia gli header CORS il browser blocca il download. In quel caso:

1. pubblica `worker/proxy.js` come Cloudflare Worker con la variabile `ALLOWED_ORIGIN` = indirizzo dell'app;
2. imposta `VITE_PROXY_URL` con l'indirizzo del Worker prima della build.

Anche i flussi video devono essere raggiungibili dal browser: da una pagina https non si riproducono flussi http (blocco "mixed content").

## Deploy su GitHub Pages

1. Crea il repo e carica questi file in `main`.
2. In **Settings → Pages** scegli **GitHub Actions** come sorgente.
3. Ogni push su `main` esegue `deploy.yml`.
4. Dopo il primo `npm install` committa `package-lock.json`.

## Identità grafica

Colori in `tailwind.config.js` (`cix.*`), logo in `src/ui/Logo.tsx` e `public/`. Logo, nome e interfaccia sono originali.

## Note legali

CIX non fornisce né ospita contenuti: riproduci solo ciò che possiedi o che hai il diritto di vedere. Questo prodotto usa l'API di TMDB ma non è approvato né certificato da TMDB.
