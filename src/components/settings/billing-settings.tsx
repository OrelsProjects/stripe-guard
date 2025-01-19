"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins } from 'lucide-react';
import { Plan } from "@/models/user";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export interface BillingSettingsProps {
  plan?: Plan;
  loading?: boolean;
}

export function BillingSettings({ plan, loading = false }: BillingSettingsProps) {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="w-full flex flex-col justify-start items-start">
          <div className="flex items-center justify-start gap-2 mb-4">
            <Coins className="h-5 w-5 text-primary" />
            <h2 className="text-lg md:text-xl font-semibold">Tokens</h2>
          </div>
          <div className="space-y-6 w-full">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ) : plan ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-base md:text-xl">
                      <h3 className="font-medium">Available Tokens</h3>
                      <Badge
                        variant="secondary"
                        className="text-sm md:text-base"
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
                  <div className="flex items-center space-x-2 text-base md:text-xl">
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
        {/* {!loading && <PremiumDialog text="+ Tokens" />} */}
      </div>
      {!loading && plan && plan.billingHistory && plan.billingHistory.length > 0 && (
        <Accordion type="single" collapsible className="border-t border-muted-foreground/20 mt-6">
          <AccordionItem value="history">
            <AccordionTrigger>Token Purchase History</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {plan.billingHistory.map((history, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row items-start md:items-center justify-between text-sm p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">
                        +{history.tokensPurchased.toLocaleString()} tokens
                      </p>
                      <p className="text-muted-foreground">
                        {new Date(history.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left md:text-right mt-2 md:mt-0">
                      <p className="font-medium">
                        ${history.amount.toFixed(2)}
                      </p>
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

