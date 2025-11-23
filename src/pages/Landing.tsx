import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HeroSection } from './Landing/HeroSection';
import ApiPlayground from './Landing/ApiPlayground';
import { AboutSection } from './Landing/AboutSection';
import { ApisSection } from './Landing/ApisSection';
import { ApisInDevelopment } from './Landing/ApisInDevelopment';
import { CalculatorSection } from './Landing/CalculatorSection';
import { BenefitsSection } from './Landing/BenefitsSection';
import { CtaSection } from './Landing/CtaSection';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ApiPlayground />
      <AboutSection />
      <ApisSection />
      <ApisInDevelopment />
      <CalculatorSection />
      <BenefitsSection />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Landing;
