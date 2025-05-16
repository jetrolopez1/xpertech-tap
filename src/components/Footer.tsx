
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-xpertech-yellow">Xpertech Tapachula</h3>
            <p className="text-gray-300">
              Tu solución completa en tecnología, cámaras de videovigilancia, cómputo, 
              servidores y refacciones.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-xpertech-yellow">Dirección</h3>
            <p className="text-gray-300">6ta Av. Sur #11A</p>
            <p className="text-gray-300">Tapachula, Chiapas, México</p>
            <div className="mt-4">
              <h4 className="font-semibold text-xpertech-cyan">Horario de Atención:</h4>
              <p className="text-gray-300">Lunes-Viernes: 8:30 am - 8:00 pm</p>
              <p className="text-gray-300">Sábados: 8:30 am - 2:00 pm</p>
              <p className="text-gray-300">Domingos: Cerrado</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4 text-xpertech-yellow">Contacto</h3>
            <p className="text-gray-300">
              <a href="https://wa.me/529621765599" className="text-xpertech-cyan hover:underline">+52 962 176 5599</a>
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} Xpertech Tapachula. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
