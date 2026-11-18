import { describe, expect, it } from 'vitest'
import { parseM3U } from './m3u'

const sample = `#EXTM3U
#EXTINF:-1 tvg-id="rete.uno" tvg-logo="https://example.com/uno.png" group-title="Generali",Rete, Uno
https://example.com/uno.m3u8
#EXTINF:-1 group-title="Notizie",Info 24
#EXTGRP:Ignorato
http://example.com/info24.m3u8
#EXTINF:-1,Schema non valido
javascript:alert(1)
file:///etc/passwd
`

describe('parseM3U', () => {
  it('legge nome, logo, gruppo e id', () => {
    const [first] = parseM3U(sample)
    expect(first).toMatchObject({
      name: 'Rete, Uno',
      url: 'https://example.com/uno.m3u8',
      logo: 'https://example.com/uno.png',
      group: 'Generali',
      tvgId: 'rete.uno',
    })
  })

  it('accetta http e https e scarta gli altri schemi', () => {
    const urls = parseM3U(sample).map((c) => c.url)
    expect(urls).toEqual(['https://example.com/uno.m3u8', 'http://example.com/info24.m3u8'])
  })

  it('gestisce BOM e righe vuote', () => {
    expect(parseM3U('﻿#EXTM3U\n\n#EXTINF:-1,Uno\n\nhttps://a.example/1\n')).toHaveLength(1)
  })
})
