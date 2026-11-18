import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, type Channel } from '../data/db'
import ChannelPlayer from '../features/channels/ChannelPlayer'
import {
  addPlaylist,
  refreshPlaylist,
  removePlaylist,
  setRefreshHours,
  toggleFavorite,
} from '../features/channels/playlists'

const PAGE = 120

function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export default function Channels() {
  const playlists = useLiveQuery(() => db.playlists.toArray(), [])
  const channels = useLiveQuery(() => db.channels.toArray(), [])

  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('Tutti')
  const [onlyFav, setOnlyFav] = useState(false)
  const [limit, setLimit] = useState(PAGE)
  const [active, setActive] = useState<Channel | null>(null)
  const [showLists, setShowLists] = useState(false)

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const groups = useMemo(() => {
    const set = new Set<string>()
    channels?.forEach((c) => c.group && set.add(c.group))
    return ['Tutti', ...[...set].sort((a, b) => a.localeCompare(b, 'it'))]
  }, [channels])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (channels ?? []).filter(
      (c) =>
        (group === 'Tutti' || c.group === group) &&
        (!onlyFav || c.favorite) &&
        (!q || c.name.toLowerCase().includes(q)),
    )
  }, [channels, group, onlyFav, query])

  if (playlists === undefined || channels === undefined) return null

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!isHttpUrl(trimmed)) {
      setFormError("Inserisci un indirizzo valido che inizi con http:// o https://")
      return
    }
    setFormError(null)
    setBusy(true)
    await addPlaylist(name.trim() || 'La mia lista', trimmed)
    setBusy(false)
    setName('')
    setUrl('')
    setShowLists(false)
  }

  const noLists = playlists.length === 0

  return (
    <div className="px-4 pt-20 md:px-12 md:pt-24">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold md:text-3xl">Canali</h1>
        {!noLists && (
          <button
            type="button"
            onClick={() => setShowLists((v) => !v)}
            className="rounded bg-white/15 px-4 py-1.5 text-sm font-semibold hover:bg-white/25"
          >
            {showLists ? 'Chiudi liste' : 'Gestisci liste'}
          </button>
        )}
      </div>

      {(noLists || showLists) && (
        <section className="mb-6 rounded-lg border border-cix-line bg-cix-surface p-4">
          {noLists && (
            <p className="mb-3 text-sm text-cix-muted">
              Aggiungi l'indirizzo di una playlist M3U/M3U8 di cui hai i diritti. CIX scarica i canali e li tiene
              aggiornati da solo; non include alcuna lista predefinita.
            </p>
          )}
          <form onSubmit={onSubmit} className="flex flex-col gap-2 md:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome (facoltativo)"
              aria-label="Nome della lista"
              className="rounded border border-cix-line bg-cix-raised px-3 py-2 text-sm md:w-56"
            />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://esempio.it/lista.m3u"
              aria-label="Indirizzo della lista M3U"
              inputMode="url"
              className="flex-1 rounded border border-cix-line bg-cix-raised px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded bg-cix-accent px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {busy ? 'Scarico…' : 'Aggiungi'}
            </button>
          </form>
          {formError && <p className="mt-2 text-sm text-cix-accent">{formError}</p>}

          {!noLists && (
            <ul className="mt-4 divide-y divide-cix-line">
              {playlists.map((p) => (
                <li key={p.id} className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="truncate text-xs text-cix-muted">{p.url}</p>
                    {p.error ? (
                      <p className="text-xs text-cix-accent">{p.error}</p>
                    ) : (
                      <p className="text-xs text-cix-muted">
                        {p.updatedAt
                          ? `Aggiornata il ${new Date(p.updatedAt).toLocaleString('it-IT')}`
                          : 'In attesa del primo aggiornamento'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <label className="flex items-center gap-1 text-cix-muted">
                      Aggiorna ogni
                      <select
                        value={p.refreshHours}
                        onChange={(e) => void setRefreshHours(p.id, Number(e.target.value))}
                        className="rounded border border-cix-line bg-cix-raised px-2 py-1 text-cix-text"
                      >
                        {[6, 12, 24, 72, 168].map((h) => (
                          <option key={h} value={h}>
                            {h < 48 ? `${h} ore` : `${h / 24} giorni`}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => void refreshPlaylist(p.id)}
                      className="rounded bg-white/15 px-3 py-1 hover:bg-white/25"
                    >
                      Aggiorna ora
                    </button>
                    <button
                      type="button"
                      onClick={() => void removePlaylist(p.id)}
                      className="rounded bg-white/15 px-3 py-1 hover:bg-white/25"
                    >
                      Rimuovi
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {channels.length > 0 && (
        <>
          <div className="mb-4 flex flex-col gap-2 md:flex-row">
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setLimit(PAGE)
              }}
              placeholder="Cerca un canale"
              aria-label="Cerca un canale"
              className="rounded border border-cix-line bg-cix-surface px-3 py-2 text-sm md:w-72"
            />
            <select
              value={group}
              onChange={(e) => {
                setGroup(e.target.value)
                setLimit(PAGE)
              }}
              aria-label="Filtra per gruppo"
              className="rounded border border-cix-line bg-cix-surface px-3 py-2 text-sm"
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-cix-muted">
              <input type="checkbox" checked={onlyFav} onChange={(e) => setOnlyFav(e.target.checked)} />
              Solo preferiti
            </label>
          </div>

          <p className="mb-2 text-xs text-cix-muted">{filtered.length} canali</p>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {filtered.slice(0, limit).map((c) => (
              <li key={c.id} className="relative overflow-hidden rounded-md bg-cix-surface">
                <button
                  type="button"
                  onClick={() => setActive(c)}
                  className="block w-full text-left transition hover:bg-cix-raised"
                >
                  <span className="flex aspect-video items-center justify-center bg-cix-raised p-2">
                    {c.logo ? (
                      <img
                        src={c.logo}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                  </span>
                  <span className="block p-2">
                    <span className="block truncate text-sm font-semibold">{c.name}</span>
                    <span className="block truncate text-xs text-cix-muted">{c.group ?? ' '}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => void toggleFavorite(c.id, !c.favorite)}
                  aria-label={c.favorite ? `Rimuovi ${c.name} dai preferiti` : `Aggiungi ${c.name} ai preferiti`}
                  aria-pressed={c.favorite}
                  className={`absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-sm ${
                    c.favorite ? 'text-cix-accent' : 'text-cix-muted'
                  }`}
                >
                  {c.favorite ? '★' : '☆'}
                </button>
              </li>
            ))}
          </ul>

          {filtered.length > limit && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + PAGE)}
                className="rounded bg-white/15 px-5 py-2 text-sm font-semibold hover:bg-white/25"
              >
                Mostra altri
              </button>
            </div>
          )}
        </>
      )}

      {active && <ChannelPlayer channel={active} onClose={() => setActive(null)} />}
    </div>
  )
}
