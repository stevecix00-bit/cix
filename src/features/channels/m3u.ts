export interface ParsedChannel {
  name: string
  url: string
  logo?: string
  group?: string
  tvgId?: string
}

/** Divide una riga #EXTINF sulla prima virgola fuori dalle virgolette. */
function splitExtinf(line: string): [string, string] {
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') inQuotes = !inQuotes
    else if (c === ',' && !inQuotes) return [line.slice(0, i), line.slice(i + 1)]
  }
  return [line, '']
}

function parseAttributes(s: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const m of s.matchAll(/([\w-]+)="([^"]*)"/g)) attrs[m[1].toLowerCase()] = m[2]
  return attrs
}

/**
 * Legge una playlist M3U/M3U8 in formato esteso (#EXTINF) e restituisce i canali.
 * Accetta solo indirizzi http(s): qualsiasi altro schema viene scartato.
 */
export function parseM3U(text: string): ParsedChannel[] {
  const out: ParsedChannel[] = []
  let pending: Omit<ParsedChannel, 'url'> | null = null

  for (const raw of text.replace(/^﻿/, '').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line) continue

    if (line.startsWith('#EXTINF')) {
      const [head, title] = splitExtinf(line)
      const attrs = parseAttributes(head)
      pending = {
        name: title.trim() || attrs['tvg-name'] || 'Senza nome',
        logo: attrs['tvg-logo'] || undefined,
        group: attrs['group-title'] || undefined,
        tvgId: attrs['tvg-id'] || undefined,
      }
    } else if (line.startsWith('#EXTGRP:')) {
      if (pending && !pending.group) pending.group = line.slice(8).trim() || undefined
    } else if (line.startsWith('#')) {
      continue
    } else {
      if (/^https?:\/\//i.test(line)) {
        out.push({
          name: pending?.name ?? line,
          url: line,
          logo: pending?.logo,
          group: pending?.group,
          tvgId: pending?.tvgId,
        })
      }
      pending = null
    }
  }
  return out
}
