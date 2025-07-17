import * as yup from 'yup';

// Expresión regular para validar números de teléfono mexicanos (solo el número local)
const phoneRegExp = /^[0-9]{10}$/;

export const solicitudSchema = yup.object().shape({
  nombreCliente: yup
    .string()
    .required('El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres'),
    
  telefono: yup
    .string()
    .required('El teléfono es requerido')
    .matches(phoneRegExp, 'Ingresa un número de teléfono válido (10 dígitos)'),
    
  ubicacion: yup.object().shape({
    lat: yup.number()
      .required('Por favor selecciona una ubicación en el mapa')
      .test('is-valid-lat', 'La latitud no es válida', value => 
        value >= -90 && value <= 90
      ),
    lng: yup.number()
      .required('Por favor selecciona una ubicación en el mapa')
      .test('is-valid-lng', 'La longitud no es válida', value => 
        value >= -180 && value <= 180
      ),
    address: yup.string()
      .required('La dirección es requerida')
      .min(5, 'La dirección debe tener al menos 5 caracteres'),
  }).required('Por favor selecciona una ubicación en el mapa'),
  
  calle: yup
    .string()
    .required('El nombre de la calle es requerido')
    .min(3, 'La calle debe tener al menos 3 caracteres'),
    
  numero: yup
    .string()
    .required('El número es requerido')
    .matches(/^[0-9]+[a-zA-Z0-9\s-]*$/, 'Ingresa un número de calle válido (ej. 123 o 123-A)'),
    
  colonia: yup
    .string()
    .required('La colonia o fraccionamiento es requerido')
    .min(3, 'La colonia debe tener al menos 3 caracteres'),
  
  cantidadBanos: yup
    .number()
    .transform((value, originalValue) => 
      originalValue === '' ? undefined : Number(originalValue)
    )
    .typeError('La cantidad de baños es requerida')
    .required('La cantidad de baños es requerida')
    .min(1, 'Mínimo 1 baño')
    .max(30, 'Máximo 30 baños')
    .integer('Debe ser un número entero'),
    
  tipoRenta: yup
    .string()
    .transform(value => (value === '' ? undefined : value))
    .typeError('El tipo de renta es requerido')
    .oneOf(['obra', 'evento'], 'Selecciona un tipo de renta válido')
    .required('El tipo de renta es requerido'),
    
  tipoPago: yup
    .string()
    .transform(value => (value === '' ? undefined : value))
    .typeError('El método de pago es requerido')
    .oneOf(['transferencia', 'efectivo'], 'Selecciona un método de pago válido')
    .required('El método de pago es requerido'),
    
  requiereFactura: yup
    .boolean()
    .required('Indica si requieres factura'),
    
  notas: yup
    .string()
    .notRequired()
    .nullable()
    .default(undefined)
    .max(500, 'Las notas no pueden tener más de 500 caracteres')
    .transform((value) => (value === '' ? null : value))
});

// Definir el tipo base a partir del esquema
type BaseSolicitudType = yup.InferType<typeof solicitudSchema>;

export type SolicitudFormData = {
  nombreCliente: string;
  telefono: string;
  ubicacion: {
    lat: number;
    lng: number;
    address: string;
  };
  calle: string;
  numero: string;
  colonia: string;
  cantidadBanos?: number;
  tipoRenta?: 'obra' | 'evento';
  tipoPago?: 'transferencia' | 'efectivo';
  requiereFactura: boolean;
  notas?: string | null;
}
