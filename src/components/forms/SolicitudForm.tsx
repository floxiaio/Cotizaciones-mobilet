'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { solicitudSchema, SolicitudFormData } from '@/lib/validations/schema';
import MapInput from '../ui/MapInput';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { solicitudService } from '@/lib/services/solicitudService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Estilos para los inputs y selects
const inputStyles = "w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm";
const labelStyles = "block text-sm font-medium text-[var(--text-primary)] mb-1";
const errorStyles = "mt-1 text-sm text-red-500";

// Opciones para los selects
const tipoRentaOptions = [
  { value: 'evento', label: 'Evento' },
  { value: 'obra', label: 'Obra' }
];

const tipoPagoOptions = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
];

interface SolicitudFormProps {
  onSubmitSuccess?: () => void;
}

export default function SolicitudForm({ onSubmitSuccess }: SolicitudFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
    reset,
    getValues
  } = useForm<SolicitudFormData>({
    resolver: yupResolver(solicitudSchema) as any,
    mode: 'onChange',
    defaultValues: {
      cantidadBanos: undefined,
      tipoRenta: undefined,
      tipoPago: undefined,
      requiereFactura: false,
      notas: '',
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof SolicitudFormData)[] = [];
    let isValid = true;
    
    if (currentStep === 1) {
      fieldsToValidate = ['nombreCliente', 'telefono'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['cantidadBanos', 'tipoRenta', 'tipoPago'];
    } else if (currentStep === 3) {
      // Validar que se haya seleccionado una ubicación
      const ubicacion = getValues('ubicacion');
      if (!ubicacion || !ubicacion.lat || !ubicacion.lng) {
        toast.error('Por favor selecciona una ubicación en el mapa', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
        return;
      }
      // No necesitamos validar otros campos en este paso
      isValid = true;
    } else if (currentStep === 4) {
      fieldsToValidate = ['calle', 'numero', 'colonia'];
    }
    
    if (fieldsToValidate.length > 0) {
      isValid = await trigger(fieldsToValidate as any);
    }
    
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (formData: SolicitudFormData) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Validar que los campos requeridos tengan valor
      if (formData.cantidadBanos === undefined || !formData.tipoRenta || !formData.tipoPago) {
        throw new Error('Por favor completa todos los campos requeridos');
      }
      
      // Combinar los campos de dirección en un solo string
      const direccionCompleta = `${formData.calle} ${formData.numero}, ${formData.colonia}`;
      
      // Asegurar que el teléfono tenga el prefijo +52
      const telefonoCompleto = `+52${formData.telefono}`;
      
      // Preparar los datos para enviar a Supabase
      const solicitudData = {
        nombre_cliente_o_empresa: formData.nombreCliente,
        telefono_whatsapp: telefonoCompleto,
        direccion_completa: direccionCompleta,
        latitud: formData.ubicacion.lat,
        longitud: formData.ubicacion.lng,
        cantidad_banos: formData.cantidadBanos,
        tipo_renta: formData.tipoRenta as 'obra' | 'evento',
        tipo_pago: formData.tipoPago === 'transferencia' ? 'transferencia_bancaria' as const : 'efectivo' as const,
        requiere_factura: formData.requiereFactura,
        notas: formData.notas || '',
        estado: 'pendiente' as const
      };

      // Enviar a Supabase
      await solicitudService.create(solicitudData);
      
      // Mostrar mensaje de éxito
      toast.success('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.');
      
      // Restablecer el formulario
      reset();
      setSubmitSuccess(true);
      
      // Llamar a la función de éxito si está definida
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error al enviar el formulario';
      setSubmitError(errorMessage);
      
      // Mostrar mensaje de error
      toast.error(`Error: ${errorMessage}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center py-8"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3">¡Solicitud enviada con éxito!</h2>
          <p className="text-[var(--text-secondary)] mb-8">Hemos recibido tu solicitud y nos pondremos en contacto contigo a la brevedad.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSubmitSuccess(false);
              setCurrentStep(1);
              reset();
            }}
            className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            Enviar otra solicitud
          </motion.button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Renderizar pasos del formulario
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Información básica</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Por favor proporciona tus datos de contacto.</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="nombreCliente" className={labelStyles}>
                    Nombre completo o razón social *
                  </label>
                  <input
                    id="nombreCliente"
                    type="text"
                    className={`${inputStyles} ${errors.nombreCliente ? 'border-red-400' : ''}`}
                    {...register('nombreCliente')}
                    placeholder="Ej: Juan Pérez o Empresa S.A. de C.V."
                  />
                  {errors.nombreCliente && (
                    <p className={errorStyles}>{errors.nombreCliente.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className={labelStyles}>
                    Teléfono / WhatsApp *
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-gray-200 focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center px-3 bg-gray-100 text-gray-600 text-sm font-medium">
                      +52
                    </div>
                    <input
                      id="telefono"
                      type="tel"
                      className={`flex-1 px-3 py-3 border-0 focus:ring-0 ${errors.telefono ? 'border-red-400' : ''}`}
                      placeholder="Ej: 5512345678"
                      {...register('telefono', {
                        onChange: (e) => {
                          // Solo permitir números
                          const value = e.target.value.replace(/\D/g, '');
                          e.target.value = value;
                          return value;
                        },
                        maxLength: 10
                      })}
                      maxLength={10}
                    />
                  </div>
                  {errors.telefono ? (
                    <p className={errorStyles}>{errors.telefono.message}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Ingresa los 10 dígitos de tu número local</p>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500">Los detalles de la dirección los podrás ingresar en el siguiente paso.</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-end">
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Siguiente
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Detalles del servicio</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Especifica los detalles de tu solicitud.</p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cantidadBanos" className={labelStyles}>
                    Cantidad de baños necesarios *
                  </label>
                  <select
                    id="cantidadBanos"
                    className={`${inputStyles} ${errors.cantidadBanos ? 'border-red-400' : ''}`}
                    defaultValue=""
                    {...register('cantidadBanos')}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>
                        {num} baño{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  {errors.cantidadBanos && (
                    <p className={errorStyles}>{errors.cantidadBanos.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tipoRenta" className={labelStyles}>
                    Tipo de servicio *
                  </label>
                  <select
                    id="tipoRenta"
                    className={`${inputStyles} ${errors.tipoRenta ? 'border-red-400' : ''}`}
                    defaultValue=""
                    {...register('tipoRenta')}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="evento">Evento</option>
                    <option value="obra">Obra</option>
                  </select>
                  {errors.tipoRenta && (
                    <p className={errorStyles}>{errors.tipoRenta.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tipoPago" className={labelStyles}>
                    Método de pago preferido *
                  </label>
                  <select
                    id="tipoPago"
                    className={`${inputStyles} ${errors.tipoPago ? 'border-red-400' : ''}`}
                    defaultValue=""
                    {...register('tipoPago')}
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia bancaria</option>
                  </select>
                  {errors.tipoPago && (
                    <p className={errorStyles}>{errors.tipoPago.message}</p>
                  )}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 transition-all duration-200 hover:border-[var(--primary)/50] hover:shadow-sm">
                  <div className="flex items-start">
                    <div className="flex items-center h-5 mt-0.5">
                      <input
                        id="requiereFactura"
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
                        {...register('requiereFactura')}
                      />
                    </div>
                    <div className="ml-3">
                      <label htmlFor="requiereFactura" className="block text-base font-semibold text-[var(--text-primary)]">
                        ¿Requieres factura fiscal?
                      </label>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Marca esta casilla si necesitas factura con datos fiscales para deducción de impuestos
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-gray-300 text-[var(--text-primary)] rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-all"
                >
                  <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Regresar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Siguiente
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Ubicación del servicio</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Por favor, selecciona la ubicación exacta donde se necesitan los baños portátiles.
                <br />
                <span className="font-medium">Arrastra el marcador para ajustar la ubicación.</span>
              </p>
              
              <div className="h-[400px] rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm mb-6">
                <Controller
                  name="ubicacion"
                  control={control}
                  rules={{ required: "Debes seleccionar una ubicación en el mapa" }}
                  render={({ field: { onChange, value } }) => (
                    <MapInput
                      onLocationSelect={(location) => {
                        // Actualizar la ubicación en el formulario
                        onChange(location);
                        
                        // Actualizar siempre los campos de dirección cuando se mueve el marcador
                        if (location.street) {
                          setValue('calle', location.street, { shouldValidate: true });
                        }
                        
                        if (location.number) {
                          setValue('numero', location.number, { shouldValidate: true });
                        }
                      }}
                      initialLocation={value || { 
                        lat: 19.0400, 
                        lng: -98.2476, 
                        address: 'Centro Comercial Angelópolis, Puebla' 
                      }}
                      className="h-full w-full"
                    />
                  )}
                />
              </div>
              
              {errors.ubicacion && (
                <p className="mt-2 text-sm text-red-500 mb-6">
                  {errors.ubicacion.message}
                </p>
              )}
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Importante:</strong> Asegúrate de que el marcador esté en la ubicación exacta donde se necesitan los baños.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-gray-300 text-[var(--text-primary)] rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-all"
                >
                  <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Regresar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Siguiente
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
        
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Información de la dirección</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Por favor verifica o completa los detalles de la dirección.</p>
              
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-3/4">
                    <label htmlFor="calle" className={labelStyles}>
                      Calle *
                    </label>
                    <input
                      id="calle"
                      type="text"
                      className={`w-full ${inputStyles} ${errors.calle ? 'border-red-400' : ''}`}
                      placeholder="Ej: Av. Ejército Mexicano"
                      {...register('calle')}
                    />
                    {errors.calle && (
                      <p className={errorStyles}>{errors.calle.message}</p>
                    )}
                  </div>

                  <div className="w-full md:w-1/4">
                    <label htmlFor="numero" className={labelStyles}>
                      Número *
                    </label>
                    <input
                      id="numero"
                      type="text"
                      className={`w-full ${inputStyles} ${errors.numero ? 'border-red-400' : ''}`}
                      placeholder="Ej: 123"
                      {...register('numero')}
                    />
                    {errors.numero && (
                      <p className={errorStyles}>{errors.numero.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="colonia" className={labelStyles}>
                    Colonia o fraccionamiento *
                  </label>
                  <input
                    id="colonia"
                    type="text"
                    className={`w-full ${inputStyles} ${errors.colonia ? 'border-red-400' : ''}`}
                    placeholder="Ej: Centro Histórico"
                    {...register('colonia')}
                  />
                  {errors.colonia && (
                    <p className={errorStyles}>{errors.colonia.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="notas" className={labelStyles}>
                    Referencias adicionales (opcional)
                  </label>
                  <textarea
                    id="notas"
                    rows={3}
                    className={`${inputStyles} resize-none`}
                    placeholder="Ej: Frente a la iglesia, junto al Oxxo, portón negro, etc."
                    {...register('notas')}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between">
                <motion.button
                  type="button"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-gray-300 text-[var(--text-primary)] rounded-lg font-medium shadow-sm hover:bg-gray-50 transition-all"
                >
                  <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Regresar
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : 'Enviar solicitud'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  // Indicadores de progreso
  const renderProgressSteps = () => {
    const steps = [
      { number: 1, label: 'Datos' },
      { number: 2, label: 'Servicio' },
      { number: 3, label: 'Ubicación' },
      { number: 4, label: 'Dirección' },
    ];

    return (
      <div className="w-full mb-8">
        {/* Contenedor de los pasos */}
        <div className="flex justify-between relative z-10 mb-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center relative">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-colors ${
                  currentStep >= step.number 
                    ? 'bg-[#ff5e1a] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step.number}
              </div>
              <span className={`text-xs font-medium ${
                currentStep >= step.number ? 'text-[#ff5e1a] font-semibold' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
        
        {/* Línea de progreso - ahora debajo del texto */}
        <div className="relative -mt-4">
          <div className="h-1 bg-gray-200 w-full">
            <motion.div 
              className="h-full bg-[#ff5e1a]"
              initial={{ width: '0%' }}
              animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {renderProgressSteps()}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </form>
  );
}
