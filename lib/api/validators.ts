export function isValidDateParam(date: string) {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false
  }

  const parsed = new Date(`${date}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime())
}

export function parseCursor(value: string | null) {
  if (!value) {
    return null
  }

  const parsed = Number.parseInt(value, 10)
  return Number.isNaN(parsed) ? null : parsed
}
