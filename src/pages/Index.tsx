
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import QuotationWizard from '../components/QuotationWizard';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <Services />
      <QuotationWizard />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
