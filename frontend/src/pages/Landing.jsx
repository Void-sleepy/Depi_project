import React, { useEffect } from 'react';
import Nav from '../components/landing/Nav';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Steps from '../components/landing/Steps';
import Footer from '../components/landing/Footer';

export default function Landing() {
  useEffect(() => {
    // Add class for specific landing page styling if needed
    document.body.classList.add('landing-page');
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <Steps />
      <Footer />
    </>
  );
}
