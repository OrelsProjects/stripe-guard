import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepProps {
  title: string;
  description: string;
}

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  delay?: number;
  children: React.ReactNode;
}

export function AnimatedCard({
  delay = 0,
  children,
  className,
  ...props
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className={className} {...props}>
        <CardContent className="pt-6">{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function NotificationSteps() {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Always Ready for the Unexpected
      </h3>
      <Steps>
        <Step
          title="Instant Notifications"
          description="Get immediate alerts when a webhook fails."
        />
        <Step
          title="Customer Reassurance"
          description="Your customers receive a friendly email letting them know you’re on it."
        />
        <Step
          title="Effortless Follow-Up"
          description="Monitor and address issues seamlessly while keeping everyone informed."
        />
      </Steps>
    </div>
  );
}

function CustomerInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer-Centric Communication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg text-muted-foreground">
            Ensure your customers feel valued and informed:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Notify them their payment is under review",
              "Reassure them you’re actively resolving the issue",
              "Let them know there’s no need to worry",
              "Provide a direct way to contact support if needed",
            ].map((item, index) => (
              <li
                key={index}
                className="flex items-center gap-2 bg-secondary/20 p-3 rounded-lg"
              >
                <span className="text-primary">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function Step({ title, description }: StepProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <Check className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h4 className="font-medium leading-none mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

interface StepItemProps {
  number: number;
  text: string;
  delay: number;
}

export function StepItem({ number, text, delay }: StepItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 bg-secondary/5 p-3 rounded-lg"
    >
      <span className="text-primary font-bold">{number}.</span>
      {text}
    </motion.div>
  );
}

export function WhatIfWebhookFails() {
  return (
    <section className="py-12 px-4 max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Don&apos;t Let Failed Webhooks Kill Your Revenue
        </h2>
        <p className="text-lg text-muted-foreground">
          Protect your business from missed payments and lost transactions.
        </p>
      </motion.div>

      <div className="grid gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="bg-primary/5 border-primary/20">
            <AlertTitle className="text-primary">Revenue Protection</AlertTitle>
            <AlertDescription>
              Catch failed payment webhooks before they impact your bottom line.
            </AlertDescription>
          </Alert>
        </motion.div>

        <AnimatedCard delay={0.2}>
          <h3 className="font-semibold text-lg mb-4">
            How we protect your revenue stream:
          </h3>
          <div className="grid gap-3">
            <StepItem
              number={1}
              text="Instant alerts when payment webhooks fail, preventing revenue loss."
              delay={0.3}
            />
            <StepItem
              number={2}
              text="Automated customer communication to ensure payment completion."
              delay={0.4}
            />
            <StepItem
              number={3}
              text="Quick recovery process to maintain steady cash flow."
              delay={0.5}
            />
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.6} className="bg-primary/5 border-primary/20">
          <p className="text-lg">
            Set it up once and secure your revenue stream—we monitor your webhooks 24/7 so you never miss a payment.
          </p>
        </AnimatedCard>
      </div>
    </section>
  );
}
