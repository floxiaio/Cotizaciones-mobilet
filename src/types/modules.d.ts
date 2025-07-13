// Tipos para módulos personalizados
declare module '@/lib/supabase/client' {
  import { SupabaseClient } from '@supabase/supabase-js'
  export function createClient(): SupabaseClient
}

declare module '@/components/supabase-provider' {
  import { ReactNode } from 'react'
  const SupabaseProvider: (props: { children: ReactNode }) => JSX.Element
  export default SupabaseProvider
}
