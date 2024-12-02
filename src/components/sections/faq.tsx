import { FadeIn } from "@/components/animations/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How will this service benefit my business?",
    answer: "Our service helps you prevent revenue loss by instantly detecting and alerting you to payment failures. This means you can resolve issues quickly, keeping your cash flow healthy and your customers satisfied.",
  },
  {
    question: "Is there a limit to the number of webhooks I can monitor?",
    answer: "Our plans are designed to grow with your business. The Starter plan covers up to 1,000 events per month, while the Pro plan supports up to 10,000. For high-volume businesses, our Enterprise plan offers unlimited webhook monitoring.",
  },
  {
    question: "Can I integrate your service with my existing tools?",
    answer: "We offer integrations with popular tools and platforms. If you need a specific integration, just reach out to us at support@ourcompany.com, and we'll work on making it happen for you.",
  },
  {
    question: "How quickly can I get started?",
    answer: "You can be up and running in less than 5 minutes. Our simple setup process involves either logging in with your payment gateway or generating an API key using our step-by-step guide.",
  },
  {
    question: "What kind of support do you offer?",
    answer: "We provide comprehensive support to ensure your success. This includes 24/7 email support, detailed documentation, and for our Pro and Enterprise customers, priority phone support.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto">
        <FadeIn>
          <h2 className="text-3xl font-bold text-center sm:text-4xl mb-4">
            Questions? We&apos;ve Got Answers
          </h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Here are some common questions about our service. If you need more information, our support team is always here to help.
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

