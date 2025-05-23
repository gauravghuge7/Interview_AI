import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="bg-blue-600 text-white text-center py-16 mt-10 rounded-xl max-w-5xl mx-auto shadow-xl">
      <h2 className="text-3xl font-semibold mb-4">Start Interviewing Smarter Today</h2>
      <p className="text-lg mb-6">Let AI handle the first round of interviews for you.</p>
      <Button size="lg" variant="secondary">
        Try It Free
      </Button>
    </section>
  );
}
