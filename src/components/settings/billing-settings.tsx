"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plan } from "@/models/user";

export interface BillingSettingsProps {
  plan?: Plan; // Optional, to handle cases where no plan is provided
}

export function BillingSettings(props: BillingSettingsProps) {
  const { plan } = props;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Billing & Subscription</h2>
      <div className="space-y-6">
        {plan ? (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Current Plan</h3>
                <Badge>{plan.name}</Badge>
              </div>
              {(plan.price || plan.interval || plan.renewsAt) && (
                <p className="text-sm text-muted-foreground">
                  {plan.price && `$${plan.price}`}
                  {plan.interval && `/${plan.interval}`}
                  {plan.renewsAt &&
                    ` • Renews on ${new Date(plan.renewsAt).toLocaleDateString()}`}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              className="border-destructive/50 hover:bg-destructive/20 hover:text-destructive"
            >
              Stop plan
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-medium">Current Plan</h3>
                <Badge>Free</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Access basic features. Upgrade to unlock premium benefits.
              </p>
            </div>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => (window.location.href = "/premium")}
            >
              Subscribe Now
            </Button>
          </div>
        )}

        {plan?.billingHistory?.length ||
          (0 > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Billing History</h3>
              <div className="space-y-2">
                {plan?.billingHistory?.map(history => (
                  <div
                    key={history.invoiceId}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      {history.date && (
                        <p>{history.date.toLocaleDateString()}</p>
                      )}
                      {(history.planName || history.date) && (
                        <p className="text-muted-foreground">
                          {history.planName && `${history.planName} • `}
                          {history.date &&
                            history.date.toLocaleString("default", {
                              month: "long",
                              year: "numeric",
                            })}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {history.amount && <p>${history.amount.toFixed(2)}</p>}
                      <Button variant="link" size="sm" className="h-auto p-0">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
}
