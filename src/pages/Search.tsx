import { useState } from 'react'
import { sampleItems } from '../data/sample'
import PosterCard from '../ui/PosterCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = q ? sampleItems.filter((i) => i.title.toLowerCase().includes(q)) : sampleItems

  return (
    <div className="px-4 pt-20 md:px-12 md:pt-24">
      <h1 className="mb-4 text-2xl font-bold md:text-3xl">Cerca</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Film, serie TV…"
        aria-label="Cerca film e serie TV"
        className="mb-6 w-full rounded border border-cix-line bg-cix-surface px-4 py-3 text-base md:max-w-xl"
      />
      {results.length === 0 ? (
        <p className="text-sm text-cix-muted">Nessun risultato.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6">
          {results.map((i) => (
            <PosterCard key={i.id} item={i} className="w-full" />
          ))}
        </div>
      )}
    </div>
  )
}
