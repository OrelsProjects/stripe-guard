import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "John Doe",
    role: "CTO, TechCorp",
    content: "This tool has been a game-changer for our payment operations. We've seen a 30% reduction in failed payments since implementing it.",
  },
  {
    name: "Jane Smith",
    role: "Head of Finance, E-commerce Giant",
    content: "The real-time alerts have saved us countless hours of manual work. Our team can now focus on strategic initiatives instead of troubleshooting.",
  },
  {
    name: "Alex Johnson",
    role: "Founder, SaaS Startup",
    content: "As a growing startup, every dollar counts. This solution has helped us maintain a healthy cash flow by catching payment issues early.",
  },
];

const endorsements = [
  {
    name: "Sarah Tech",
    role: "Fintech Influencer",
    content: "A must-have tool for any business serious about optimizing their payment processes.",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            See what our customers and industry experts have to say about our solution.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3 mb-16">
          {testimonials.map((testimonial, index) => (
            <FadeIn key={testimonial.name} delay={index * 0.1}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 italic">&quot;{testimonial.content}&quot;</p>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3}>
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Expert Endorsement</h3>
              {endorsements.map((endorsement, index) => (
                <div key={endorsement.name}>
                  <p className="mb-2 italic">&quot;{endorsement.content}&quot;</p>
                  <p className="font-semibold">{endorsement.name}</p>
                  <p className="text-sm text-muted-foreground">{endorsement.role}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  );
}

