const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uqtngtrwnkhvgzuvyehc.supabase.co"
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxdG5ndHJ3bmtodmd6dXZ5ZWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNzU4NDksImV4cCI6MjA4MDc1MTg0OX0.qK59mvMe6J8akGi79zQIag4UQwcHjPZR4T1O-t52Zvk"

export async function createClient() {
  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        eq: (column: string, value: any) => supabaseQuery(table, { select: columns, eq: { column, value } }),
        order: (column: string, options?: { ascending?: boolean }) =>
          supabaseQuery(table, {
            select: columns,
            order: `${column}.${options?.ascending ? "asc" : "desc"}`,
          }),
        limit: (count: number) => supabaseQuery(table, { select: columns, limit: count }),
        single: () => supabaseQuery(table, { select: columns, limit: 1 }).then((data) => data?.[0] || null),
        maybeSingle: () => supabaseQuery(table, { select: columns, limit: 1 }).then((data) => data?.[0] || null),
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
      delete: async () => ({
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

export async function supabaseQuery(
  table: string,
  options?: {
    select?: string
    order?: string
    limit?: number
    eq?: { column: string; value: string }
    filters?: Array<{ column: string; operator: string; value: string }>
  },
) {
  let url = SUPABASE_URL + "/rest/v1/" + table + "?select=" + (options?.select || "*")

  if (options?.order) {
    url = url + "&order=" + options.order
  }
  if (options?.limit) {
    url = url + "&limit=" + options.limit
  }
  if (options?.eq) {
    url = url + "&" + options.eq.column + "=eq." + options.eq.value
  }
  if (options?.filters) {
    for (const filter of options.filters) {
      url = url + "&" + filter.column + "=" + filter.operator + "." + filter.value
    }
  }

  const response = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: "Bearer " + SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  return data
}
