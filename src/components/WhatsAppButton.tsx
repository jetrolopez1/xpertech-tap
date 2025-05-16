
import React from 'react';
import { MessageSquare } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/529621765599"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-3 rounded-full whatsapp-button hover:bg-green-600 transition-all transform hover:scale-110 duration-300"
      aria-label="Contact us on WhatsApp"
    >
      <MessageSquare size={28} />
    </a>
  );
};

export default WhatsAppButton;
