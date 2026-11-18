import type { SampleItem } from '../data/sample'

export default function Hero({ item }: { item: SampleItem }) {
  return (
    <section
      className="relative flex min-h-[62dvh] items-end overflow-hidden md:min-h-[78dvh]"
      style={{
        background: `radial-gradient(120% 90% at 75% 15%, hsl(${item.hue} 65% 34%), hsl(${(item.hue + 40) % 360} 55% 10%) 70%)`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-cix-bg via-cix-bg/30 to-transparent" />
      <div className="relative w-full max-w-2xl px-4 pb-10 md:px-12 md:pb-20">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-cix-accent">In evidenza</p>
        <h1 className="text-4xl font-extrabold leading-none md:text-6xl">{item.title}</h1>
        <p className="mt-3 text-sm text-cix-text/90 md:text-base">{item.overview}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            className="rounded bg-cix-text px-6 py-2 text-sm font-semibold text-black transition hover:bg-white"
          >
            ▶ Riproduci
          </button>
          <button
            type="button"
            className="rounded bg-white/20 px-6 py-2 text-sm font-semibold backdrop-blur transition hover:bg-white/30"
          >
            Altre info
          </button>
        </div>
      </div>
    </section>
  )
}
