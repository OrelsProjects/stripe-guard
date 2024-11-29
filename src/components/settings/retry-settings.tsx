"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function RetrySettings() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Retry Configuration</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Automatic Retries</Label>
            <p className="text-sm text-muted-foreground">
              Automatically retry failed webhooks
            </p>
          </div>
          <Switch />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="max-retries">Maximum Retry Attempts</Label>
          <Select>
            <SelectTrigger id="max-retries">
              <SelectValue placeholder="Select max retries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 attempts</SelectItem>
              <SelectItem value="5">5 attempts</SelectItem>
              <SelectItem value="10">10 attempts</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}