import { sampleItems } from '../data/sample'
import Hero from '../ui/Hero'
import PosterCard from '../ui/PosterCard'
import Row from '../ui/Row'

export default function Home() {
  const watching = sampleItems.filter((i) => i.progress !== undefined)
  const films = sampleItems.filter((i) => i.kind === 'film')
  const series = sampleItems.filter((i) => i.kind === 'serie')

  return (
    <>
      <Hero item={sampleItems[0]} />
      <div className="-mt-10 relative z-10">
        <Row title="Continua a guardare">
          {watching.map((i) => (
            <PosterCard key={i.id} item={i} />
          ))}
        </Row>
        <Row title="Film">
          {films.map((i) => (
            <PosterCard key={i.id} item={i} />
          ))}
        </Row>
        <Row title="Serie TV">
          {series.map((i) => (
            <PosterCard key={i.id} item={i} />
          ))}
        </Row>
        <p className="px-4 text-xs text-cix-muted md:px-12">
          Titoli di esempio: i dati reali (locandine, trame, cast) arriveranno con l'integrazione TMDB.
        </p>
      </div>
    </>
  )
}
