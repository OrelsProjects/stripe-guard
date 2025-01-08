"use client";

import { motion } from "framer-motion";
import { DollarSign, UserX, Webhook } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MotionCard = motion(Card);

const BeyondTheNumbers = () => (
  <MotionCard
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <CardContent className="p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-destructive/10">
        <UserX className="w-6 h-6 text-destructive" />
      </div>
      <div>
        <CardTitle className="text-lg mb-2">Beyond the numbers</CardTitle>
        <p className="text-card-foreground">
          One failed webhook can <strong>tank your reputation</strong>. Negative
          reviews, social backlash, and word-of-mouth damage can create lasting
          harm that goes FAR beyond a single lost sale.
        </p>
      </div>
    </CardContent>
  </MotionCard>
);

const CustomerLifetimeValue = () => (
  <MotionCard
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.5 }}
  >
    <CardContent className="p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-primary/10">
        <DollarSign className="w-6 h-6 text-primary" />
      </div>
      <div>
        <CardTitle className="text-lg mb-2">
          Customer lifetime value at risk
        </CardTitle>
        <p className="text-card-foreground">
          The average LTV (lifetime value) of a customer is $50. One failed
          webhook can cost you 10.
        </p>
      </div>
    </CardContent>
  </MotionCard>
);

const Troubleshooting = () => (
  <MotionCard
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.6 }}
  >
    <CardContent className="p-6 flex items-start gap-4">
      <div className="p-3 rounded-lg bg-yellow-400/20">
        <Webhook className="w-6 h-6 text-yellow-500" />
      </div>
      <div>
        <CardTitle className="text-lg mb-2 tracking-tight">
          Troubleshooting
        </CardTitle>
        <p className="text-card-foreground">
          Identifying a single faulty webhook in a massive log system can take
          hours of developer time.
        </p>
      </div>
    </CardContent>
  </MotionCard>
);

export function WebhookReliability() {
  return (
    <section>
      <div className="container px-4 mx-auto max-w-6xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-card font-extrabold">
            One webhook failure <br />
            <p className="md:mt-4">
              can
              <span className="bg-card text-card-foreground px-2 ml-2 py-0">
                tank your reputation
              </span>
            </p>
          </h2>
          <p className="text-muted leading-relaxed md:text-lg max-w-3xl mx-auto">
            According to <span className="font-medium">Shopify</span>, 0.5%
            webhooks failure rate is good. That means that at least one webhook
            in every 200 will fail. One failed webhook will lead to a
            disappointed customer, negative reviews, and lost business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden h-full flex flex-col justify-center gap-6"
          >
            <CardHeader className="relative py-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Webhook className="w-12 h-12 text-primary mb-6" />
              <CardTitle className="text-2xl mb-4">
                The 1-in-200 reality
              </CardTitle>
              <p className="text-card-foreground">
                According to Shopify&apos;s standards, a 0.5% failure rate, or 1
                in every 200 webhooks failing, is considered acceptable.
              </p>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Successful (199)</span>
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.6 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span>Failed (1)</span>
                </motion.div>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
                className="relative h-8 bg-primary rounded-md overflow-hidden"
              >
                <motion.div
                  className="absolute right-20 top-0 bottom-0 w-[0.5%] bg-destructive"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "0.5%", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.5 }}
                />
              </motion.div>
              <p className="text-sm text-card-foreground mt-2">
                Visual representation: 199 successful (99.5%) vs 1 failed (0.5%)
                webhook
              </p>
            </CardContent>
          </MotionCard>

          <div className="space-y-6">
            <BeyondTheNumbers />
            <CustomerLifetimeValue />
            <Troubleshooting />
          </div>
        </div>
      </div>
    </section>
  );
}
