'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestSupabase() {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient()
        
        // Hacemos una consulta de prueba a la tabla 'profiles'
        const { data: testData, error: testError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
        
        if (testError) {
          // Si la tabla no existe, solo mostramos un mensaje
          if (testError.code === '42P01') { // Código de error para "tabla no existe"
            setData([])
            setError('La tabla profiles no existe. Por favor, créala en Supabase.')
          } else {
            setError(`Error de conexión: ${testError.message}`)
          }
        } else {
          setData(testData)
        }
      } catch (err) {
        setError(`Error inesperado: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    testConnection()
  }, [])

  if (loading) {
    return <div className="p-4 bg-blue-100 text-blue-800 rounded">Probando conexión con Supabase...</div>
  }

  if (error) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
        <p className="font-bold">Estado de la conexión:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">
          Esto es normal si aún no has creado la tabla 'profiles' en Supabase.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 bg-green-100 text-green-800 rounded">
      <p className="font-bold">¡Conexión exitosa con Supabase!</p>
      {data && data.length > 0 ? (
        <div className="mt-2">
          <p>Datos de ejemplo:</p>
          <pre className="bg-white p-2 rounded mt-1 overflow-auto text-xs">
            {JSON.stringify(data[0], null, 2)}
          </pre>
        </div>
      ) : (
        <p className="mt-2">La tabla 'profiles' está vacía o no existe.</p>
      )}
    </div>
  )
}
