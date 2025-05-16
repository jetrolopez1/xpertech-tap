
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo a la brevedad.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ponte en <span className="text-xpertech-yellow">Contacto</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o necesitas más información? Estamos aquí para ayudarte.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="border border-gray-800 bg-black/50 p-8 h-full">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-xpertech-yellow">Dirección</h3>
                  <p className="text-gray-400">6ta Av. Sur #11A</p>
                  <p className="text-gray-400">Tapachula, Chiapas, México</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-xpertech-yellow">Horario de Atención</h3>
                  <p className="text-gray-400">Lunes - Viernes: 8:30 am - 8:00 pm</p>
                  <p className="text-gray-400">Sábados: 8:30 am - 2:00 pm</p>
                  <p className="text-gray-400">Domingos: Cerrado</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-xpertech-yellow">Teléfono</h3>
                  <p className="text-gray-400">
                    <a href="https://wa.me/529621765599" className="text-xpertech-cyan hover:underline">+52 962 176 5599</a>
                  </p>
                </div>
                <div className="pt-6">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3855.0584375488266!2d-92.26214792374364!3d14.901128871232897!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x858e0f6747847b51%3A0xcc34651d34a1f132!2s6a%20Avenida%20Sur%2011a%2C%20Centro%2C%2030700%20Tapachula%20de%20Cordova%20y%20Ordo%C3%B1ez%2C%20Chis.!5e0!3m2!1ses-419!2smx!4v1715916101449!5m2!1ses-419!2smx" 
                    width="100%" 
                    height="300" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="border border-gray-800 bg-black/50 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre Completo</label>
                  <Input 
                    id="name" 
                    required 
                    className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Correo Electrónico</label>
                  <Input 
                    id="email" 
                    type="email" 
                    required 
                    className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">Teléfono</label>
                  <Input 
                    id="phone" 
                    className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Mensaje</label>
                  <Textarea 
                    id="message" 
                    rows={5} 
                    required 
                    className="bg-gray-900 border-gray-700 focus:border-xpertech-cyan" 
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-xpertech-yellow text-black hover:bg-xpertech-yellow/90"
                >
                  Enviar Mensaje
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
