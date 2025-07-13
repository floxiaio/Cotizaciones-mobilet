import { createClient as createBrowserClient } from '@supabase/supabase-js'

// Verificar que las variables de entorno estén definidas
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definido en las variables de entorno')
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY no está definido en las variables de entorno')
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Mostrar información de depuración
console.log('=== Configuración de Supabase ===')
console.log('URL:', supabaseUrl)
console.log('Clave anónima presente:', supabaseAnonKey ? 'Sí' : 'No')
console.log('Longitud de la clave:', supabaseAnonKey?.length || 0, 'caracteres')

// Función mejorada para crear el cliente de Supabase
export function createClient() {
  try {
    console.log('Inicializando cliente Supabase con URL:', supabaseUrl)
    
    const client = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${supabaseAnonKey}`
        }
      }
    })
    
    console.log('Cliente Supabase inicializado correctamente')
    
    // Verificar la conexión
    const checkConnection = async () => {
      try {
        const { data, error } = await client.from('solicitudes').select('*').limit(1)
        if (error) {
          console.error('Error al verificar la conexión con Supabase:', error)
        } else {
          console.log('Conexión con Supabase verificada correctamente')
        }
      } catch (error: any) {
        console.error('Excepción al verificar la conexión:', error)
      }
    }
    
    checkConnection()
    
    return client
  } catch (error) {
    console.error('Error al inicializar el cliente de Supabase:', error)
    throw error
  }
}
