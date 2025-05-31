
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Check } from 'lucide-react';

import { 
  cameraTypes, 
  resolutions, 
  installationTypes,
  recordingOptions,
  remoteAccessOptions,
  dvrOptions,
  cablingOptions,
  storageOptions,
  calculateQuote,
  QuoteFormData
} from '@/data/cameraData';

const QuotationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const cotizadorRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<QuoteFormData>({
    cameraCount: 1,
    cameraType: '',
    resolution: '',
    installationType: '',
    recording: '',
    remoteAccess: '',
    hasDvr: '',
    needsCabling: '',
    cableLength: 10,
    storage: '',
    location: '',
    // New fields for improved flow
    interiorCount: 0,
    exteriorCount: 0,
    nightVisionType: '',
    technologyType: '',
    physicalType: ''
  });
  
  const [quotationResult, setQuotationResult] = useState<ReturnType<typeof calculateQuote> | null>(null);
  
  const steps = [
    'Ubicación',
    'Visión Nocturna', 
    'Tecnología',
    'Tipo Físico',
    'Resolución',
    'Grabación',
    'Acceso Remoto',
    'DVR/NVR',
    'Cableado',
    'Almacenamiento',
    'Datos',
    'Resultado'
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
    if (stepIndex + 1 <= currentStep || stepIndex + 1 < currentStep) {
      setCurrentStep(stepIndex + 1);
      setTimeout(scrollToCotizador, 100);
    }
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
  
  const updateFormField = (field: keyof QuoteFormData, value: string | number) => {
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
  
  const generateWhatsAppText = () => {
    if (!quotationResult) return '';
    
    let message = `Hola, me interesa cotizar un sistema de cámaras con las siguientes características: `;
    message += `\n- Cámaras interiores: ${formData.interiorCount}`;
    message += `\n- Cámaras exteriores: ${formData.exteriorCount}`;
    message += `\n- Visión nocturna: ${formData.nightVisionType}`;
    message += `\n- Tecnología: ${formData.technologyType}`;
    message += `\n- Tipo físico: ${formData.physicalType}`;
    message += `\n- Resolución: ${resolutions.find(res => res.id === formData.resolution)?.name || formData.resolution}`;
    message += `\n- Grabación: ${formData.recording === 'yes' ? 'Sí' : 'No'}`;
    message += `\n- Acceso Remoto: ${formData.remoteAccess === 'yes' ? 'Sí' : 'No'}`;
    message += `\n- DVR/NVR: ${formData.hasDvr === 'yes' ? 'Ya cuento con uno' : 'Necesito uno'}`;
    message += `\n- Cableado: ${formData.needsCabling === 'yes' ? `Sí (${formData.cableLength} metros)` : 'No'}`;
    message += `\n- Almacenamiento: ${storageOptions.find(s => s.id === formData.storage)?.name || formData.storage}`;
    message += `\n- Ubicación: ${formData.location}`;
    message += `\n\nCotización estimada: ${formatPrice(quotationResult.total)}`;
    
    return encodeURIComponent(message);
  };
  
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Ubicación de cámaras
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold">¿Dónde necesitas las cámaras?</h3>
            <p className="text-gray-400">Selecciona la cantidad para cada ubicación</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-900 rounded-lg">
                <h4 className="font-bold mb-2">Cámaras para Interior</h4>
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
                <h4 className="font-bold mb-2">Cámaras para Exterior</h4>
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
            <p className="text-gray-400">¿Cómo necesitas ver durante la noche?</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'none', name: 'Sin visión nocturna', desc: 'Solo funcionan con luz natural o artificial', cost: '$' },
                { id: 'infrared', name: 'Con infrarrojos (IR)', desc: 'Ven en blanco y negro durante la noche', cost: '$$' },
                { id: 'full-color', name: 'A todo color', desc: 'Mantienen los colores incluso en la oscuridad', cost: '$$$' }
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
            <p className="text-gray-400">Elige la tecnología que mejor se adapte a tu presupuesto</p>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'analog', name: 'Analógica', desc: 'Más económica, calidad básica, instalación sencilla', cost: '$' },
                { id: 'ip', name: 'IP Digital', desc: 'Más moderna, mejor calidad, mayor flexibilidad y funciones', cost: '$$' }
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
            <p className="text-gray-400">Selecciona el diseño que mejor se adapte al lugar de instalación</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'bullet', name: 'Bullet', desc: 'Forma cilíndrica, ideal para exteriores, fácil instalación', cost: '$$' },
                { id: 'dome', name: 'Domo', desc: 'Diseño discreto y elegante, perfecto para interiores', cost: '$$' },
                { id: 'ptz', name: 'PTZ', desc: 'Se mueve y hace zoom, cubre áreas grandes', cost: '$$$$' },
                { id: 'wifi', name: 'WiFi', desc: 'Sin cables, instalación rápida y sencilla', cost: '$$$' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('physicalType', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.physicalType === option.id 
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
                      {formData.physicalType === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 5: // Resolución
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resolución de imagen</h3>
            <p className="text-gray-400">Mayor resolución = imagen más nítida y detallada</p>
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
                        {res.id === '2mp' && 'Calidad básica, suficiente para uso general'}
                        {res.id === '4mp' && 'Buena calidad, recomendada para la mayoría de casos'}
                        {res.id === '5mp' && 'Alta calidad, excelente para detalles importantes'}
                        {res.id === '8mp' && 'Máxima calidad 4K, ideal para identificación precisa'}
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
        
      case 6: // Grabación
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Requieres grabación?</h3>
            <p className="text-gray-400">La grabación te permite revisar eventos pasados</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'yes', name: 'Sí, necesito grabación', desc: 'Podrás revisar lo que pasó en cualquier momento', cost: '$$' },
                { id: 'no', name: 'No, solo monitoreo en vivo', desc: 'Solo ver las cámaras en tiempo real', cost: '$' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('recording', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.recording === option.id 
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
                      {formData.recording === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 7: // Acceso Remoto
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Necesitas acceso remoto?</h3>
            <p className="text-gray-400">Ve tus cámaras desde tu celular estés donde estés</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'yes', name: 'Sí, acceso desde mi celular', desc: 'App móvil para ver las cámaras desde cualquier lugar', cost: '$$' },
                { id: 'no', name: 'No, solo en el lugar', desc: 'Solo ver las cámaras en el monitor local', cost: '$' }
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
                      <h4 className="font-bold">{option.name}</h4>
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
        
      case 8: // DVR/NVR
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Ya tienes DVR/NVR?</h3>
            <p className="text-gray-400">Es el equipo que controla y graba las cámaras</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'yes', name: 'Sí, ya tengo uno', desc: 'Usaremos tu equipo actual (si es compatible)', cost: '$' },
                { id: 'no', name: 'No, necesito uno nuevo', desc: 'Incluiremos un DVR/NVR nuevo en la cotización', cost: '$$$' }
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
                      <h4 className="font-bold">{option.name}</h4>
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
        );
        
      case 9: // Cableado
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Necesitas cableado y montaje?</h3>
            <p className="text-gray-400">Instalación completa con cables y soportes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {[
                { id: 'yes', name: 'Sí, instalación completa', desc: 'Incluye cables, conectores y montaje profesional', cost: '$$' },
                { id: 'no', name: 'No, yo me encargo', desc: 'Solo necesito las cámaras y equipos', cost: '$' }
              ].map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('needsCabling', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.needsCabling === option.id 
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
                      {formData.needsCabling === option.id && (
                        <Check className="text-xpertech-yellow" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.needsCabling === 'yes' && (
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
              </div>
            )}
          </div>
        );
        
      case 10: // Almacenamiento
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Almacenamiento para grabaciones</h3>
            <p className="text-gray-400">¿Dónde quieres guardar las grabaciones?</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {storageOptions.map(option => (
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
                      <h4 className="font-bold">{option.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">
                        {option.id === 'none' && 'Solo monitoreo, sin grabaciones'}
                        {option.id === '1tb' && 'Almacena aproximadamente 1-2 semanas'}
                        {option.id === '2tb' && 'Almacena aproximadamente 3-4 semanas'}
                        {option.id === '4tb' && 'Almacena aproximadamente 2-3 meses'}
                        {option.id === 'cloud' && 'Respaldo en la nube, acceso desde cualquier lugar'}
                      </p>
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
        );
        
      case 11: // Ubicación
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Datos de contacto</h3>
            <div className="space-y-2">
              <Label htmlFor="location">Ubicación de instalación:</Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => updateFormField('location', e.target.value)}
                placeholder="Ej: Centro, Tapachula" 
                className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
              />
              <p className="text-gray-400 text-sm">Esta información nos ayuda a coordinar la instalación.</p>
            </div>
          </div>
        );
        
      case 12: // Resultado
        return quotationResult ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-xpertech-yellow">Tu Cotización Personalizada</h3>
            
            <div className="p-4 bg-gray-900 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Resumen del Sistema</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>Cámaras interiores: <span className="font-bold">{formData.interiorCount}</span></p>
                  <p>Cámaras exteriores: <span className="font-bold">{formData.exteriorCount}</span></p>
                  <p>Visión nocturna: <span className="font-bold">{formData.nightVisionType}</span></p>
                  <p>Tecnología: <span className="font-bold">{formData.technologyType}</span></p>
                  <p>Tipo físico: <span className="font-bold">{formData.physicalType}</span></p>
                  <p>Resolución: <span className="font-bold">{resolutions.find(r => r.id === formData.resolution)?.name}</span></p>
                </div>
                <div>
                  <p>Grabación: <span className="font-bold">{formData.recording === 'yes' ? 'Sí' : 'No'}</span></p>
                  <p>Acceso Remoto: <span className="font-bold">{formData.remoteAccess === 'yes' ? 'Sí' : 'No'}</span></p>
                  <p>DVR/NVR: <span className="font-bold">{formData.hasDvr === 'yes' ? 'Incluido' : 'Nuevo (incluido)'}</span></p>
                  <p>Instalación: <span className="font-bold">{formData.needsCabling === 'yes' ? `Completa (${formData.cableLength}m)` : 'Solo equipos'}</span></p>
                  <p>Almacenamiento: <span className="font-bold">{storageOptions.find(s => s.id === formData.storage)?.name}</span></p>
                  <p>Ubicación: <span className="font-bold">{formData.location || 'No especificada'}</span></p>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <div className="mb-4 p-6 bg-xpertech-yellow/10 rounded-lg border border-xpertech-yellow/20">
                <p className="text-2xl font-bold text-xpertech-yellow">{formatPrice(quotationResult.total)}</p>
                <p className="text-gray-400 mt-2">Cotización estimada</p>
              </div>
              <p className="mb-4 text-gray-400">* Esta cotización es un estimado. Para un presupuesto detallado, contacta con nuestro equipo:</p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                asChild
              >
                <a 
                  href={`https://wa.me/529621765599?text=${generateWhatsAppText()}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Solicitar Cotización por WhatsApp
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">Calculando...</div>
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
        return !!formData.physicalType;
      case 5: // Resolución
        return !!formData.resolution;
      case 6: // Grabación
        return !!formData.recording;
      case 7: // Acceso Remoto
        return !!formData.remoteAccess;
      case 8: // DVR/NVR
        return !!formData.hasDvr;
      case 9: // Cableado
        return !!formData.needsCabling;
      case 10: // Almacenamiento
        return !!formData.storage;
      case 11: // Ubicación
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
          <div className="hidden md:flex overflow-hidden rounded-lg border border-gray-800 bg-black">
            {steps.map((step, index) => (
              <div 
                key={index}
                onClick={() => handleStepClick(index)}
                className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                  currentStep > index + 1
                    ? 'bg-xpertech-cyan/20 text-white hover:bg-xpertech-cyan/30' 
                    : currentStep === index + 1
                      ? 'bg-xpertech-yellow/20 text-xpertech-yellow' 
                      : 'bg-gray-900 text-gray-500 hover:bg-gray-800'
                }`}
              >
                {index + 1}. {step}
              </div>
            ))}
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <span className="text-xpertech-yellow font-bold">Paso {currentStep}</span>
            <span className="text-gray-400">de {steps.length}</span>
          </div>
        </div>
        
        <Card ref={cotizadorRef} className="bg-black/50 border border-gray-800 p-6 md:p-8 max-w-3xl mx-auto">
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
