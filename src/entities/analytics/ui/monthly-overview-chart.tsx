import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/chart";
import {
  formatChartCurrency,
  monthlyChartConfig,
  type MonthlyChartDatum,
} from "@/entities/analytics/lib/analytics";

type TooltipValue = string | number | readonly (string | number)[] | undefined;

type MonthlyOverviewChartProps = {
  data: MonthlyChartDatum[];
};

export function MonthlyOverviewChart({ data }: MonthlyOverviewChartProps) {
  return (
    <Card className="border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-text)] shadow-sm">
      <CardHeader>
        <CardTitle>Динамика за 6 месяцев</CardTitle>
        <CardDescription className="text-[var(--dashboard-muted)]">
          Сравнение доходов и расходов по месяцам
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={monthlyChartConfig} className="min-h-[280px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} stroke="var(--dashboard-grid)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--dashboard-muted)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--dashboard-muted)" }}
              tickFormatter={(value: number) => `${Math.round(value / 1000)}k`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value: TooltipValue, name: TooltipValue) => (
                    <div className="flex min-w-36 items-center justify-between gap-3">
                      <span className="text-[var(--dashboard-muted)]">
                        {monthlyChartConfig[String(name) as keyof typeof monthlyChartConfig]?.label ??
                          String(name)}
                      </span>
                      <span className="font-medium text-[var(--dashboard-text)]">
                        {formatChartCurrency(value)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="income" radius={[6, 6, 0, 0]} fill="var(--color-income)" />
            <Bar dataKey="expense" radius={[6, 6, 0, 0]} fill="var(--color-expense)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
