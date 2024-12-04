"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const faqData = [
  {
    id: "question-1",
    question: "How does it work?",
    answer:
      "StripeGuard is a Stripe webhook monitoring tool. It listens to the most important events and notifies you when one of the webhooks failed. For instance, if a user has resubscribed, but the webhook failed, the user will not get access to the product. You will be notified about this failure.",
  },
  {
    id: "question-2",
    question: "Can I have multiple Stripe accounts?",
    answer:
      "Yes, as many as you want. This feature is currently in the works. You can reach up and we'll push it up the priority list. Send us a <a href='mailto:orelsmail@gmail.com'>mail</a>.",
  },
  {
    id: "question-3",
    question: "Do I need coding skills?",
    answer:
      "Nope. StripeGuard is a no-code tool. You set up shop with a few clicks.",
  },
  {
    id: "question-4",
    question: "Do you need my Stripe API key?",
    answer:
      "You can create a Restricted API key with limited permissions for specific resources only.",
  },
  {
    id: "question-5",
    question: "What data do you collect?",
    answer:
      "Minimum required data to provide you with as much details about the webhooks as possible. We don't store any sensitive or personal data.",
  },
  {
    id: "question-6",
    question: "Can I build it myself?",
    answer:
      "Yes, you can. It will take weeks away from your core product and you'll have to maintain it. You can also use logs, but then you'll need to monitor them 24/7 and find the correct event.",
  },
  {
    id: "question-7",
    question: "Why should I care?",
    answer:
      "Because when the customer doesn't get what he should, due to a failure with your webhooks, he will dispute the payment. And you might lose your account.",
  },
  {
    id: "question-8",
    question: "I have another question",
    // contact us by email -> make the email a mailto link orelsmail@gmail.com
    answer:
      "Feel free to reach out to us by <a href='mailto:orelsmail@gmail.com'>mail</a>",
  },
];
export function PremiumFAQ() {
  const [openQuestions, setOpenQuestions] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter(q => q !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };
  return (
    <div className="mx-auto py-12 px-4 w-[90%] space-y-6">
      <h2 className="text-5xl font-extrabold text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="multiple" className="w-full">
        {faqData.map(faq => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger
              onClick={() => handleToggle(faq.id)}
              className={cn("text-2xl text-pretty hover:no-underline", {
                "text-primary": openQuestions.includes(faq.id),
              })}
            >
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-lg">
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
