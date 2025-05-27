import { Card, CardContent } from "@/components/ui/card";
import { Mic, Bot, UserCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: <Mic className="h-10 w-10 text-blue-500 mb-4" />,
    title: "Voice-Based Interviews",
    desc: "Conduct AI-driven voice interviews with NLP.",
  },
  {
    icon: <Bot className="h-10 w-10 text-blue-500 mb-4" />,
    title: "Smart Questioning",
    desc: "Adaptive questions based on role and experience.",
  },
  {
    icon: <UserCheck className="h-10 w-10 text-blue-500 mb-4" />,
    title: "Instant Feedback",
    desc: "Get automated scoring and personality insights.",
  },
  {
    icon: <Sparkles className="h-10 w-10 text-blue-500 mb-4" />,
    title: "Seamless Integration",
    desc: "Plug into ATS or CRM with APIs.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto py-10">
      {features.map((feature, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col items-center text-center p-6">
            {feature.icon}
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{feature.desc}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
