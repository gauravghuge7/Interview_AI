"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/jobSelection");
  };

  return (
    <section className="text-center max-w-4xl mx-auto py-20">
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        AI-Powered Interview Automation
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Automate candidate screening and make smarter hiring decisions.
      </p>
      <Button
        onClick={handleGetStarted}
        size="lg"
        className="text-white bg-blue-600 hover:bg-blue-700"
      >
        Get Started Free
      </Button>
    </section>
  );
}
