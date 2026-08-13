
// Generic reusable TSV fetcher
export async function fetchTSVSheet<T extends Record<string, unknown>>(
  url: string,
  mapper: (item: Record<string, string>) => T,
  {
    range,
    dataRowStart = 1,
    enableGroups = false,
    groupFields = []
  }: { range?: string; dataRowStart?: number; enableGroups?: boolean; groupFields?: string[] } = {}
): Promise<T[]> {
  const baseUrl = url ?? ""
  if (!baseUrl) throw new Error(`Missing env variable: ${url}`)

  const finalUrl = range ? `${baseUrl}&range=${encodeURIComponent(range)}` : baseUrl

  const res = await fetch(finalUrl, {
    headers: { Accept: "text/tab-separated-values" },
    cache: "no-store"
  })

  const text = await res.text()
  if (text.startsWith("<!DOCTYPE html>")) throw new Error("Google Sheet did not return TSV. Republish as TSV format.")

  const rows = text
    .trim()
    .split("\n")
    .map(r => r.split("\t"))
  const headers = rows[0].map(h => h.trim())
  const raw = rows.slice(dataRowStart).map(row => Object.fromEntries(row.map((val, i) => [headers[i], val.trim()])))
  // Handle grouping logic
  if (enableGroups && groupFields.length > 0) {
    const lastSeen: Record<string, string> = {}
    raw.forEach(row => {
      groupFields.forEach(field => {
        if (row[field] && row[field].trim() !== "") {
          lastSeen[field] = row[field]
        } else if (lastSeen[field]) {
          row[field] = lastSeen[field]
        }
      })
    })
  }
  return raw.map(mapper).filter(item => Object.keys(item).length > 0)
}
