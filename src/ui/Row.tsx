import type { ReactNode } from 'react'

export default function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-4 text-base font-semibold md:px-12 md:text-lg">{title}</h2>
      <div className="no-scrollbar flex snap-x gap-2 overflow-x-auto px-4 py-2 md:px-12">{children}</div>
    </section>
  )
}
