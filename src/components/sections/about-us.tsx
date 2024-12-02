import { FadeIn } from "@/components/animations/fade-in";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function AboutUsSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Our Mission
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            We&apos;re on a mission to revolutionize payment operations for businesses worldwide.
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
                  With over 8 years of experience in software development, Orel has been building solutions fulltime for over 400 days straight.
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <p>
                Our journey began when we noticed a recurring problem among businesses: the struggle to manage and monitor webhook events effectively. We saw companies losing revenue, customers, and valuable time due to undetected payment failures.
              </p>
              <p>
                That&apos;s when we decided to create a solution that would empower businesses to take control of their payment operations. We believe that with the right tools, companies can transform their webhook monitoring from a pain point into a competitive advantage.
              </p>
              <p>
                Today, we&apos;re proud to serve thousands of businesses worldwide, helping them secure their revenue streams and improve customer satisfaction. Our team of dedicated experts continues to innovate and refine our solution, staying ahead of the ever-evolving payment landscape.
              </p>
              <p>
                We&apos;re committed to empowering businesses of all sizes with enterprise-grade webhook monitoring capabilities. Our vision is a world where payment failures are caught and resolved before they can impact your bottom line or customer relationships.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

