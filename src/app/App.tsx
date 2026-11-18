import { useEffect } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { refreshStalePlaylists } from '../features/channels/playlists'
import Channels from '../pages/Channels'
import Home from '../pages/Home'
import Search from '../pages/Search'
import Settings from '../pages/Settings'
import Layout from './Layout'

export default function App() {
  // Aggiornamento automatico delle liste canali: all'avvio e ogni 30 minuti
  // (aggiorna solo le liste più vecchie dell'intervallo scelto dall'utente).
  useEffect(() => {
    void refreshStalePlaylists()
    const timer = setInterval(() => void refreshStalePlaylists(), 30 * 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="canali" element={<Channels />} />
          <Route path="cerca" element={<Search />} />
          <Route path="impostazioni" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
