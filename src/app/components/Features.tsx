import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, BarChart2, Bell, CreditCard } from "lucide-react";

const features = [
  {
    title: "Real-time Error Tracking",
    description:
      "Instantly detect and analyze Stripe payment errors as they occur.",
    icon: AlertCircle,
  },
  {
    title: "Subscription Monitoring",
    description: "Keep track of subscription issues and prevent revenue loss.",
    icon: CreditCard,
  },
  {
    title: "Beautiful Visualizations",
    description:
      "View your data in stunning, easy-to-understand graphs and charts.",
    icon: BarChart2,
  },
  {
    title: "Instant Notifications",
    description: "Get alerted immediately when critical issues arise.",
    icon: Bell,
  },
];

export default function Features() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
