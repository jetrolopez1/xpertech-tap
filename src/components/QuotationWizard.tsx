import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, ArrowLeft, Check, Home, CloudRain, Camera, Disc, Smartphone, MapPin, Monitor, Wifi } from 'lucide-react';

import { 
  cameraTypes, 
  resolutions, 
  installationTypes,
  recordingOptions,
  remoteAccessOptions,
  dvrOptions,
  installationServiceOptions,
  storageOptionsSimplified,
  calculateQuote,
  QuoteFormData
} from '@/data/cameraData';

const QuotationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const cotizadorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<QuoteFormData>({
    cameraCount: 1,
    cameraType: '',
    cameraTypes: [],
    resolution: '',
    installationType: '',
    recording: '',
    remoteAccess: '',
    hasDvr: '',
    installationService: '',
    cableLength: 10,
    storage: '',
    location: '',
    // New fields for improved flow
    interiorCount: 0,
    exteriorCount: 0,
    nightVisionType: '',
    technologyType: '',
    physicalType: '',
    physicalTypes: [],
    needsMonitor: '',
    monitorSize: ''
  });
  
  const [quotationResult, setQuotationResult] = useState<ReturnType<typeof calculateQuote> | null>(null);
  
  const steps = [
    'Ubicación',
    'Visión Nocturna', 
    'Tecnología',
    'Tipo de Cámara',
    'Resolución',
    'Sistema de Grabación',
    'Acceso Remoto',
    'Monitor',
    'Instalación',
    'Datos',
    'Cotización'
  ];

  const scrollToCotizador = () => {
    if (cotizadorRef.current) {
      cotizadorRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  };
  
  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex + 1);
    setTimeout(scrollToCotizador, 100);
  };
  
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setTimeout(scrollToCotizador, 100);
    }
    
    if (currentStep === steps.length - 1) {
      // Calculate quote on the last step
      const result = calculateQuote(formData);
      setQuotationResult(result);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setTimeout(scrollToCotizador, 100);
    }
  };
  
  const updateFormField = (field: keyof QuoteFormData, value: string | number | string[]) => {
    setFormData({ ...formData, [field]: value });
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getCostIndicator = (basePrice: number) => {
    if (basePrice <= 1200) return '$';
    if (basePrice <= 1800) return '$$';
    if (basePrice <= 2500) return '$$$';
    return '$$$$';
  };

  const getResolutionCostIndicator = (id: string) => {
    switch (id) {
      case '2mp': return '$';
      case '4mp': return '$$';
      case '5mp': return '$$$';
      case '8mp': return '$$$$';
      default: return '$';
    }
  };

  const togglePhysicalType = (typeId: string) => {
    const currentTypes = formData.physicalTypes || [];
    if (typeId === 'wifi') {
      // WiFi is exclusive
      updateFormField('physicalTypes', [typeId]);
    } else {
      if (currentTypes.includes(typeId)) {
        updateFormField('physicalTypes', currentTypes.filter(t => t !== typeId));
      } else {
        const newTypes = currentTypes.filter(t => t !== 'wifi'); // Remove wifi if adding others
        updateFormField('physicalTypes', [...newTypes, typeId]);
      }
    }
  };

  const getSpanishValue = (field: string, value: string) => {
    switch (field) {
      case 'nightVisionType':
        switch (value) {
          case 'none': return 'Sin visión nocturna';
          case 'infrared': return 'Con infrarrojos';
          case 'full-color': return 'A todo color';
          default: return value;
        }
      case 'technologyType':
        switch (value) {
          case 'analog': return 'Analógica';
          case 'ip': return 'IP Digital';
          default: return value;
        }
      case 'physicalTypes':
        const types = formData.physicalTypes || [];
        return types.map(type => {
          switch (type) {
            case 'bullet': return 'Bullet';
            case 'dome': return 'Domo';
            case 'ptz': return 'PTZ';
            case 'wifi': return 'WiFi';
            default: return type;
          }
        }).join(', ') || 'Ninguno';
      case 'recording':
        return value === 'yes' ? 'Sí' : 'No';
      case 'remoteAccess':
        return value === 'yes' ? 'Sí' : 'No';
      case 'needsMonitor':
        return value === 'yes' ? 'Sí' : 'No';
      case 'hasDvr':
        return value === 'yes' ? 'Ya tengo equipo' : 'Necesito equipo nuevo';
      case 'installationService':
        switch (value) {
          case 'complete': return 'Instalación completa';
          case 'accessories': return 'Solo complementos';
          case 'none': return 'Ninguno';
          default: return value;
        }
      default:
        return value;
    }
  };
  
  const generateWhatsAppText = () => {
    if (!quotationResult) return '';
    
    let message = `Hola, me interesa cotizar un sistema de cámaras con las siguientes características: `;
    message += `\n- Cámaras interiores: ${formData.interiorCount}`;
    message += `\n- Cámaras exteriores: ${formData.exteriorCount}`;
    message += `\n- Visión nocturna: ${getSpanishValue('nightVisionType', formData.nightVisionType)}`;
    message += `\n- Tecnología: ${getSpanishValue('technologyType', formData.technologyType)}`;
    message += `\n- Tipos físicos: ${getSpanishValue('physicalTypes', '')}`;
    message += `\n- Resolución: ${resolutions.find(res => res.id === formData.resolution)?.name || formData.resolution}`;
    message += `\n- Acceso Remoto: ${getSpanishValue('remoteAccess', formData.remoteAccess)}`;
    message += `\n- Monitor: ${getSpanishValue('needsMonitor', formData.needsMonitor)}`;
    if (formData.needsMonitor === 'yes' && formData.monitorSize) {
      message += ` (${formData.monitorSize})`;
    }
    message += `\n- DVR/NVR: ${getSpanishValue('hasDvr', formData.hasDvr)}`;
    message += `\n- Instalación: ${getSpanishValue('installationService', formData.installationService)}`;
    if ((formData.installationService === 'complete' || formData.installationService === 'accessories') && formData.cableLength) {
      message += ` (${formData.cableLength} metros de cable)`;
    }
    message += `\n- Almacenamiento: ${storageOptionsSimplified.find(s => s.id === formData.storage)?.name || formData.storage}`;
    message += `\n- Ubicación: ${formData.location || 'No especificada'}`;
    message += `\n\nCotización estimada: ${formatPrice(quotationResult.total)}`;
    
    return encodeURIComponent(message);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Ubicación de cámaras
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="flex space-x-4">
                  <Home className="h-8 w-8 text-xpertech-cyan" />
                  <CloudRain className="h-8 w-8 text-xpertech-yellow" />
                </div>
              </div>
              <h3 className="text-xl font-bold">¿Dónde necesitas las cámaras?</h3>
              <p className="text-gray-400">Selecciona la cantidad para cada ubicación</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center mb-2">
                  <Home className="h-5 w-5 text-xpertech-cyan mr-2" />
                  <h4 className="font-bold">Cámaras para Interior</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3">Espacios cerrados como oficinas, salas, pasillos internos</p>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => updateFormField('interiorCount', Math.max(0, formData.interiorCount - 1))}
                    className="text-lg h-10 w-10 p-0"
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-10 text-center">{formData.interiorCount}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => updateFormField('interiorCount', formData.interiorCount + 1)}
                    className="text-lg h-10 w-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-gray-900 rounded-lg">
                <div className="flex items-center mb-2">
                  <CloudRain className="h-5 w-5 text-xpertech-yellow mr-2" />
                  <h4 className="font-bold">Cámaras para Exterior</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3">Espacios al aire libre como entradas, patios, estacionamientos</p>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => updateFormField('exteriorCount', Math.max(0, formData.exteriorCount - 1))}
                    className="text-lg h-10 w-10 p-0"
                  >
                    -
                  </Button>
                  <span className="text-2xl font-bold w-10 text-center">{formData.exteriorCount}</span>
                  <Button 
                    variant="outline" 
                    onClick={() => updateFormField('exteriorCount', formData.exteriorCount + 1)}
                    className="text-lg h-10 w-10 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Visión Nocturna
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tipo de visión nocturna</h3>
            <p className="text-gray-400">Define el tipo de visión nocturna que necesitas</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'none', name: 'Sin visión nocturna', desc: 'Solo funcionan con luz natural o artificial adecuada', cost: '$' },
                { id: 'infrared', name: 'Con infrarrojos (IR)', desc: 'Ven en blanco y negro durante la noche con iluminación infrarroja', cost: '$$' },
                { id: 'full-color', name: 'A todo color', desc: 'Mantienen los colores incluso en completa oscuridad', cost: '$$$' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('nightVisionType', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.nightVisionType === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xpertech-cyan font-bold">{option.cost}</span>
                      {formData.nightVisionType === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 3: // Tecnología
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tipo de tecnología</h3>
            <p className="text-gray-400">Elige entre tecnología IP (digital, más moderna y flexible) o analógica (más básica y económica)</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'analog', name: 'Analógica', desc: 'Más económica, calidad básica, instalación sencilla y compatible con sistemas antiguos', cost: '$' },
                { id: 'ip', name: 'IP Digital', desc: 'Más moderna, mejor calidad de imagen, mayor flexibilidad y funciones avanzadas', cost: '$$' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('technologyType', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.technologyType === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xpertech-cyan font-bold">{option.cost}</span>
                      {formData.technologyType === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4: // Tipo Físico
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tipo físico de cámara</h3>
            <p className="text-gray-400">Selecciona uno o varios tipos que mejor se adapten al lugar (WiFi es exclusivo)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  id: 'bullet', 
                  name: 'Bullet', 
                  desc: 'Forma cilíndrica, ideal para exteriores, fácil instalación en paredes', 
                  cost: '$$', 
                  icon: <Camera className="h-5 w-5" /> 
                },
                { 
                  id: 'dome', 
                  name: 'Domo', 
                  desc: 'Diseño discreto y elegante, perfecto para interiores, difícil de detectar dirección', 
                  cost: '$$', 
                  icon: <div className="h-5 w-5 rounded-full border-2 border-current bg-current/20"></div> 
                },
                { 
                  id: 'ptz', 
                  name: 'PTZ', 
                  desc: 'Se mueve y hace zoom automático, cubre áreas grandes con seguimiento', 
                  cost: '$$$$', 
                  icon: <div className="h-5 w-5 relative flex items-center justify-center">
                    <Camera className="h-4 w-4" />
                    <ArrowRight className="h-2 w-2 absolute -top-0.5 -right-0.5" />
                    <ArrowLeft className="h-2 w-2 absolute -bottom-0.5 -left-0.5" />
                  </div> 
                },
                { 
                  id: 'wifi', 
                  name: 'WiFi', 
                  desc: 'Sin cables de video, instalación rápida, requiere buena señal WiFi', 
                  cost: '$$$', 
                  icon: <Wifi className="h-5 w-5" /> 
                }
              ].map(option => {
                const isSelected = formData.physicalTypes?.includes(option.id);
                const isWifiSelected = formData.physicalTypes?.includes('wifi');
                const isDisabled = option.id !== 'wifi' && isWifiSelected;
                
                return (
                  <div 
                    key={option.id}
                    onClick={() => !isDisabled && togglePhysicalType(option.id)}
                    className={`cursor-pointer p-4 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                        : isDisabled
                          ? 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                          : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="text-xpertech-cyan mr-2">{option.icon}</div>
                          <h4 className="font-bold">{option.name}</h4>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xpertech-cyan font-bold">{option.cost}</span>
                        {isSelected && (
                          <Check className="text-xpertech-yellow" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {formData.physicalTypes?.includes('wifi') && (
              <div className="p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
                <p className="text-blue-300 text-sm">
                  ⚠️ Las cámaras WiFi no se pueden combinar con otros tipos físicos debido a su instalación especial.
                </p>
              </div>
            )}
          </div>
        );
        
      case 5: // Resolución
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resolución de imagen</h3>
            <p className="text-gray-400">Selecciona la resolución deseada para tus cámaras (mayor resolución = imagen más nítida)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resolutions.map(res => (
                <div 
                  key={res.id}
                  onClick={() => updateFormField('resolution', res.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.resolution === res.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold">{res.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {res.id === '2mp' && 'Calidad básica, suficiente para uso general y identificación básica'}
                        {res.id === '4mp' && 'Buena calidad, recomendada para la mayoría de casos de vigilancia'}
                        {res.id === '5mp' && 'Alta calidad, excelente para detalles importantes y reconocimiento'}
                        {res.id === '8mp' && 'Máxima calidad 4K, ideal para identificación precisa y zoom digital'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xpertech-cyan font-bold">{getResolutionCostIndicator(res.id)}</span>
                      {formData.resolution === res.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 6: // Sistema de Grabación (DVR/NVR + Grabación + Almacenamiento)
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="flex space-x-4">
                  <Camera className="h-8 w-8 text-xpertech-cyan" />
                  <Disc className="h-8 w-8 text-xpertech-yellow" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Sistema de grabación</h3>
              <p className="text-gray-400">Configura tu sistema de grabación y almacenamiento</p>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold mb-3">¿Ya tienes un DVR/NVR?</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'yes', name: 'Sí, ya tengo equipo', desc: 'Usaremos tu equipo actual (verificaremos compatibilidad)', cost: '$' },
                    { id: 'no', name: 'No, necesito uno nuevo', desc: 'Incluiremos un DVR/NVR nuevo y compatible en la cotización', cost: '$$$' }
                  ].map(option => (
                    <div 
                      key={option.id}
                      onClick={() => updateFormField('hasDvr', option.id)}
                      className={`cursor-pointer p-4 rounded-lg border transition-all ${
                        formData.hasDvr === option.id 
                          ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                          : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-bold">{option.name}</h5>
                          <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xpertech-cyan font-bold">{option.cost}</span>
                          {formData.hasDvr === option.id && (
                            <Check className="text-xpertech-yellow" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {formData.hasDvr === 'no' && (
                <div>
                  <h4 className="font-bold mb-3">Almacenamiento para grabaciones</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {storageOptionsSimplified.map(option => (
                      <div 
                        key={option.id}
                        onClick={() => updateFormField('storage', option.id)}
                        className={`cursor-pointer p-4 rounded-lg border transition-all ${
                          formData.storage === option.id 
                            ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                            : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-bold">{option.name}</h5>
                            <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xpertech-cyan font-bold">{getCostIndicator(option.price || 0)}</span>
                            {formData.storage === option.id && (
                              <Check className="text-xpertech-yellow" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 7: // Acceso Remoto
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <div className="flex space-x-4">
                  <Smartphone className="h-8 w-8 text-xpertech-cyan" />
                  <Monitor className="h-8 w-8 border-2 border-xpertech-yellow rounded" />
                </div>
              </div>
              <h3 className="text-xl font-bold">¿Necesitas acceso remoto?</h3>
              <p className="text-gray-400">Ve tus cámaras desde tu celular estés donde estés</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'yes', name: 'Sí, acceso desde mi celular', desc: 'App móvil para ver las cámaras desde cualquier lugar con internet', cost: '$$', icon: <Smartphone className="h-5 w-5" /> },
                { id: 'no', name: 'No, solo en el lugar', desc: 'Solo ver las cámaras en el monitor local del sistema', cost: '$', icon: <Monitor className="h-5 w-5" /> }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('remoteAccess', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.remoteAccess === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="text-xpertech-cyan mr-2">{option.icon}</div>
                        <h4 className="font-bold">{option.name}</h4>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xpertech-cyan font-bold">{option.cost}</span>
                      {formData.remoteAccess === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 8: // Monitor
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Monitor className="h-8 w-8 text-xpertech-cyan mx-auto mb-3" />
              <h3 className="text-xl font-bold">¿Necesitas un monitor?</h3>
              <p className="text-gray-400">Para visualizar las cámaras en el lugar</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { id: 'yes', name: 'Sí, necesito monitor', desc: 'Incluir monitor para ver las cámaras localmente', cost: '$$' },
                { id: 'no', name: 'No, no necesito', desc: 'Solo acceso remoto o ya tengo monitor', cost: '$' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('needsMonitor', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.needsMonitor === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">{option.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xpertech-cyan font-bold">{option.cost}</span>
                      {formData.needsMonitor === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.needsMonitor === 'yes' && (
              <div>
                <h4 className="font-bold mb-3">Tamaño del monitor</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { id: '19', name: '19"', cost: '$' },
                    { id: '21', name: '21"', cost: '$$' },
                    { id: '24', name: '24"', cost: '$$$' },
                    { id: '27', name: '27"', cost: '$$$$' }
                  ].map(option => (
                    <div 
                      key={option.id}
                      onClick={() => updateFormField('monitorSize', option.id)}
                      className={`cursor-pointer p-3 rounded-lg border transition-all text-center ${
                        formData.monitorSize === option.id 
                          ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                          : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      <h5 className="font-bold">{option.name}</h5>
                      <div className="flex items-center justify-center space-x-2 mt-1">
                        <span className="text-xpertech-cyan font-bold text-sm">{option.cost}</span>
                        {formData.monitorSize === option.id && (
                          <Check className="text-xpertech-yellow h-4 w-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 9: // Instalación
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Necesitas cableado, montaje o complementos?</h3>
            <p className="text-gray-400">Selecciona el nivel de servicio que necesitas</p>
            <div className="grid grid-cols-1 gap-4 mb-4">
              {installationServiceOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('installationService', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.installationService === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xpertech-cyan font-bold">{getCostIndicator(option.price || 0)}</span>
                      {formData.installationService === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {(formData.installationService === 'complete' || formData.installationService === 'accessories') && (
              <div className="space-y-2">
                <Label htmlFor="cableLength">Distancia aproximada total de cableado:</Label>
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => updateFormField('cableLength', Math.max(1, (formData.cableLength || 10) - 5))}
                    className="text-lg h-10 w-10 p-0"
                  >
                    -
                  </Button>
                  <span className="text-xl font-bold w-16 text-center">{formData.cableLength || 10}m</span>
                  <Button 
                    variant="outline" 
                    onClick={() => updateFormField('cableLength', (formData.cableLength || 10) + 5)}
                    className="text-lg h-10 w-10 p-0"
                  >
                    +
                  </Button>
                </div>
                <p className="text-gray-400 text-sm">Incluye cable coaxial o UTP, conectores y alimentación eléctrica</p>
              </div>
            )}
          </div>
        );
        
      case 10: // Ubicación
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="h-8 w-8 text-xpertech-cyan mx-auto mb-3" />
              <h3 className="text-xl font-bold">Datos de contacto</h3>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación de instalación:</Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => updateFormField('location', e.target.value)}
                placeholder="Ej: Centro, Tapachula" 
                className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
              />
              <p className="text-gray-400 text-sm">Esta información nos ayuda a coordinar la instalación y calcular costos de traslado.</p>
            </div>
          </div>
        );
        
      case 11: // Resultado
        return quotationResult ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-xpertech-yellow/20 rounded-full mb-4">
                <Check className="h-8 w-8 text-xpertech-yellow" />
              </div>
              <h3 className="text-2xl font-bold text-center text-xpertech-yellow mb-2">¡Cotización Lista!</h3>
              <p className="text-gray-400">Tu sistema de videovigilancia personalizado</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Resumen del Sistema */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="font-bold text-lg text-xpertech-cyan">📋 Resumen del Sistema</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Cámaras:</span>
                      <span className="font-medium">{formData.interiorCount + formData.exteriorCount} total ({formData.interiorCount} interior, {formData.exteriorCount} exterior)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Visión nocturna:</span>
                      <span className="font-medium">{getSpanishValue('nightVisionType', formData.nightVisionType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tecnología:</span>
                      <span className="font-medium">{getSpanishValue('technologyType', formData.technologyType)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo físico:</span>
                      <span className="font-medium">{getSpanishValue('physicalTypes', '') || 'Ninguno'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Resolución:</span>
                      <span className="font-medium">{resolutions.find(r => r.id === formData.resolution)?.name || 'No seleccionada'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Acceso remoto:</span>
                      <span className="font-medium">{getSpanishValue('remoteAccess', formData.remoteAccess)}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monitor:</span>
                      <span className="font-medium">{getSpanishValue('needsMonitor', formData.needsMonitor)}{formData.needsMonitor === 'yes' && formData.monitorSize ? ` (${formData.monitorSize}")` : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">DVR/NVR:</span>
                      <span className="font-medium">{getSpanishValue('hasDvr', formData.hasDvr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Instalación:</span>
                      <span className="font-medium">{getSpanishValue('installationService', formData.installationService)}</span>
                    </div>
                    {(formData.installationService === 'complete' || formData.installationService === 'accessories') && formData.cableLength && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cable:</span>
                        <span className="font-medium">{formData.cableLength} metros</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Almacenamiento:</span>
                      <span className="font-medium">{storageOptionsSimplified.find(s => s.id === formData.storage)?.name || 'No seleccionado'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ubicación:</span>
                      <span className="font-medium">{formData.location || 'No especificada'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cotización y CTA */}
              <div className="flex flex-col justify-center space-y-4">
                <div className="text-center">
                  <div className="p-6 bg-gradient-to-r from-xpertech-yellow/10 to-xpertech-cyan/10 rounded-lg border border-xpertech-yellow/20 mb-4">
                    <p className="text-3xl font-bold text-xpertech-yellow mb-1">{formatPrice(quotationResult.total)}</p>
                    <p className="text-gray-400">Cotización estimada</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-6 text-lg font-bold shadow-lg transform transition-all duration-200 hover:scale-105"
                    asChild
                  >
                    <a 
                      href={`https://wa.me/529621765599?text=${generateWhatsAppText()}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                      </svg>
                      Solicitar Cotización
                    </a>
                  </Button>
                  
                  <p className="text-gray-400 text-sm mt-3">
                    * Esta cotización es un estimado. Para un presupuesto detallado y visita técnica gratuita, contáctanos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-xpertech-yellow mx-auto mb-4"></div>
            <p>Calculando tu cotización personalizada...</p>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // Ubicación
        return formData.interiorCount > 0 || formData.exteriorCount > 0;
      case 2: // Visión Nocturna
        return !!formData.nightVisionType;
      case 3: // Tecnología
        return !!formData.technologyType;
      case 4: // Tipo Físico
        return formData.physicalTypes && formData.physicalTypes.length > 0;
      case 5: // Resolución
        return !!formData.resolution;
      case 6: // Sistema de Grabación
        if (formData.hasDvr === 'no') {
          return !!formData.hasDvr && !!formData.storage;
        }
        return !!formData.hasDvr;
      case 7: // Acceso Remoto
        return !!formData.remoteAccess;
      case 8: // Monitor
        if (formData.needsMonitor === 'yes') {
          return !!formData.needsMonitor && !!formData.monitorSize;
        }
        return !!formData.needsMonitor;
      case 9: // Instalación
        return !!formData.installationService;
      case 10: // Ubicación
        return true; // Location is optional
      default:
        return true;
    }
  };
  
  return (
    <section id="quote" className="py-24 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Cotizador de <span className="text-xpertech-yellow">Cámaras</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Diseña tu sistema de videovigilancia personalizado en simples pasos y obtén una cotización al instante.
          </p>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="hidden md:flex flex-wrap justify-center gap-2 max-w-6xl">
            {steps.map((step, index) => (
              <div 
                key={index}
                onClick={() => handleStepClick(index)}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors rounded-lg whitespace-nowrap ${
                  currentStep > index + 1
                    ? 'bg-xpertech-cyan/20 text-white hover:bg-xpertech-cyan/30' 
                    : currentStep === index + 1
                      ? 'bg-xpertech-yellow/20 text-xpertech-yellow border border-xpertech-yellow/40' 
                      : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <span className="text-xpertech-yellow font-bold">Paso {currentStep}</span>
            <span className="text-gray-400">de {steps.length}</span>
          </div>
        </div>
        
        <Card ref={cotizadorRef} className="bg-black/50 border border-gray-800 p-6 md:p-8 max-w-4xl mx-auto">
          {renderStepContent()}
          
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="border-gray-700 text-gray-300"
            >
              Anterior
            </Button>
            
            <Button 
              onClick={handleNextStep}
              disabled={!isStepValid()}
              className={`${
                currentStep === steps.length
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-xpertech-yellow text-black hover:bg-xpertech-yellow/90'
              }`}
            >
              {currentStep === steps.length - 1 
                ? 'Calcular Cotización' 
                : currentStep === steps.length 
                  ? 'Finalizar' 
                  : 'Siguiente'}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default QuotationWizard;
