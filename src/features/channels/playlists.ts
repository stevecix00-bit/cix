import { db } from '../../data/db'
import { parseM3U } from './m3u'

/**
 * Se il server della lista non invia gli header CORS, il browser blocca la richiesta.
 * In quel caso si può impostare VITE_PROXY_URL con l'indirizzo del proxy sottile (vedi worker/).
 */
function fetchUrl(url: string): string {
  const proxy = String(import.meta.env.VITE_PROXY_URL ?? '')
  return proxy ? `${proxy}?url=${encodeURIComponent(url)}` : url
}

export async function refreshPlaylist(id: number): Promise<void> {
  const playlist = await db.playlists.get(id)
  if (!playlist) return
  try {
    const res = await fetch(fetchUrl(playlist.url))
    if (!res.ok) throw new Error(`Errore HTTP ${res.status}`)
    const parsed = parseM3U(await res.text())
    if (parsed.length === 0) throw new Error('Nessun canale trovato nella lista')

    const favorites = new Set(
      (await db.channels.where('playlistId').equals(id).filter((c) => c.favorite).toArray()).map((c) => c.url),
    )
    await db.transaction('rw', db.channels, db.playlists, async () => {
      await db.channels.where('playlistId').equals(id).delete()
      await db.channels.bulkAdd(parsed.map((c) => ({ ...c, playlistId: id, favorite: favorites.has(c.url) })))
      await db.playlists.update(id, { updatedAt: Date.now(), error: undefined })
    })
  } catch (e) {
    const message =
      e instanceof TypeError
        ? 'Impossibile scaricare la lista (indirizzo errato oppure bloccato dal browser)'
        : e instanceof Error
          ? e.message
          : 'Errore sconosciuto'
    await db.playlists.update(id, { error: message })
  }
}

export async function addPlaylist(name: string, url: string, refreshHours = 24): Promise<number> {
  const id = await db.playlists.add({ name, url, refreshHours })
  await refreshPlaylist(id)
  return id
}

export async function removePlaylist(id: number): Promise<void> {
  await db.transaction('rw', db.channels, db.playlists, async () => {
    await db.channels.where('playlistId').equals(id).delete()
    await db.playlists.delete(id)
  })
}

export async function setRefreshHours(id: number, hours: number): Promise<void> {
  await db.playlists.update(id, { refreshHours: hours })
}

export async function toggleFavorite(channelId: number, value: boolean): Promise<void> {
  await db.channels.update(channelId, { favorite: value })
}

/** Aggiorna le liste mai scaricate o più vecchie del proprio intervallo. */
export async function refreshStalePlaylists(): Promise<void> {
  const now = Date.now()
  const all = await db.playlists.toArray()
  const stale = all.filter((p) => !p.updatedAt || now - p.updatedAt > p.refreshHours * 3_600_000)
  await Promise.all(stale.map((p) => refreshPlaylist(p.id)))
}
