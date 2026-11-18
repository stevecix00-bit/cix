/** Logo CIX (originale): una "C" aperta con il simbolo play, e il wordmark con la "X" in accento. */

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} role="img" aria-label="CIX">
      <rect width="512" height="512" rx="112" fill="#0E0E12" />
      <path
        d="M321.9 178.9A120 120 0 1 0 321.9 333.1"
        fill="none"
        stroke="#E8333C"
        strokeWidth="56"
        strokeLinecap="round"
      />
      <path d="M214 216V296L284 256Z" fill="#F2F2F5" stroke="#F2F2F5" strokeWidth="14" strokeLinejoin="round" />
    </svg>
  )
}

/** Wordmark: usa il colore del testo (currentColor) per C, I e una linea della X. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 224 100" className={className} role="img" aria-label="CIX">
      <g fill="none" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor">
        <path d="M72.6 27.4A32 32 0 1 0 72.6 72.6" />
        <path d="M118 18V82" />
        <path d="M150 18L206 82" />
        <path d="M206 18L150 82" stroke="#E8333C" />
      </g>
    </svg>
  )
}
