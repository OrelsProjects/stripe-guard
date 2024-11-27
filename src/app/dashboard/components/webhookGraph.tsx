import { motion } from "framer-motion";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";

type DateRange = "daily" | "weekly" | "monthly" | "custom";

interface WebhookGraphProps {
  data: {
    timestamp: string;
    succeeded: number;
    failed: number;
  }[];
  totalSuccess: number;
}

export function WebhookGraph({ data, totalSuccess }: WebhookGraphProps) {
  const [dateRangeType, setDateRangeType] = useState<DateRange>("daily");
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date }>({
    from: new Date(),
  });
  const [calendarOpen, setCalendarOpen] = useState(false); // State to control Calendar visibility

  const isAllSuccessful = totalSuccess === 100;

  const tabsTriggerClassname = useMemo(
    () => "text-lg py-0 4k:font-medium 4k:text-4xl 4k:px-8 4k:py-2",
    [],
  );

  return (
    <div className="w-full 4k:max-w-screen-2xl flex flex-col items-start gap-4">
      <h2 className="text-2xl font-medium">
        {" "}
        Today&apos;s Webhook Performance
      </h2>
      {/* <Tabs
          value={dateRangeType}
          onValueChange={value => {
            setDateRangeType(value as DateRange);
          }}
        >
          <TabsList className="4k:h-fit 4k:p-3">
            <TabsTrigger value="daily" className={tabsTriggerClassname}>
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className={tabsTriggerClassname}>
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className={tabsTriggerClassname}>
              Monthly
            </TabsTrigger>
            <TabsTrigger
              className={tabsTriggerClassname}
              value="custom"
              onClick={() => {
                // Toggle calendar open/close if "custom" is already selected
                if (dateRangeType === "custom") {
                  setCalendarOpen(!calendarOpen);
                } else {
                  setCalendarOpen(true);
                }
                setDateRangeType("custom");
              }}
            >
              Custom
            </TabsTrigger>
          </TabsList>
          <TabsContent value="custom">
            {calendarOpen && ( // Conditionally render calendar based on calendarOpen state
              <div className="flex space-x-4 absolute z-50">
                <Calendar
                  mode="range"
                  captionLayout="dropdown-buttons"
                  fromYear={2020}
                  toYear={2030}
                  onClose={() => setCalendarOpen(false)} // Close action handled here
                  selected={dateRange}
                  onSelect={range => {
                    if (range?.from && range?.to) {
                      setDateRange({
                        from: range.from,
                        to: range.to,
                      });
                    }
                  }}
                  className="rounded-md border bg-background"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
        <p className="text-lg 4k:text-4xl font-bold">
          {moment(dateRange.from).format("YYYY/MM/DD")} -{" "}
          {moment(dateRange.to).format("YYYY/MM/DD")}
        </p> */}
      {/* </div> */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">
            Webhook Performance
          </CardTitle>
          {isAllSuccessful && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Badge
                variant="default"
                className="bg-green-500/10 text-green-500 flex items-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                All Webhooks Successful
              </Badge>
            </motion.div>
          )}
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis
                dataKey="timestamp"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Line
                type="monotone"
                dataKey="succeeded"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="failed"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
