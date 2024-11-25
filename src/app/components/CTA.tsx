import { Button } from "@/components/ui/button"

export
default function CTA() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Payments?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Start monitoring your Stripe payments and subscriptions today. Sign up now and get a 14-day free trial.
        </p>
        <Button size="lg" variant="secondary">
          Start Your Free Trial
        </Button>
      </div>
    </section>
  )
}

