export function shortAddress(addr: string | null | undefined): string {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function formatTimestamp(ts: bigint | number): string {
  const ms = typeof ts === 'bigint' ? Number(ts) * 1000 : ts * 1000
  return new Date(ms).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  })
}
