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
    lat: yup.number().required('Selecciona una ubicación en el mapa'),
    lng: yup.number().required('Selecciona una ubicación en el mapa'),
    address: yup.string().required('La dirección es requerida'),
  }).required('La ubicación es requerida'),
  
  calle: yup
    .string()
    .required('La calle es requerida')
    .min(3, 'La calle debe tener al menos 3 caracteres'),
    
  numero: yup
    .string()
    .required('El número es requerido')
    .matches(/^[0-9]+[a-zA-Z0-9\s-]*$/, 'Ingresa un número de calle válido'),
    
  colonia: yup
    .string()
    .required('La colonia es requerida')
    .min(3, 'La colonia debe tener al menos 3 caracteros'),
  
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
