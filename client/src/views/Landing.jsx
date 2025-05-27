import FeaturesSection from "../components/FeatureSection";
import HeroSection from "../components/HeroSection";
import CTASection from "../components/CTASection";
import Footer from "../components/Footer";


export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
