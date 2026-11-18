import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Wordmark } from '../ui/Logo'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/canali', label: 'Canali', end: false },
  { to: '/cerca', label: 'Cerca', end: false },
  { to: '/impostazioni', label: 'Impostazioni', end: false },
]

export default function Layout() {
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-dvh">
      <header
        className={`fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-8 px-4 transition-colors duration-300 md:h-16 md:px-12 ${
          solid ? 'bg-cix-bg/95 backdrop-blur' : 'bg-gradient-to-b from-black/70 to-transparent'
        }`}
      >
        <Link to="/" aria-label="CIX, vai alla home" className="text-cix-text">
          <Wordmark className="h-7 w-auto md:h-8" />
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Principale">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm transition-colors hover:text-cix-text ${
                  isActive ? 'font-semibold text-cix-text' : 'text-cix-muted'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="pb-24 md:pb-12">
        <Outlet />
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-cix-line bg-cix-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Principale"
      >
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `py-3 text-center text-xs ${isActive ? 'font-semibold text-cix-text' : 'text-cix-muted'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
