"use client";

import CTASection from "@/components/CTASection";
import FeaturesSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";


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
