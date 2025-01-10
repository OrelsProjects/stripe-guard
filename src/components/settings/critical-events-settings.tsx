"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { allEvents, criticalEvents } from "@/models/payment";
import { AlertTriangle, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface CriticalEventsSettingsProps {
  userCriticalEvents: string[];
  onChange: (events: string[]) => void;
  loading?: boolean;
}

const eventDisplayNames: Record<string, string> = {
  "payment_intent.succeeded": "Payment Intent Succeeded",
  "payment_intent.payment_failed": "Payment Intent Failed",
  "charge.succeeded": "Charge Succeeded",
  "charge.failed": "Charge Failed",
  "customer.subscription.created": "Subscription Created",
  "customer.subscription.updated": "Subscription Updated",
  "customer.subscription.deleted": "Subscription Deleted",
  "invoice.payment_failed": "Invoice Payment Failed",
  "invoice.payment_succeeded": "Invoice Payment Succeeded",
};

export function CriticalEventsSettings({
  userCriticalEvents,
  onChange,
  loading = false,
}: CriticalEventsSettingsProps) {
  const handleToggle = (event: string, checked: boolean) => {
    if (checked) {
      onChange([...userCriticalEvents, event]);
    } else {
      onChange(userCriticalEvents.filter(e => e !== event));
    }
  };

  return (
    <Card className="p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Bell className="h-5 w-5 text-primary mt-1" />
          <div>
            <h2 className="text-lg md:text-xl font-semibold">Critical Events</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Choose which webhook events should trigger customer notifications when they fail
            </p>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="critical-events">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <span>Configure Critical Events</span>
                {loading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {userCriticalEvents.length} selected
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {loading ? (
                <div className="space-y-4 pt-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-6 w-10" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6 pt-4">
                  {allEvents.map(event => (
                    <div
                      key={event}
                      className={cn(
                        "flex flex-col md:flex-row items-start md:items-center justify-between gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors",
                        {
                          "bg-primary/5 hover:bg-primary/5":
                            criticalEvents.includes(event),
                        },
                      )}
                    >
                      <div className="space-y-0.5">
                        <Label
                          className={cn("text-base cursor-pointer", {
                            "opacity-70": criticalEvents.includes(event),
                          })}
                        >
                          {eventDisplayNames[event] || event}
                        </Label>
                        <p
                          className={cn("text-xs text-muted-foreground", {
                            "opacity-80": criticalEvents.includes(event),
                          })}
                        >
                          {event}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {criticalEvents.includes(event) && (
                            <span className="flex items-center gap-1 text-primary">
                              <AlertTriangle className="h-3 w-3" />
                              High priority event
                            </span>
                          )}
                        </p>
                      </div>
                      <Switch
                        disabled={criticalEvents.includes(event)}
                        checked={userCriticalEvents.includes(event)}
                        onCheckedChange={checked => handleToggle(event, checked)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
}
