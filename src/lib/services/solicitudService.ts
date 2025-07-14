import { supabase } from '../supabase';

// Función para verificar la conexión con Supabase
async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('solicitudes').select('*').limit(1);
    if (error) {
      console.error('Error al verificar la conexión con Supabase:', error);
      return false;
    }
    console.log('Conexión con Supabase verificada correctamente');
    return true;
  } catch (error) {
    console.error('Excepción al verificar la conexión con Supabase:', error);
    return false;
  }
}

// Verificar la conexión al cargar el módulo
if (typeof window !== 'undefined') {
  checkSupabaseConnection().then(success => {
    console.log('Verificación de conexión con Supabase:', success ? 'Éxito' : 'Falló');
  });
}

export interface Solicitud {
  nombre_cliente_o_empresa: string;
  telefono_whatsapp: string;
  direccion_completa: string;
  latitud: number;
  longitud: number;
  cantidad_banos: number;
  tipo_renta: 'obra' | 'evento';
  tipo_pago: 'transferencia_bancaria' | 'efectivo';
  requiere_factura: boolean;
  notas?: string;
  estado?: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  created_at?: string;
  updated_at?: string;
}

export const solicitudService = {
  async create(solicitud: Omit<Solicitud, 'id' | 'created_at' | 'updated_at' | 'estado'>) {
    try {
      console.log('=== Iniciando creación de solicitud ===');
      console.log('Datos de la solicitud:', JSON.stringify(solicitud, null, 2));
      
      // Verificar la conexión primero
      const isConnected = await checkSupabaseConnection();
      if (!isConnected) {
        throw new Error('No se pudo establecer conexión con el servidor');
      }

      console.log('Conexión con Supabase verificada correctamente');
      console.log('Enviando solicitud a Supabase...');
      
      const startTime = performance.now();
      
      // Usar la función de base de datos personalizada
      const { data, error } = await supabase.rpc('insert_solicitud', {
        p_nombre_cliente_o_empresa: solicitud.nombre_cliente_o_empresa,
        p_telefono_whatsapp: solicitud.telefono_whatsapp,
        p_direccion_completa: solicitud.direccion_completa,
        p_latitud: solicitud.latitud,
        p_longitud: solicitud.longitud,
        p_cantidad_banos: solicitud.cantidad_banos,
        p_tipo_renta: solicitud.tipo_renta,
        p_tipo_pago: solicitud.tipo_pago,
        p_requiere_factura: solicitud.requiere_factura || false,
        p_notas: solicitud.notas || ''
      });
      
      const endTime = performance.now();
      console.log(`Respuesta recibida en ${Math.round(endTime - startTime)}ms`);
      
      if (error) {
        console.error('Error al crear la solicitud:', error);
        
        if (error.message.includes('network')) {
          console.error('Posible problema de red. Verifica tu conexión a Internet.');
        }
        
        throw new Error(`Error al guardar la solicitud: ${error.message}`);
      }
      
      console.log('Solicitud creada exitosamente:', data);
      return data;
    } catch (error) {
      console.error('Error completo al crear la solicitud:', {
        error,
        message: error instanceof Error ? error.message : 'Error desconocido',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  async getAll() {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener las solicitudes:', error);
      throw error;
    }
  },

  async updateStatus(id: string, estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada') {
    try {
      const { data, error } = await supabase
        .from('solicitudes')
        .update({ 
          estado, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al actualizar la solicitud:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('solicitudes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar la solicitud:', error);
      throw error;
    }
  }
};
