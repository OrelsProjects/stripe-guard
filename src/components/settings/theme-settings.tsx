"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Theme Settings</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Color Theme</Label>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger id="theme" className="w-full md:w-auto">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-2">
            Choose your preferred color theme or sync with your system preferences
          </p>
        </div>
      </div>
    </Card>
  );
}
