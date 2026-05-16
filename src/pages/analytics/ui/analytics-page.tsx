import { AnalyticsSummary } from "@/entities/analytics/ui/analytics-summary";
import { MonthlyOverviewChart } from "@/entities/analytics/ui/monthly-overview-chart";
import { SpendingBreakdown } from "@/entities/analytics/ui/spending-breakdown";
import { useAnalytics } from "@/entities/analytics/model/use-analytics";

export function AnalyticsPage() {
  const { summary, categoryChartData, categoryChartConfig, monthlyChartData } = useAnalytics();

  return (
    <section className="grid gap-6">
      <AnalyticsSummary summary={summary} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <MonthlyOverviewChart data={monthlyChartData} />
        <SpendingBreakdown data={categoryChartData} config={categoryChartConfig} />
      </div>
    </section>
  );
}
