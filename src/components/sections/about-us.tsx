import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function AboutUsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Why We Built This
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Our mission is to help businesses like yours secure their revenue and improve customer satisfaction.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-2 items-center">
          <FadeIn>
            <Card>
              <CardContent className="p-6">
                <Image
                  src="/founder-image.jpg"
                  alt="Founder"
                  width={400}
                  height={400}
                  className="rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">Orel Zilberman, Founder & CEO</h3>
                <p className="text-muted-foreground">
                &quot;As a developer, I&apos;ve seen firsthand how payment failures can impact businesses. That&apos;s why I created this solution - to give you the tools to prevent revenue loss and keep your customers happy.&quot;
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <p>
                We built this platform because we saw toomany businesses struggling with unexpected payment failures. These issues were causing revenue loss, customer frustration, and countless hours of manual troubleshooting.

We realized that by leveraging advanced webhook monitoring and real-time alerts, we could help businesses like yours:

1. Prevent revenue leakage from failed payments
2. Improve customer retention by addressing issues promptly
3. Save time and resources on manual tracking and problem-solving

Our solution is designed to be simple to set up yet powerful in its capabilities. We&apos;re committed to continually improving our platform based on user feedback and evolving payment technologies.

By choosing our service, you&apos;re not just getting a tool – you&apos;re gaining a partner dedicated to securing your revenue stream and enhancing your payment operations.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

