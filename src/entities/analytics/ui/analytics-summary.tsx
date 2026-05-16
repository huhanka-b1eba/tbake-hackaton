import { Card, CardHeader, CardDescription, CardTitle } from "@/shared/ui/card";
import { formatCurrency } from "@/entities/transaction/model/transactions";

type AnalyticsSummaryProps = {
  summary: {
    transactionCount: number;
    averageExpense: number;
    topCategory: string;
    savingsRate: number;
  };
};

export function AnalyticsSummary({ summary }: AnalyticsSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-text)] shadow-sm">
        <CardHeader>
          <CardDescription className="text-[var(--dashboard-muted)]">Транзакций за месяц</CardDescription>
          <CardTitle className="text-3xl leading-tight">{summary.transactionCount}</CardTitle>
        </CardHeader>
      </Card>

      <Card className="border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-text)] shadow-sm">
        <CardHeader>
          <CardDescription className="text-[var(--dashboard-muted)]">Средний расход по категории</CardDescription>
          <CardTitle className="break-words text-3xl leading-tight">
            {formatCurrency(summary.averageExpense)}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-text)] shadow-sm">
        <CardHeader>
          <CardDescription className="text-[var(--dashboard-muted)]">Крупнейшая категория</CardDescription>
          <CardTitle className="break-words text-3xl leading-tight capitalize">
            {summary.topCategory}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="border border-[var(--dashboard-border)] bg-[var(--dashboard-surface)] text-[var(--dashboard-text)] shadow-sm">
        <CardHeader>
          <CardDescription className="text-[var(--dashboard-muted)]">Норма сбережений</CardDescription>
          <CardTitle className="text-3xl leading-tight">{summary.savingsRate}%</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
