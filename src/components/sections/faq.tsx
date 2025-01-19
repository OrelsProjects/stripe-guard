import { FadeIn } from "@/components/animations/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const appName = process.env.NEXT_PUBLIC_APP_NAME;

const eventsTrackedAnswer = () =>
  `   <ul>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Payment Intent Events:</strong>
      <ul>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">payment_intent.succeeded:</strong> Triggered when a payment is successfully completed.</li>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">payment_intent.payment_failed:</strong> Triggered when a payment attempt fails.</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Charge Events:</strong>
      <ul>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">charge.succeeded:</strong> Triggered when a charge is successfully processed.</li>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">charge.failed:</strong> Triggered when a charge attempt fails.</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Subscription Events:</strong>
      <ul>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">customer.subscription.created:</strong> Triggered when a new subscription is created.</li>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">customer.subscription.updated:</strong> Triggered when an existing subscription is updated.</li>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">customer.subscription.deleted:</strong> Triggered when a subscription is canceled or deleted.</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Invoice Events:</strong>
      <ul>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">invoice.payment_failed:</strong> Triggered when an invoice payment attempt fails.</li>
        <li style="color: hsl(var(--foreground) / 0.7);"><strong style="color: hsl(var(--foreground) / 0.8);">invoice.payment_succeeded:</strong> Triggered when an invoice payment is successfully processed.</li>
      </ul>
    </li>
  </ul>`;

const upcomingFeatures = () => {
  return `
    <p>We work on features based on feedback. Our current lineup is:</p>
    <ul class="list-disc ml-6 flex flex-col gap-3">
      <li>
        Customizable emails to send the customer based on the event.
        <br />
        <p class="text-muted-foreground">
          <strong>Example:</strong> Send an email to the customer who left a cart and didn't complete the purchase, encouraging them to return and finalize their order.
        </p>
      </li>
      <li>
        Customizable alerts - choose which events to alert on.
        <br />
        <p class="text-muted-foreground">
          <strong>Example:</strong> Choose specific events to alert on, such as failed charges or subscription cancellations.
        </p>
      </li>
      <li>
        Choose which events to track.
        <br />
        <p class="text-muted-foreground">
          <strong>Example:</strong> Track only the events that are critical to your business.
        </p>
      </li>
    </ul>`;
};

const faqs = [
  {
    question: "Why should I care?",
    answer:
      "Tracking your webhooks can be difficult. We make it easy. We alert you in real-time when something goes wrong, so you can fix it before it becomes a problem.",
  },
  {
    question: "How quickly can I get started?",
    answer: "You can be up and running in less than 2 minutes. All",
  },
  {
    question: "What's considered a failed webhook?",
    answer:
      "Stripe defines a failed webhook as any event that returns a 4xx or 5xx HTTP status code or that takes longer than 10 seconds to respond. Our service monitors these events and alerts you in real-time.",
  },
  {
    question: "Do you collect any data?",
    answer:
      "We only collect the data necessary to provide our service. We do not store any sensitive information regarding your customers or transactions.",
  },
  {
    question: "Do you need my Stripe API Key?",
    answer:
      "You can create a Restricted API key with limited permissions for specific resources only.",
  },
  {
    question: "Do I need coding skills?",
    answer: `Nope. ${appName} is a no-code tool.`,
  },
  {
    question: "Which events do you track?",
    answer: `Right now we track the most critical events (listed below). If you need more, please let us know at <a href="mailto:orelsmail@gmail.com" 
    style="text-decoration: underline; color: hsl(var(--primary));"
    >personal email</a>
 ${eventsTrackedAnswer()}
      `,
  },
  {
    question: "Which features are upcoming next?",
    answer: upcomingFeatures(),
  },
  {
    question: "I have another question",
    answer: `<p>Fantastic, contact me at my <a href="mailto:orelsmail@gmail.com" 
    style="text-decoration: underline; color: hsl(var(--primary));"
    >personal email</a></p>`,
  },
];

export function FAQSection() {
  return (
    <section className="py-24 bg-muted/50">
      <div className="container px-4 mx-auto space-y-8">
        <FadeIn className="flex flex-col items-center justify-center">
          <h2 className="text-3xl sm:text-6xl font-bold tracking-tight">
            <span className="text-primary">Questions?</span> we&apos;ve got
            answers
          </h2>
        </FadeIn>

        <FadeIn>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-xl">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  );
}
