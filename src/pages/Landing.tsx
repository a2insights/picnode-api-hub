import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from './Landing/HeroSection';
import { AboutSection } from './Landing/AboutSection';
import { ApisSection } from './Landing/ApisSection';
import { CalculatorSection } from './Landing/CalculatorSection';
import { BenefitsSection } from './Landing/BenefitsSection';
import { CtaSection } from './Landing/CtaSection';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ApisSection />
      <CalculatorSection />
      <BenefitsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Landing;
