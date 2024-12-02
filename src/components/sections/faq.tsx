import { FadeIn } from "@/components/animations/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does your webhook monitoring service work?",
    answer: "Our service integrates with your existing webhook infrastructure to monitor all incoming events. We track successful deliveries, failures, and retries, providing real-time alerts and detailed analytics to help you quickly identify and resolve issues.",
  },
  {
    question: "Is there a limit to the number of webhooks I can monitor?",
    answer: "Our plans offer different levels of webhook monitoring. The Starter plan allows up to 1,000 events per month, while the Pro plan supports up to 10,000. For businesses with higher volumes, our Enterprise plan offers unlimited webhook monitoring.",
  },
  {
    question: "Can I integrate your service with my existing tools?",
    answer: "Yes, we offer integrations with any popular tool you want. Send me an email and I'll take care of it at orelsmail@gmail.com",
  },
  {
    question: "Do you offer a free trial?",
    answer: "Yes, we offer a 14-day free trial for all our plans. You can sign up and start monitoring your webhooks immediately, with no credit card required for the trial period.",
  },
  {
    question: "How easy is it to set up your service?",
    answer: "Our service is designed for easy setup. You either login with Stripe or generate an API using our guide. It takes less than 2 minutes.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Got questions? We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, feel free to contact our support team.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}

