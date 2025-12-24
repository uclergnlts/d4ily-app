// Helper to get today's date in Europe/Istanbul timezone
export function getTodayInIstanbul(): string {
  const now = new Date()
  const istanbulTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }))
  const year = istanbulTime.getFullYear()
  const month = String(istanbulTime.getMonth() + 1).padStart(2, "0")
  const day = String(istanbulTime.getDate()).padStart(2, "0")
  return year + "-" + month + "-" + day
}

// Transform database row to API response format (snake_case to camelCase)
export function transformDigestResponse(row: any) {
  return {
    id: row.id,
    date: row.digest_date || row.date,
    title: row.title,
    content: row.content,
    audioUrl: row.audio_url || null,
    audioStatus: row.audio_status || null,
    audioDurationSeconds: row.audio_duration_seconds || null,
    audioVoice: row.audio_voice || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
