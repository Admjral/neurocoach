import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const createMockClient = () =>
  ({
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      exchangeCodeForSession: () => Promise.resolve({ error: new Error("Supabase not configured.") }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: null, error: new Error(`Supabase not configured. Cannot query ${table}.`) }),
          order: () => ({
            limit: () =>
              Promise.resolve({ data: [], error: new Error(`Supabase not configured. Cannot query ${table}.`) }),
          }),
        }),
      }),
      insert: () =>
        Promise.resolve({ data: null, error: new Error(`Supabase not configured. Cannot insert into ${table}.`) }),
      update: () =>
        Promise.resolve({ data: null, error: new Error(`Supabase not configured. Cannot update ${table}.`) }),
      delete: () =>
        Promise.resolve({ data: null, error: new Error(`Supabase not configured. Cannot delete from ${table}.`) }),
    }),
  }) as any

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are not set for server-side rendering. Using a mock client.")
    return createMockClient()
  }

  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
