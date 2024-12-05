"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins } from "lucide-react";
import { Plan } from "@/models/user";
import { PremiumDialog } from "@/components/premium-dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface BillingSettingsProps {
  plan?: Plan;
}

export function BillingSettings({ plan }: BillingSettingsProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="flex items-center justify-start gap-2 mb-4">
            <Coins className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Tokens</h2>
          </div>
          <div className="space-y-6 w-full">
            {plan ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xl">
                      <h3 className="font-medium">Available Tokens</h3>
                      <Badge
                        variant="secondary"
                        className="text-base sm:text-lg"
                      >
                        {plan.tokensLeft.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-xl">
                    <h3 className="font-medium">No Tokens Available</h3>
                    <Badge variant="secondary">0 tokens</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Purchase tokens to start using our services
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <PremiumDialog text="Add More Tokens" />
      </div>
      {plan && plan.billingHistory && plan.billingHistory.length > 0 && (
        <Accordion type="single" collapsible className="border-t border-muted-foreground/20 mt-6">
          <AccordionItem value="history">
            <AccordionTrigger>Token Purchase History</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {plan.billingHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        +{history.tokensPurchased.toLocaleString()} tokens
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(history.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${history.amount.toFixed(2)}
                      </p>
                      {/* <Button variant="link" size="sm" className="h-auto p-0">
                              View Receipt
                            </Button> */}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
