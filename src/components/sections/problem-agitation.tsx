import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, ClipboardX } from "lucide-react";

export function ProblemAgitationSection() {
  const problems = [
    {
      title: "Lost Revenue",
      description:
        "Missed payments lead to significant revenue loss and cash flow issues.",
      icon: DollarSign, // Icon representing financial issues
    },
    {
      title: "Customer Churn",
      description:
        "Undetected payment failures result in frustrated customers and increased churn.",
      icon: Users, // Icon representing people leaving or customers
    },
    {
      title: "Manual Overhead",
      description:
        "Hours wasted on manually tracking and resolving webhook failures.",
      icon: ClipboardX, // Icon representing manual errors or tasks
    },
  ];

  return (
    <section className="py-24">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            The Hidden Costs of Ignoring Webhook Failures
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Many businesses rely on outdated, manual methods to track webhook
            events. Here&apos;s what you&apos;re risking:
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {problems.map((problem, index) => {
            const Icon = problem.icon; // Dynamically render the appropriate icon
            return (
              <FadeIn key={problem.title} delay={index * 0.1}>
                <Card className="h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Icon className="w-8 h-8 text-destructive mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
