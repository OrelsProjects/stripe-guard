import { ErrorDistributionChart } from "@/components/ui/graphs/errorDistributionGraph";
import { ErrorRateCard } from "@/components/ui/graphs/errorRateCard";
import { ErrorTrendGraph } from "@/components/ui/graphs/errorTrendGraph";

export function GraphGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ErrorTrendGraph />
      </div>
      <div>
        <ErrorRateCard />
      </div>
      <div className="md:col-span-2 lg:col-span-3">
        <ErrorDistributionChart />
      </div>
    </div>
  );
}
