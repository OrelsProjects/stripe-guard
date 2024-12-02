import { Card } from "@/components/ui/card";
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
import { EventVolumeData } from "@/models/webhook";

interface WebhooksSentOverTimeChartProps {
  loading: boolean;
  eventVolumeData: EventVolumeData[];
}

function WebhooksSentOverTimeChart({
  loading,
  eventVolumeData,
}: WebhooksSentOverTimeChartProps) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Webhooks sent over time</h3>
      {loading ? (
        <div className="h-[300px]">
          <Loader />
        </div>
      ) : eventVolumeData.length === 0 ? (
        <EmptyGraph />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={eventVolumeData}>
            <defs>
              <linearGradient id="eventGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis axisLine={false} tickLine={false} dx={-10} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="webhooks"
              stroke="#3B82F6"
              strokeWidth={2}
              fill="url(#eventGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export default WebhooksSentOverTimeChart;
