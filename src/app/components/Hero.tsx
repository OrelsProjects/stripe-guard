import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Monitor Your Stripe Payments with Ease
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Get real-time insights into your payment errors and subscription
          issues. Stay on top of your revenue with beautiful graphs and
          informative cards.
        </p>
        <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
          Start Monitoring <ArrowRight className="ml-2" />
        </Button>
      </div>
    </section>
  );
}
