import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-cix-line bg-cix-surface p-4">
      <h2 className="mb-1 text-base font-semibold">{title}</h2>
      <div className="text-sm text-cix-muted">{children}</div>
    </section>
  )
}

export default function Settings() {
  return (
    <div className="px-4 pt-20 md:px-12 md:pt-24">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Impostazioni</h1>
      <div className="grid max-w-3xl gap-3">
        <Card title="Aspetto">Tema scuro.</Card>
        <Card title="Liste canali">
          Aggiungi e aggiorna le tue playlist M3U dalla pagina{' '}
          <Link to="/canali" className="text-cix-text underline">
            Canali
          </Link>
          .
        </Card>
        <Card title="Trakt">Non collegato. La sincronizzazione arriverà nella milestone M5.</Card>
        <Card title="Informazioni">
          CIX non fornisce né ospita contenuti. Riproduci solo ciò che possiedi o che hai il diritto di vedere. Questo
          prodotto usa l'API di TMDB ma non è approvato né certificato da TMDB.
        </Card>
      </div>
    </div>
  )
}
