
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="bg-black min-h-screen flex items-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 right-[20%] w-64 h-64 rounded-full bg-xpertech-cyan blur-[100px] animate-pulse-light"></div>
        <div className="absolute bottom-40 left-[10%] w-72 h-72 rounded-full bg-xpertech-yellow blur-[100px] animate-pulse-light"></div>
      </div>

      <div className="container mx-auto px-4 pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Soluciones de <span className="gradient-text">Videovigilancia y Tecnología</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Sistemas de seguridad avanzados, equipos de cómputo, servidores y refacciones.
              Todo lo que necesitas para tu negocio o hogar.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild 
                className="bg-xpertech-yellow text-black hover:bg-xpertech-yellow/90 px-6 py-6 text-lg"
              >
                <a href="#quote">
                  Cotizar cámaras <ArrowRight className="ml-2" size={18} />
                </a>
              </Button>
              <Button 
                variant="outline"
                asChild
                className="border-xpertech-cyan text-xpertech-cyan hover:bg-xpertech-cyan/10 px-6 py-6 text-lg"
              >
                <a href="#services">
                  Servicios
                </a>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md mx-auto">
              <div className="rounded-lg overflow-hidden border-2 border-xpertech-cyan shadow-[0_0_15px_rgba(0,255,255,0.5)] animate-pulse-slow">
                <img 
                  src="https://th.bing.com/th/id/OIP.HX4JoDkWaUyK2YUZ1vzxIwHaEK?rs=1&pid=ImgDetMain" 
                  alt="Sistema de videovigilancia" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
