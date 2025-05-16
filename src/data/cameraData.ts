
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

export interface QuoteFormData {
  cameraCount: number;
  cameraType: string;
  resolution: string;
  installationType: string;
  recording: string;
  remoteAccess: string;
  hasDvr: string;
  needsCabling: string;
  cableLength?: number;
  storage: string;
  location: string;
}

export const calculateQuote = (formData: QuoteFormData): { 
  subtotal: number; 
  total: number; 
  details: { item: string; quantity: number; unitPrice: number; total: number }[] 
} => {
  let total = 0;
  const details: { item: string; quantity: number; unitPrice: number; total: number }[] = [];

  // Camera cost
  const selectedCameraType = cameraTypes.find(type => type.id === formData.cameraType);
  if (selectedCameraType) {
    const cameraPrice = selectedCameraType.basePrice;
    total += cameraPrice * formData.cameraCount;
    details.push({
      item: `Cámara ${selectedCameraType.name}`,
      quantity: formData.cameraCount,
      unitPrice: cameraPrice,
      total: cameraPrice * formData.cameraCount
    });
  }

  // Resolution
  const selectedResolution = resolutions.find(res => res.id === formData.resolution);
  if (selectedResolution && selectedResolution.price) {
    total += selectedResolution.price * formData.cameraCount;
    details.push({
      item: `Resolución ${selectedResolution.name}`,
      quantity: formData.cameraCount,
      unitPrice: selectedResolution.price,
      total: selectedResolution.price * formData.cameraCount
    });
  }

  // Installation
  const selectedInstallation = installationTypes.find(inst => inst.id === formData.installationType);
  if (selectedInstallation && selectedInstallation.price) {
    total += selectedInstallation.price * formData.cameraCount;
    details.push({
      item: `Instalación ${selectedInstallation.name}`,
      quantity: formData.cameraCount,
      unitPrice: selectedInstallation.price,
      total: selectedInstallation.price * formData.cameraCount
    });
  }

  // Recording
  const selectedRecording = recordingOptions.find(rec => rec.id === formData.recording);
  if (selectedRecording && selectedRecording.price) {
    total += selectedRecording.price;
    details.push({
      item: `Grabación`,
      quantity: 1,
      unitPrice: selectedRecording.price,
      total: selectedRecording.price
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

  // Cabling
  const selectedCabling = cablingOptions.find(cab => cab.id === formData.needsCabling);
  if (selectedCabling && selectedCabling.price && formData.needsCabling === 'yes' && formData.cableLength) {
    const cablingCost = selectedCabling.price * formData.cableLength;
    total += cablingCost;
    details.push({
      item: `Cableado (${formData.cableLength} metros)`,
      quantity: formData.cableLength,
      unitPrice: selectedCabling.price,
      total: cablingCost
    });
  }

  // Storage
  const selectedStorage = storageOptions.find(storage => storage.id === formData.storage);
  if (selectedStorage && selectedStorage.price) {
    total += selectedStorage.price;
    details.push({
      item: `Almacenamiento: ${selectedStorage.name}`,
      quantity: 1,
      unitPrice: selectedStorage.price,
      total: selectedStorage.price
    });
  }

  // Installation service fee
  const installationFee = 500;
  total += installationFee;
  details.push({
    item: 'Servicio de instalación',
    quantity: 1,
    unitPrice: installationFee,
    total: installationFee
  });

  const subtotal = total;
  
  return {
    subtotal,
    total,
    details
  };
};
