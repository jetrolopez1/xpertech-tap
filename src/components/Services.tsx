
import React from 'react';
import { Card } from '@/components/ui/card';
import { Home, Camera, Settings, Search, Plus, ArrowRight } from 'lucide-react';

interface ServiceCardProps { 
  title: string;
  description: string;
  icon: React.ElementType;
  whatsappMessage: string;
}

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon,
  whatsappMessage
}: ServiceCardProps) => {
  const encodedMessage = encodeURIComponent(`Hola, vengo de su sitio web, me interesa ${whatsappMessage}`);
  const whatsappLink = `https://wa.me/529621765599?text=${encodedMessage}`;
  
  return (
    <a 
      href={whatsappLink}
      target="_blank" 
      rel="noopener noreferrer"
      className="block transition-transform hover:scale-105"
    >
      <Card className="bg-black/50 border border-gray-800 p-6 card-hover transition-all group">
        <div className="rounded-full bg-xpertech-yellow/10 w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-xpertech-yellow/20 transition-colors">
          <Icon className="text-xpertech-yellow" size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex items-center text-xpertech-cyan group-hover:translate-x-2 transition-transform">
          <span className="mr-2">Cotizar</span>
          <ArrowRight size={16} />
        </div>
      </Card>
    </a>
  );
};

const Services = () => {
  const services = [
    {
      title: 'Instalación de Cámaras',
      description: 'Instalación profesional de sistemas CCTV y videovigilancia para hogares y negocios.',
      icon: Camera,
      whatsappMessage: 'instalar cámaras de videovigilancia.'
    },
    {
      title: 'Soporte Técnico',
      description: 'Servicio técnico especializado para equipos de cómputo, servidores y dispositivos electrónicos.',
      icon: Settings,
      whatsappMessage: 'soporte técnico para mis equipos.'
    },
    {
      title: 'Venta de Equipos',
      description: 'Amplio catálogo de computadoras, laptops, accesorios y componentes de las mejores marcas.',
      icon: Home,
      whatsappMessage: 'comprar equipos de cómputo.'
    },
    {
      title: 'Servidores',
      description: 'Implementación y mantenimiento de infraestructura de servidores para empresas de todos los tamaños.',
      icon: Search,
      whatsappMessage: 'implementación de servidores para mi negocio.'
    },
    {
      title: 'Refacciones',
      description: 'Venta de refacciones originales y compatibles para equipos de cómputo y dispositivos electrónicos.',
      icon: Plus,
      whatsappMessage: 'comprar refacciones para mis equipos.'
    }
  ];

  return (
    <section id="services" className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros <span className="text-xpertech-cyan">Servicios</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            En Xpertech Tapachula ofrecemos soluciones integrales para todas tus necesidades tecnológicas.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
