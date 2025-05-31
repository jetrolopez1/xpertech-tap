
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
  // New fields for improved flow
  interiorCount: number;
  exteriorCount: number;
  nightVisionType: string;
  technologyType: string;
  physicalType: string;
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

  // Adjust price based on physical type
  if (formData.physicalType === 'ptz') {
    baseCameraPrice += 2300;
  } else if (formData.physicalType === 'wifi') {
    baseCameraPrice += 400;
  } else if (formData.physicalType === 'dome') {
    baseCameraPrice += 200;
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
  if (formData.needsCabling === 'yes') {
    const installationFee = 500;
    total += installationFee;
    details.push({
      item: 'Servicio de instalación',
      quantity: 1,
      unitPrice: installationFee,
      total: installationFee
    });
  }

  const subtotal = total;
  
  return {
    subtotal,
    total,
    details
  };
};
