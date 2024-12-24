"use client";

import { motion } from "framer-motion";
import { ArrowRight, DollarSign, Shield, UserX, Webhook } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MotionCard = motion(Card);

export function WebhookReliability() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container px-4 mx-auto max-w-6xl space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            The Real Cost of Webhook Failures
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Industry standards accept a 0.5% failure rate. But what does this
            mean for your business?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden h-full"
          >
            <CardHeader className="relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <Webhook className="w-12 h-12 text-primary mb-6" />
              <CardTitle className="text-2xl mb-4">
                The 1-in-200 Reality
              </CardTitle>
              <p className="text-muted-foreground">
                According to Shopify&apos;s standards, a 0.5% failure rate—or 1
                in every 200 webhooks failing—is considered acceptable. But the
                impact on your business is far from negligible.
              </p>
            </CardHeader>
            <CardContent>
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
              <p className="text-sm text-muted-foreground mt-2">
                Visual representation: 199 successful (99.5%) vs 1 failed (0.5%)
                webhook
              </p>
            </CardContent>
          </MotionCard>

          <div className="space-y-6">
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">
                    Customer Lifetime Value at Risk
                  </CardTitle>
                  <p className="text-muted-foreground">
                    With an average LTV of $50, each webhook failure puts
                    valuable customer relationships at risk.
                  </p>
                </div>
              </CardContent>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <UserX className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-lg mb-2">
                    Beyond the Numbers
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Failed webhooks can lead to negative reviews, word-of-mouth
                    damage, and public backlash.
                  </p>
                </div>
              </CardContent>
            </MotionCard>

            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-primary text-primary-foreground"
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary-foreground/10">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg mb-2 tracking-tight">
                    The Smart Investment
                  </CardTitle>
                  <p className="text-primary-foreground">
                    Invest $0.44 to protect 200 webhooks and secure a $50
                    customer—that&apos;s a 113x return on your investment.
                  </p>
                </div>
              </CardContent>
            </MotionCard>
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-1">
          <Button
            size="lg"
            className="w-fit bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 text-base sm:text-lg md:text-xl lg:text-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            asChild
          >
            <Link href="/login">
              Protect your revenue <ArrowRight />
            </Link>
          </Button>
          <Button asChild variant="link">
            <Link href="/blog/webhook-failure-rate">Read More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
