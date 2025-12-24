const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uqtngtrwnkhvgzuvyehc.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdG5ndHJ3bmtodmd6dXZ5ZWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzU4NDksImV4cCI6MjA4MDc1MTg0OX0.qK59mvMe6J8akGi79zQIag4UQwcHjPZR4T1O-t52Zvk"

export function createClient() {
  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) =>
          fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}&${column}=eq.${value}`, {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }).then((r) => r.json()),
        single: () =>
          fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}&limit=1`, {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          })
            .then((r) => r.json())
            .then((data) => ({ data: data?.[0] || null, error: null })),
        maybeSingle: () =>
          fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}&limit=1`, {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          })
            .then((r) => r.json())
            .then((data) => ({ data: data?.[0] || null, error: null })),
      }),
      insert: async (data: any) => {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify(data),
        })
        return { data: await response.json(), error: response.ok ? null : new Error("Insert failed") }
      },
      delete: () => ({
        eq: async (column: string, value: any) => {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
            method: "DELETE",
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          })
          return { error: response.ok ? null : new Error("Delete failed") }
        },
      }),
    }),
  }
}
