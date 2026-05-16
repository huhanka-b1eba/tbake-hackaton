import { Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui/chart";
import {
  formatChartCurrency,
  type CategoryChartDatum,
} from "@/entities/analytics/lib/analytics";

type TooltipValue = string | number | readonly (string | number)[] | undefined;

type SpendingBreakdownProps = {
  data: CategoryChartDatum[];
  config: Record<string, { label?: React.ReactNode; color?: string }>;
};

export function SpendingBreakdown({ data, config }: SpendingBreakdownProps) {
  return (
    <Card className="border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-text)] shadow-sm">
      <CardHeader>
        <CardTitle>Структура расходов</CardTitle>
        <CardDescription className="text-[var(--dashboard-muted)]">
          Категории расходов за текущий месяц
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <ChartContainer config={config} className="mx-auto min-h-[280px] w-full max-w-[320px]">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value: TooltipValue, name: TooltipValue) => (
                    <div className="flex min-w-36 items-center justify-between gap-3">
                      <span className="text-[var(--dashboard-muted)] capitalize">{String(name)}</span>
                      <span className="font-medium text-[var(--dashboard-text)]">
                        {formatChartCurrency(value)}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={72}
              outerRadius={106}
              paddingAngle={3}
            />
          </PieChart>
        </ChartContainer>

        <div className="grid gap-3">
          {data.length > 0 ? (
            data.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between rounded-lg border border-[var(--dashboard-border)] bg-[var(--dashboard-panel)] px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                    aria-hidden="true"
                  />
                  <span className="capitalize">{item.category}</span>
                </div>
                <span className="font-medium">{formatChartCurrency(item.amount)}</span>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-[var(--dashboard-border)] px-4 py-6 text-sm text-[var(--dashboard-muted)]">
              Пока нет расходов за текущий месяц.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
