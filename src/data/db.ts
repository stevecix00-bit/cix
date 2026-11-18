import Dexie, { type EntityTable } from 'dexie'

export interface MediaItem {
  id: number
  kind: 'movie' | 'show'
  tmdbId?: number
  title: string
  year?: number
  poster?: string
  overview?: string
  status: 'to_watch' | 'watching' | 'watched'
  favorite: boolean
}

export interface Episode {
  id: number
  showId: number
  season: number
  number: number
  title?: string
  tmdbId?: number
  watched: boolean
}

export interface Source {
  id: number
  mediaId: number
  episodeId?: number
  type: 'local' | 'url'
  uri?: string
  handle?: FileSystemFileHandle
  mime?: string
  addedAt: number
}

export interface Progress {
  sourceId: number
  position: number
  duration: number
  updatedAt: number
}

/** Lista canali importata da un URL M3U/M3U8 fornito dall'utente. */
export interface Playlist {
  id: number
  name: string
  url: string
  /** Ogni quante ore aggiornare automaticamente la lista. */
  refreshHours: number
  updatedAt?: number
  error?: string
}

export interface Channel {
  id: number
  playlistId: number
  name: string
  url: string
  logo?: string
  group?: string
  tvgId?: string
  favorite: boolean
}

export const db = new Dexie('cix') as Dexie & {
  media: EntityTable<MediaItem, 'id'>
  episodes: EntityTable<Episode, 'id'>
  sources: EntityTable<Source, 'id'>
  progress: EntityTable<Progress, 'sourceId'>
  playlists: EntityTable<Playlist, 'id'>
  channels: EntityTable<Channel, 'id'>
}

db.version(1).stores({
  media: '++id, tmdbId, kind, status',
  episodes: '++id, showId, [showId+season+number]',
  sources: '++id, mediaId, episodeId',
  progress: 'sourceId, updatedAt',
  playlists: '++id',
  channels: '++id, playlistId, group, name',
})
