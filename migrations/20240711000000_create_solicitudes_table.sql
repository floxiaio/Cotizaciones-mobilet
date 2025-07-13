-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tabla de solicitudes
CREATE TABLE solicitudes (
    -- Identificación
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Información del Cliente
    nombre_cliente_o_empresa VARCHAR(100) NOT NULL,
    telefono_whatsapp VARCHAR(20) NOT NULL,
    
    -- Ubicación
    direccion TEXT NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    direccion_confirmada BOOLEAN DEFAULT FALSE,
    
    -- Detalles del Servicio
    cantidad_banos INTEGER NOT NULL,
    tipo_renta VARCHAR(6) NOT NULL CHECK (tipo_renta IN ('obra', 'evento')),
    tipo_pago VARCHAR(20) NOT NULL CHECK (tipo_pago IN ('transferencia_bancaria', 'efectivo')),
    requiere_factura BOOLEAN NOT NULL,
    
    -- Metadatos
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada')),
    notas TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para búsquedas frecuentes
CREATE INDEX idx_solicitudes_telefono ON solicitudes(telefono_whatsapp);
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado);

-- Comentarios descriptivos
COMMENT ON TABLE solicitudes IS 'Almacena las solicitudes de cotización de baños móviles';
COMMENT ON COLUMN solicitudes.telefono_whatsapp IS 'Número de WhatsApp para contacto (formato mexicano)';
COMMENT ON COLUMN solicitudes.direccion_confirmada IS 'Indica si el cliente confirmó que la dirección es correcta';
COMMENT ON COLUMN solicitudes.estado IS 'Estado actual de la solicitud: pendiente, confirmada, en_proceso, completada, cancelada';
