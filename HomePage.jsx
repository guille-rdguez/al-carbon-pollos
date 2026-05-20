import { useEffect } from 'react';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import PromoBanner from './components/PromoBanner';
import FeaturedMenu from './components/FeaturedMenu';
import CateringCTA from './components/CateringCTA';
import OrderingExperience from './components/OrderingExperience';
import WhyChooseUs from './components/WhyChooseUs';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';

export default function HomePage() {
  useEffect(() => {
    if (!window.location.hash) return undefined;

    const timer = window.setTimeout(() => {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="bg-coal-950 min-h-screen flex flex-col text-coal-50">
      {/* Dismissible promo bar — scrolls away before nav sticks */}
      <PromoBanner />
      {/* Sticky nav sits below promo bar on load, sticks at top once promo scrolls away */}
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedMenu />
        <CateringCTA />
        <OrderingExperience />
        <WhyChooseUs />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}
