
import React, { useState } from 'react';
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
    location: ''
  });
  
  const [quotationResult, setQuotationResult] = useState<ReturnType<typeof calculateQuote> | null>(null);
  
  const steps = [
    'Cantidad',
    'Tipo',
    'Resolución',
    'Instalación',
    'Grabación',
    'Acceso Remoto',
    'DVR/NVR',
    'Cableado',
    'Almacenamiento',
    'Ubicación',
    'Resultado'
  ];
  
  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  
  const generateWhatsAppText = () => {
    if (!quotationResult) return '';
    
    let message = `Hola, me interesa cotizar un sistema de cámaras con las siguientes características: `;
    message += `\n- Cantidad de cámaras: ${formData.cameraCount}`;
    message += `\n- Tipo: ${cameraTypes.find(type => type.id === formData.cameraType)?.name || formData.cameraType}`;
    message += `\n- Resolución: ${resolutions.find(res => res.id === formData.resolution)?.name || formData.resolution}`;
    message += `\n- Instalación: ${installationTypes.find(inst => inst.id === formData.installationType)?.name || formData.installationType}`;
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
      case 1: // Cantidad
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Cuántas cámaras necesitas?</h3>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => updateFormField('cameraCount', Math.max(1, formData.cameraCount - 1))}
                className="text-lg h-10 w-10 p-0"
              >
                -
              </Button>
              <span className="text-2xl font-bold w-10 text-center">{formData.cameraCount}</span>
              <Button 
                variant="outline" 
                onClick={() => updateFormField('cameraCount', formData.cameraCount + 1)}
                className="text-lg h-10 w-10 p-0"
              >
                +
              </Button>
            </div>
          </div>
        );
        
      case 2: // Tipo
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Selecciona el tipo de cámaras</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cameraTypes.map(type => (
                <div 
                  key={type.id}
                  onClick={() => updateFormField('cameraType', type.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.cameraType === type.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">{type.name}</h4>
                    {formData.cameraType === type.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{type.description}</p>
                  <p className="mt-2 font-bold text-xpertech-cyan">{formatPrice(type.basePrice)}</p>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 3: // Resolución
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Selecciona la resolución deseada</h3>
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
                  <div className="flex justify-between">
                    <h4 className="font-bold">{res.name}</h4>
                    {formData.resolution === res.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {res.price !== undefined && res.price > 0 && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(res.price)}</p>
                  )}
                  {res.price === 0 && (
                    <p className="mt-2 text-xpertech-cyan">Incluido en el precio base</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 4: // Instalación
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Dónde se instalarán las cámaras?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {installationTypes.map(type => (
                <div 
                  key={type.id}
                  onClick={() => updateFormField('installationType', type.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.installationType === type.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">{type.name}</h4>
                    {formData.installationType === type.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {type.price && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(type.price)} por cámara</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 5: // Grabación
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Requieres grabación?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recordingOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('recording', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.recording === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">{option.name}</h4>
                    {formData.recording === option.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {option.price && option.price > 0 && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(option.price)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 6: // Acceso Remoto
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Necesitas acceso remoto?</h3>
            <p className="text-gray-400">Podrás ver tus cámaras desde tu celular o computadora en cualquier parte del mundo.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {remoteAccessOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('remoteAccess', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.remoteAccess === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">{option.name}</h4>
                    {formData.remoteAccess === option.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {option.price && option.price > 0 && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(option.price)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 7: // DVR/NVR
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Ya cuentas con DVR/NVR?</h3>
            <p className="text-gray-400">El DVR/NVR es el dispositivo que grabará y controlará tus cámaras.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dvrOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('hasDvr', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.hasDvr === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">{option.name}</h4>
                    {formData.hasDvr === option.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {option.price && option.price > 0 && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(option.price)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 8: // Cableado
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">¿Necesitas cableado y montaje?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {cablingOptions.map(option => (
                <div 
                  key={option.id}
                  onClick={() => updateFormField('needsCabling', option.id)}
                  className={`cursor-pointer p-4 rounded-lg border transition-all ${
                    formData.needsCabling === option.id 
                      ? 'border-xpertech-yellow bg-xpertech-yellow/10' 
                      : 'border-gray-700 bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex justify-between">
                    <h4 className="font-bold">{option.name}</h4>
                    {formData.needsCabling === option.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {option.price && option.price > 0 && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(option.price)} / metro</p>
                  )}
                </div>
              ))}
            </div>
            
            {formData.needsCabling === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="cableLength">Longitud estimada en metros:</Label>
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
        
      case 9: // Almacenamiento
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Tipo de almacenamiento necesario</h3>
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
                  <div className="flex justify-between">
                    <h4 className="font-bold">{option.name}</h4>
                    {formData.storage === option.id && (
                      <Check className="text-xpertech-yellow" />
                    )}
                  </div>
                  {option.price && option.price > 0 && (
                    <p className="mt-2 text-xpertech-cyan">+ {formatPrice(option.price)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
        
      case 10: // Ubicación
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Ubicación aproximada</h3>
            <div className="space-y-2">
              <Label htmlFor="location">Indícanos la colonia o zona de instalación:</Label>
              <Input 
                id="location" 
                value={formData.location} 
                onChange={(e) => updateFormField('location', e.target.value)}
                placeholder="Ej: Centro, Tapachula" 
                className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
              />
              <p className="text-gray-400 text-sm">Esta información nos ayuda a estimar costos adicionales por distancia si fuera necesario.</p>
            </div>
          </div>
        );
        
      case 11: // Resultado
        return quotationResult ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-xpertech-yellow">Tu Cotización Personalizada</h3>
            
            <div className="p-4 bg-gray-900 rounded-lg">
              <h4 className="font-bold text-lg mb-2">Detalles del Sistema</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>Cantidad de cámaras: <span className="font-bold">{formData.cameraCount}</span></p>
                  <p>Tipo: <span className="font-bold">{cameraTypes.find(t => t.id === formData.cameraType)?.name}</span></p>
                  <p>Resolución: <span className="font-bold">{resolutions.find(r => r.id === formData.resolution)?.name}</span></p>
                  <p>Instalación: <span className="font-bold">{installationTypes.find(i => i.id === formData.installationType)?.name}</span></p>
                  <p>Grabación: <span className="font-bold">{formData.recording === 'yes' ? 'Sí' : 'No'}</span></p>
                </div>
                <div>
                  <p>Acceso Remoto: <span className="font-bold">{formData.remoteAccess === 'yes' ? 'Sí' : 'No'}</span></p>
                  <p>DVR/NVR: <span className="font-bold">{formData.hasDvr === 'yes' ? 'Incluido' : 'Nuevo (incluido)'}</span></p>
                  <p>Cableado: <span className="font-bold">{formData.needsCabling === 'yes' ? `Sí (${formData.cableLength} metros)` : 'No'}</span></p>
                  <p>Almacenamiento: <span className="font-bold">{storageOptions.find(s => s.id === formData.storage)?.name}</span></p>
                  <p>Ubicación: <span className="font-bold">{formData.location || 'No especificada'}</span></p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="p-2 text-left">Concepto</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Precio Unitario</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotationResult.details.map((detail, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-black' : 'bg-gray-900/50'}>
                      <td className="p-2 border-t border-gray-800">{detail.item}</td>
                      <td className="p-2 border-t border-gray-800 text-right">{detail.quantity}</td>
                      <td className="p-2 border-t border-gray-800 text-right">{formatPrice(detail.unitPrice)}</td>
                      <td className="p-2 border-t border-gray-800 text-right">{formatPrice(detail.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-900">
                    <td colSpan={3} className="p-2 font-bold text-right">Subtotal:</td>
                    <td className="p-2 font-bold text-right">{formatPrice(quotationResult.subtotal)}</td>
                  </tr>
                  <tr className="bg-xpertech-yellow/10">
                    <td colSpan={3} className="p-2 font-bold text-right text-xpertech-yellow">Total:</td>
                    <td className="p-2 font-bold text-right text-xpertech-yellow">{formatPrice(quotationResult.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            
            <div className="text-center pt-4">
              <p className="mb-2 text-gray-400">* Esta cotización es un estimado. Para un presupuesto detallado, contacta con nuestro equipo:</p>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg"
                asChild
              >
                <a 
                  href={`https://wa.me/529621765599?text=${generateWhatsAppText()}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Cotiza por WhatsApp
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
      case 1: // Cantidad
        return formData.cameraCount > 0;
      case 2: // Tipo
        return !!formData.cameraType;
      case 3: // Resolución
        return !!formData.resolution;
      case 4: // Instalación
        return !!formData.installationType;
      case 5: // Grabación
        return !!formData.recording;
      case 6: // Acceso Remoto
        return !!formData.remoteAccess;
      case 7: // DVR/NVR
        return !!formData.hasDvr;
      case 8: // Cableado
        return !!formData.needsCabling;
      case 9: // Almacenamiento
        return !!formData.storage;
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
          <div className="hidden md:flex overflow-hidden rounded-lg border border-gray-800 bg-black">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`px-4 py-2 text-sm ${
                  currentStep > index + 1
                    ? 'bg-xpertech-cyan/20 text-white' 
                    : currentStep === index + 1
                      ? 'bg-xpertech-yellow/20 text-xpertech-yellow' 
                      : 'bg-gray-900 text-gray-500'
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
        
        <Card className="bg-black/50 border border-gray-800 p-6 md:p-8 max-w-3xl mx-auto">
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
