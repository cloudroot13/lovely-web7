export function extractSpotifyTrackId(input: string): string {
  const value = input.trim()
  if (!value) return ''

  const fromUri = value.match(/^spotify:track:([a-zA-Z0-9]+)$/)
  if (fromUri?.[1]) return fromUri[1]

  const fromPath = value.match(/spotify\.com\/(?:intl-[a-z]{2}\/)?(?:embed\/)?track\/([a-zA-Z0-9]+)/i)
  if (fromPath?.[1]) return fromPath[1]

  return ''
}

export function buildSpotifyTrackEmbedUrl(input: string): string | null {
  const trackId = extractSpotifyTrackId(input)
  if (!trackId) return null
  return `https://open.spotify.com/embed/track/${trackId}`
}
