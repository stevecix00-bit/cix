import { useEffect, useRef, useState } from 'react'
import type { Channel } from '../../data/db'

interface Props {
  channel: Channel
  onClose: () => void
}

export default function ChannelPlayer({ channel, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let hls: { destroy: () => void } | null = null
    let cancelled = false
    setError(null)

    const url = channel.url
    const isHls = /\.m3u8(\?|$)/i.test(url)
    const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') !== ''

    if (isHls && !nativeHls) {
      import('hls.js').then(({ default: Hls }) => {
        if (cancelled) return
        if (!Hls.isSupported()) {
          setError('Formato non supportato da questo browser')
          return
        }
        const instance = new Hls()
        hls = instance
        instance.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            setError('Impossibile riprodurre il canale: stream non raggiungibile o bloccato dal browser')
          }
        })
        instance.loadSource(url)
        instance.attachMedia(video)
        void video.play().catch(() => undefined)
      })
    } else {
      video.src = url
      void video.play().catch(() => undefined)
    }

    return () => {
      cancelled = true
      hls?.destroy()
      video.removeAttribute('src')
      video.load()
    }
  }, [channel.url])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95" role="dialog" aria-modal="true" aria-label={channel.name}>
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold">{channel.name}</h2>
          {channel.group && <p className="truncate text-xs text-cix-muted">{channel.group}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded bg-white/15 px-4 py-1.5 text-sm font-semibold hover:bg-white/25"
        >
          Chiudi
        </button>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <video
          ref={videoRef}
          className="max-h-full w-full"
          controls
          autoPlay
          playsInline
          onError={() => setError('Impossibile riprodurre il canale')}
        />
        {error && (
          <p className="absolute inset-x-6 rounded bg-cix-surface p-4 text-center text-sm text-cix-muted">{error}</p>
        )}
      </div>
    </div>
  )
}
