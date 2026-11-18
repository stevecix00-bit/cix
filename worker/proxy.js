// Proxy sottile (Cloudflare Worker) per scaricare playlist M3U da server senza header CORS.
// Configura la variabile ALLOWED_ORIGIN con l'indirizzo dell'app (es. https://tuonome.github.io).
// Poi imposta VITE_PROXY_URL con l'indirizzo del Worker prima della build.

const MAX_BYTES = 8 * 1024 * 1024

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? ''
    const cors = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'GET',
      Vary: 'Origin',
    }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors })
    if (request.method !== 'GET') return new Response('Metodo non consentito', { status: 405, headers: cors })
    if (!env.ALLOWED_ORIGIN || origin !== env.ALLOWED_ORIGIN) {
      return new Response('Origine non consentita', { status: 403 })
    }

    const target = new URL(request.url).searchParams.get('url')
    let parsed
    try {
      parsed = new URL(target ?? '')
    } catch {
      return new Response('Indirizzo non valido', { status: 400, headers: cors })
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return new Response('Schema non consentito', { status: 400, headers: cors })
    }

    const upstream = await fetch(parsed.toString(), { redirect: 'follow' })
    const body = await upstream.arrayBuffer()
    if (body.byteLength > MAX_BYTES) return new Response('Lista troppo grande', { status: 413, headers: cors })

    return new Response(body, {
      status: upstream.status,
      headers: { ...cors, 'Content-Type': 'text/plain; charset=utf-8' },
    })
  },
}
