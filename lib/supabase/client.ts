import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "../supabase"

// Объявляем переменную для хранения синглтона
let client: SupabaseClient<Database> | undefined

export function createClient() {
  // Если клиент уже создан, возвращаем его
  if (client) {
    return client
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment variables are not set. Using a mock client. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your Vercel project settings.",
    )
    // Возвращаем мок-клиент, если переменные не установлены
    return createMockClient()
  }

  // Создаем и сохраняем клиент, если его еще нет
  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return client
}

// Мок-клиент для работы без настроенных переменных
const createMockClient = () =>
  ({
    auth: {
      signInWithPassword: () =>
        Promise.resolve({ error: new Error("Supabase not configured. Please check your environment variables.") }),
      signUp: () =>
        Promise.resolve({ error: new Error("Supabase not configured. Please check your environment variables.") }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({ data: null, error: new Error(`Supabase not configured. Cannot query ${table}.`) }),
        }),
      }),
    }),
  }) as any
