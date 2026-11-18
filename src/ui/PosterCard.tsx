import type { SampleItem } from '../data/sample'

interface Props {
  item: SampleItem
  className?: string
}

export default function PosterCard({ item, className = 'w-36 sm:w-44' }: Props) {
  return (
    <button
      type="button"
      aria-label={`${item.title}, ${item.kind}, ${item.year}`}
      className={`group relative aspect-[2/3] shrink-0 snap-start overflow-hidden rounded-md text-left transition duration-200 hover:z-10 hover:scale-105 focus-visible:scale-105 ${className}`}
      style={{
        background: `linear-gradient(160deg, hsl(${item.hue} 60% 38%), hsl(${(item.hue + 40) % 360} 55% 14%))`,
      }}
    >
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2 pb-3 pt-10">
        <span className="block text-sm font-semibold leading-tight">{item.title}</span>
        <span className="block text-xs capitalize text-cix-muted">
          {item.year} · {item.kind}
        </span>
      </span>
      {item.progress !== undefined && (
        <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
          <span className="block h-full bg-cix-accent" style={{ width: `${item.progress}%` }} />
        </span>
      )}
    </button>
  )
}
