export interface CameraOption {
  id: string;
  name: string;
  description?: string;
  price?: number;
}

export interface CameraType {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image?: string;
}

export const cameraTypes: CameraType[] = [
  { 
    id: 'ir', 
    name: 'Cámara IR', 
    description: 'Visión nocturna con iluminación infrarroja, ideal para vigilancia básica con luz baja', 
    basePrice: 1200 
  },
  { 
    id: 'full-color', 
    name: 'Full Color', 
    description: 'Visión nocturna a todo color sin necesidad de iluminación IR adicional', 
    basePrice: 1800 
  },
  { 
    id: 'ptz', 
    name: 'Cámara PTZ', 
    description: 'Control de movimiento Pan-Tilt-Zoom para máxima cobertura y seguimiento', 
    basePrice: 3500 
  },
  { 
    id: 'wifi', 
    name: 'Cámara WiFi', 
    description: 'Conexión inalámbrica sin necesidad de cableado', 
    basePrice: 1600 
  },
  { 
    id: 'dome', 
    name: 'Domo', 
    description: 'Diseño discreto ideal para interiores con visión panorámica', 
    basePrice: 1400 
  }
];

export const resolutions: CameraOption[] = [
  { id: '2mp', name: '2MP (1080p)', price: 0 },
  { id: '4mp', name: '4MP', price: 350 },
  { id: '5mp', name: '5MP', price: 500 },
  { id: '8mp', name: '8MP (4K)', price: 800 }
];

export const installationTypes: CameraOption[] = [
  { id: 'interior', name: 'Interior', price: 200 },
  { id: 'exterior', name: 'Exterior', price: 350 }
];

export const recordingOptions: CameraOption[] = [
  { id: 'yes', name: 'Sí', price: 1500 },
  { id: 'no', name: 'No', price: 0 }
];

export const remoteAccessOptions: CameraOption[] = [
  { id: 'yes', name: 'Sí', price: 500 },
  { id: 'no', name: 'No', price: 0 }
];

export const dvrOptions: CameraOption[] = [
  { id: 'yes', name: 'Sí, ya tengo', price: 0 },
  { id: 'no', name: 'No, necesito uno', price: 2500 }
];

export const cablingOptions: CameraOption[] = [
  { id: 'yes', name: 'Sí', price: 80 }, // precio por metro
  { id: 'no', name: 'No', price: 0 }
];

export const storageOptions: CameraOption[] = [
  { id: 'none', name: 'Ninguno', price: 0 },
  { id: '1tb', name: 'Disco Duro 1TB', price: 1200 },
  { id: '2tb', name: 'Disco Duro 2TB', price: 1800 },
  { id: '4tb', name: 'Disco Duro 4TB', price: 2800 },
  { id: 'cloud', name: 'Almacenamiento en la nube', price: 500 }
];

export const installationServiceOptions: CameraOption[] = [
  { id: 'complete', name: 'Instalación completa', description: 'Incluye cableado, montaje y configuración profesional', price: 500 },
  { id: 'accessories', name: 'Solo complementos', description: 'Conectores, alimentación y cable (sin instalación)', price: 150 },
  { id: 'none', name: 'Ninguno', description: 'Solo cámaras y equipo', price: 0 }
];

export const storageOptionsSimplified: CameraOption[] = [
  { id: 'none', name: 'Ninguno', description: 'Solo monitoreo en vivo', price: 0 },
  { id: '1tb', name: '1TB', description: 'Almacena aproximadamente 1-2 semanas', price: 1200 },
  { id: '2tb', name: '2TB', description: 'Almacena aproximadamente 3-4 semanas', price: 1800 },
  { id: '3tb', name: '3TB', description: 'Almacena aproximadamente 1-2 meses', price: 2400 },
  { id: '4tb', name: '4TB', description: 'Almacena aproximadamente 2-3 meses', price: 2800 },
  { id: 'cloud', name: 'Almacenamiento en la nube', description: 'Respaldo seguro con acceso desde cualquier lugar', price: 500 }
];

export const monitorOptions: CameraOption[] = [
  { id: '19', name: '19"', price: 800 },
  { id: '21', name: '21"', price: 1200 },
  { id: '24', name: '24"', price: 1800 },
  { id: '27', name: '27"', price: 2400 }
];

export interface QuoteFormData {
  cameraCount: number;
  cameraType: string;
  cameraTypes: string[]; // New: multiple camera types
  resolution: string;
  installationType: string;
  recording: string;
  remoteAccess: string;
  hasDvr: string;
  installationService: string; // New: replaces needsCabling
  cableLength?: number;
  storage: string;
  location: string;
  // New fields for improved flow
  interiorCount: number;
  exteriorCount: number;
  nightVisionType: string;
  technologyType: string;
  physicalType: string;
  physicalTypes: string[]; // New: multiple physical types
  needsMonitor: string;
  monitorSize: string;
}

export const calculateQuote = (formData: QuoteFormData): { 
  subtotal: number; 
  total: number; 
  details: { item: string; quantity: number; unitPrice: number; total: number }[] 
} => {
  let total = 0;
  const details: { item: string; quantity: number; unitPrice: number; total: number }[] = [];

  // Calculate total cameras
  const totalCameras = formData.interiorCount + formData.exteriorCount;

  // Base camera price (using a default base price)
  let baseCameraPrice = 1200;
  
  // Adjust price based on night vision type
  if (formData.nightVisionType === 'infrared') {
    baseCameraPrice += 200;
  } else if (formData.nightVisionType === 'full-color') {
    baseCameraPrice += 600;
  }

  // Adjust price based on technology type
  if (formData.technologyType === 'ip') {
    baseCameraPrice += 400;
  }

  // Adjust price based on physical types (multiple selection)
  if (formData.physicalTypes && formData.physicalTypes.length > 0) {
    let typeMultiplier = 0;
    formData.physicalTypes.forEach(type => {
      if (type === 'ptz') {
        typeMultiplier += 2300;
      } else if (type === 'wifi') {
        typeMultiplier += 400;
      } else if (type === 'dome') {
        typeMultiplier += 200;
      }
    });
    baseCameraPrice += typeMultiplier / formData.physicalTypes.length; // Average if multiple types
  }

  if (totalCameras > 0) {
    total += baseCameraPrice * totalCameras;
    details.push({
      item: `Cámaras (${formData.interiorCount} interior, ${formData.exteriorCount} exterior)`,
      quantity: totalCameras,
      unitPrice: baseCameraPrice,
      total: baseCameraPrice * totalCameras
    });
  }

  // Resolution
  const selectedResolution = resolutions.find(res => res.id === formData.resolution);
  if (selectedResolution && selectedResolution.price) {
    total += selectedResolution.price * totalCameras;
    details.push({
      item: `Resolución ${selectedResolution.name}`,
      quantity: totalCameras,
      unitPrice: selectedResolution.price,
      total: selectedResolution.price * totalCameras
    });
  }

  // Installation (interior vs exterior)
  if (formData.interiorCount > 0) {
    const interiorInstallation = installationTypes.find(inst => inst.id === 'interior');
    if (interiorInstallation && interiorInstallation.price) {
      total += interiorInstallation.price * formData.interiorCount;
      details.push({
        item: `Instalación Interior`,
        quantity: formData.interiorCount,
        unitPrice: interiorInstallation.price,
        total: interiorInstallation.price * formData.interiorCount
      });
    }
  }

  if (formData.exteriorCount > 0) {
    const exteriorInstallation = installationTypes.find(inst => inst.id === 'exterior');
    if (exteriorInstallation && exteriorInstallation.price) {
      total += exteriorInstallation.price * formData.exteriorCount;
      details.push({
        item: `Instalación Exterior`,
        quantity: formData.exteriorCount,
        unitPrice: exteriorInstallation.price,
        total: exteriorInstallation.price * formData.exteriorCount
      });
    }
  }

  // DVR/NVR
  const selectedDvr = dvrOptions.find(dvr => dvr.id === formData.hasDvr);
  if (selectedDvr && selectedDvr.price) {
    total += selectedDvr.price;
    details.push({
      item: `DVR/NVR`,
      quantity: 1,
      unitPrice: selectedDvr.price,
      total: selectedDvr.price
    });
  }

  // Installation Service
  const selectedInstallation = installationServiceOptions.find(inst => inst.id === formData.installationService);
  if (selectedInstallation && selectedInstallation.price) {
    total += selectedInstallation.price;
    details.push({
      item: selectedInstallation.name,
      quantity: 1,
      unitPrice: selectedInstallation.price,
      total: selectedInstallation.price
    });
  }

  // Cabling (if installation service requires it)
  if ((formData.installationService === 'complete' || formData.installationService === 'accessories') && formData.cableLength) {
    const cablingCost = 80 * formData.cableLength; // 80 pesos per meter
    total += cablingCost;
    details.push({
      item: `Cableado (${formData.cableLength} metros)`,
      quantity: formData.cableLength,
      unitPrice: 80,
      total: cablingCost
    });
  }

  // Storage
  const selectedStorage = storageOptionsSimplified.find(storage => storage.id === formData.storage);
  if (selectedStorage && selectedStorage.price) {
    total += selectedStorage.price;
    details.push({
      item: `Almacenamiento: ${selectedStorage.name}`,
      quantity: 1,
      unitPrice: selectedStorage.price,
      total: selectedStorage.price
    });
  }

  // Remote Access
  const selectedRemoteAccess = remoteAccessOptions.find(acc => acc.id === formData.remoteAccess);
  if (selectedRemoteAccess && selectedRemoteAccess.price) {
    total += selectedRemoteAccess.price;
    details.push({
      item: `Acceso Remoto`,
      quantity: 1,
      unitPrice: selectedRemoteAccess.price,
      total: selectedRemoteAccess.price
    });
  }

  // Monitor
  if (formData.needsMonitor === 'yes' && formData.monitorSize) {
    const selectedMonitor = monitorOptions.find(monitor => monitor.id === formData.monitorSize);
    if (selectedMonitor && selectedMonitor.price) {
      total += selectedMonitor.price;
      details.push({
        item: `Monitor ${selectedMonitor.name}`,
        quantity: 1,
        unitPrice: selectedMonitor.price,
        total: selectedMonitor.price
      });
    }
  }

  const subtotal = total;
  
  return {
    subtotal,
    total,
    details
  };
};
