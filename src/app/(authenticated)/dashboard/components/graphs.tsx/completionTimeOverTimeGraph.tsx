import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import EmptyGraph from "@/app/(authenticated)/dashboard/components/emptyGraph";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import CustomTooltip from "../customTooltip";
import { EventTimeToComplete } from "@/models/webhook";
import { useMemo } from "react";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";

const MAX_GOOD = 0.5;
const MAX_BAD = 1;

interface WebhooksSentOverTimeChartProps {
  loading: boolean;
  eventVolumeData: EventTimeToComplete[];
}

function CompletionTimeOverTimeGraph({
  loading,
  eventVolumeData,
}: WebhooksSentOverTimeChartProps) {
  const averageTimeToComplete =
    eventVolumeData.reduce((acc, val) => acc + Number(val.timeToComplete), 0) /
    eventVolumeData.length /
    1000;

  const graphColor = useMemo(() => {
    // if average time to complete is less than 0.5s, return green
    // if 0.5-1s, return yellow
    // if more than 1s, return red

    console.log("averageTimeToComplete", averageTimeToComplete);

    if (averageTimeToComplete < MAX_GOOD) {
      return "#34d399";
    } else if (
      averageTimeToComplete >= MAX_GOOD &&
      averageTimeToComplete < MAX_BAD
    ) {
      return "#f59e0b";
    } else {
      return "#ef4444";
    }
  }, [averageTimeToComplete]);

  const explanation = useMemo(() => {
    if (averageTimeToComplete < MAX_GOOD) {
      return "All good!";
    } else if (
      averageTimeToComplete >= MAX_GOOD &&
      averageTimeToComplete < MAX_BAD
    ) {
      return (
        "Something is slowing down your webhooks" + `(time > ${MAX_GOOD}s)`
      );
    } else {
      return (
        "It takes more than 1 second to complete your webhooks. This is too slow." +
        `(time > ${MAX_GOOD}s)`
      );
    }
  }, [averageTimeToComplete]);

  const explanationIcon = useMemo(() => {
    if (averageTimeToComplete < MAX_GOOD) {
      return <CheckIcon />;
    } else if (
      averageTimeToComplete >= MAX_GOOD &&
      averageTimeToComplete < MAX_BAD
    ) {
      return <ExclamationTriangleIcon />;
    } else {
      return <ExclamationTriangleIcon />;
    }
  }, [averageTimeToComplete]);

  return (
    <Card className="p-4 h-[430px] flex flex-col gap-6 relative">
      <CardTitle className="text-xl font-semibold flex justify-between">
        <span>Average time to complete</span>
        <div className="flex items-center gap-2" style={{ color: graphColor }}>
          {explanationIcon}
          <span className="text-sm">{explanation}</span>
        </div>
      </CardTitle>
      <CardContent className="h-full w-full flex items-center justify-center">
        {loading ? (
          <Loader />
        ) : eventVolumeData.length === 0 ? (
          <EmptyGraph />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={eventVolumeData}>
              <defs>
                <linearGradient
                  id="eventGradientCompletionTime"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={graphColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={graphColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="timestamp"
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} dx={-10} />
              <Tooltip
                content={
                  <CustomTooltip
                    customEntryValueLabel="Average time to complete"
                    entryFormat={entry => `${entry}ms`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="timeToComplete"
                stroke={graphColor}
                strokeWidth={2}
                fill="url(#eventGradientCompletionTime)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default CompletionTimeOverTimeGraph;
