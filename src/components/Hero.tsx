
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Soluciones <span className="gradient-text">tecnológicas</span> para todas tus necesidades
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              En Xpertech Tapachula ofrecemos equipos de cómputo, cámaras de videovigilancia, 
              servidores y refacciones de la más alta calidad con servicio técnico especializado.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                asChild 
                className="bg-xpertech-yellow text-black hover:bg-xpertech-yellow/90 px-6 py-6 text-lg"
              >
                <a href="#quote">
                  Cotiza ahora <ArrowRight className="ml-2" size={18} />
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
            <div className="relative animate-float">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-xpertech-yellow to-xpertech-cyan rounded-full blur-lg opacity-20 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-48 h-48 md:w-64 md:h-64 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h3v2h4v-2h3l-5-5-5 5zm10-2h-3V7h-4v2H7l5 5 5-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
