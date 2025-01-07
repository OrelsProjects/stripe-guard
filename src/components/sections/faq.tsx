import { FadeIn } from "@/components/animations/fade-in";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const eventsTrackedAnswer = () =>
  `   <ul>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Payment Intent Events:</strong>
      <ul>
        <li><strong>payment_intent.succeeded:</strong> Triggered when a payment is successfully completed.</li>
        <li><strong>payment_intent.payment_failed:</strong> Triggered when a payment attempt fails.</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Charge Events:</strong>
      <ul>
        <li><strong>charge.succeeded:</strong> Triggered when a charge is successfully processed.</li>
        <li><strong>charge.failed:</strong> Triggered when a charge attempt fails.</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Subscription Events:</strong>
      <ul>
        <li><strong>customer.subscription.created:</strong> Triggered when a new subscription is created.</li>
        <li><strong>customer.subscription.updated:</strong> Triggered when an existing subscription is updated.</li>
        <li><strong>customer.subscription.deleted:</strong> Triggered when a subscription is canceled or deleted.</li>
      </ul>
    </li>
    <li>
      <strong style="font-size: 20px; display: block; margin-top: 16px;">Invoice Events:</strong>
      <ul>
        <li><strong>invoice.payment_failed:</strong> Triggered when an invoice payment attempt fails.</li>
        <li><strong>invoice.payment_succeeded:</strong> Triggered when an invoice payment is successfully processed.</li>
      </ul>
    </li>
  </ul>`;

const faqs = [
  {
    question: "How will this service benefit my business?",
    answer:
      "Imagine you are a customer who just found out about the product.<br/><br/>You are excited, you want to buy it. You put your credit card in, payment proccessed.<br/>You expect to see a confirmation page, but instead, you see an error.<br/><br/>You try again, same thing. You are frustrated and don't know what to do.<br/><br/>This is what we prevent. We monitor your payment webhooks and alert you in real-time and send a nice email to the cutsomer, so they know you are on top of it.",
  },
  {
    question: "Why should I care?",
    answer:
      "Because when the customer doesn't get what they should, due to a failure with your webhooks, they will dispute the payment. And you might lose your account.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can be up and running in less than 5 minutes. Our simple setup process involves either logging in with your payment gateway or generating an API key using our step-by-step guide.",
  },
  {
    question: "What's considered a failed webhook?",
    answer:
      "Stripe defines a failed webhook as any event that returns a 4xx or 5xx HTTP status code or that takes longer than 10 seconds to respond. Our service monitors these events and alerts you in real-time. We wait 8.4 seconds, assuming 99.99% of the cases will not resolve in the 10th second, and to make sure our request doesn't timeout.",
  },
  {
    question: "Do you collect any data?",
    answer:
      "We only collect the data necessary to provide our service. We do not store any sensitive information regarding your customers or transactions.",
  },
  {
    question: "Which events do you track?",
    answer: eventsTrackedAnswer(),
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
            Here are some common questions about our service.
          </p>
        </FadeIn>

        <FadeIn delay={0.2}>
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
