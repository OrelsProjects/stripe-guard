import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle } from 'lucide-react';

export function ProblemAgitationSection() {
  const problems = [
    {
      title: "Lost Revenue",
      description: "Missed payments lead to significant revenue loss and cash flow issues.",
    },
    {
      title: "Customer Churn",
      description: "Undetected payment failures result in frustrated customers and increased churn.",
    },
    {
      title: "Manual Overhead",
      description: "Hours wasted on manually tracking and resolving webhook failures.",
    },
  ];

  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            The Hidden Costs of Ignoring Webhook Failures
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Many businesses rely on outdated, manual methods to track webhook events. Here&apos;s what you&apos;re risking:
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem, index) => (
            <FadeIn key={problem.title} delay={index * 0.1}>
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <XCircle className="w-12 h-12 text-destructive mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{problem.title}</h3>
                  <p className="text-muted-foreground">{problem.description}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

