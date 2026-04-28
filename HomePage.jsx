import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import PromoBanner from './components/PromoBanner';
import FeaturedMenu from './components/FeaturedMenu';
import OrderingExperience from './components/OrderingExperience';
import WhyChooseUs from './components/WhyChooseUs';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <div className="bg-neutral-50 min-h-screen flex flex-col">
      {/* Dismissible promo bar — scrolls away before nav sticks */}
      <PromoBanner />
      {/* Sticky nav sits below promo bar on load, sticks at top once promo scrolls away */}
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedMenu />
        <OrderingExperience />
        <WhyChooseUs />
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}
