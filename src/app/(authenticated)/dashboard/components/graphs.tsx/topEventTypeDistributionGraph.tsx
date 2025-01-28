import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import EmptyGraph from "@/app/(authenticated)/dashboard/components/emptyGraph";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { FailureReason } from "@/models/webhook";
import CustomTooltip from "@/app/(authenticated)/dashboard/components/customTooltip";

interface TopEventTypeDistributionGraphProps {
  loading: boolean;
  failureReasonsData: FailureReason[];
}

function TopEventTypeDistributionGraph({
  loading,
  failureReasonsData,
}: TopEventTypeDistributionGraphProps) {
  return (
    <Card className="h-[430px] flex flex-col justify-between p-6">
      <CardTitle className="text-xl font-semibold mb-6">
        Top failed event types
      </CardTitle>
      <CardContent className="h-full w-full flex items-center justify-center">
        {loading ? (
          <Loader />
        ) : failureReasonsData.length === 0 ? (
          <EmptyGraph />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={failureReasonsData} barSize={40}>
              <XAxis
                dataKey="eventName"
                tickFormatter={value => {
                  const length = value.split(".").length;
                  if (length === 1) {
                    return value.slice(0, 2);
                  }
                  if (length === 2) {
                    if (value.includes("_")) {
                      debugger;
                      const first = value.split("_")[0];
                      const second = value.split("_")[1]?.split(".")?.[0] || "";
                      const third = value.split(".")[1];
                      return (
                        first.slice(0, 2) +
                        "_" +
                        second.slice(0, 2) +
                        "." +
                        third
                      );
                    } else {
                      return value.slice(0, 2) + "." + value.split(".")[1];
                    }
                  } else {
                    const first = value.split(".")[0];
                    const second = value.split(".")[1];
                    return first + "." + second;
                  }
                }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} dx={-10} />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--destructive))"
                radius={[4, 4, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default TopEventTypeDistributionGraph;
