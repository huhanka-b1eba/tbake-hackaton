import { formatCurrency, type Transaction } from "@/entities/transaction/model/transactions";
import type { ChartConfig } from "@/shared/ui/chart";

const MONTH_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
  month: "short",
});

const CATEGORY_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export type CategoryChartDatum = {
  category: string;
  amount: number;
  fill: string;
};

export type MonthlyChartDatum = {
  month: string;
  income: number;
  expense: number;
};

export function getCurrentMonthTransactions(transactions: Transaction[]) {
  const now = new Date();

  return transactions.filter((transaction) => {
    const date = new Date(transaction.date);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
}

export function getCategoryChartData(transactions: Transaction[]): CategoryChartDatum[] {
  const expenseTransactions = transactions.filter((transaction) => transaction.type === "expense");
  const totalsByCategory = new Map<string, number>();

  for (const transaction of expenseTransactions) {
    totalsByCategory.set(
      transaction.category,
      (totalsByCategory.get(transaction.category) ?? 0) + transaction.amount,
    );
  }

  return Array.from(totalsByCategory.entries())
    .map(([category, amount], index) => ({
      category,
      amount,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    }))
    .sort((left, right) => right.amount - left.amount);
}

export function getCategoryChartConfig(data: CategoryChartDatum[]): ChartConfig {
  return data.reduce<ChartConfig>(
    (config, item) => ({
      ...config,
      [item.category]: {
        label: item.category,
        color: item.fill,
      },
    }),
    {
      amount: {
        label: "Сумма",
      },
    },
  );
}

export function getMonthlyChartData(transactions: Transaction[]): MonthlyChartDatum[] {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    return {
      key,
      month: MONTH_FORMATTER.format(date),
      income: 0,
      expense: 0,
    };
  });

  const monthMap = new Map(months.map((item) => [item.key, item]));

  for (const transaction of transactions) {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = monthMap.get(key);

    if (!bucket) {
      continue;
    }

    if (transaction.type === "income") {
      bucket.income += transaction.amount;
    } else {
      bucket.expense += transaction.amount;
    }
  }

  return months.map(({ month, income, expense }) => ({
    month,
    income,
    expense,
  }));
}

export function getAnalyticsSummary(currentMonthTransactions: Transaction[]) {
  const totalIncome = currentMonthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpense = currentMonthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const categoryChartData = getCategoryChartData(currentMonthTransactions);
  const topCategory = categoryChartData[0];
  const averageExpense =
    categoryChartData.length > 0 ? totalExpense / categoryChartData.length : 0;
  const savingsRate =
    totalIncome > 0
      ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))
      : 0;

  return {
    totalIncome,
    totalExpense,
    transactionCount: currentMonthTransactions.length,
    averageExpense,
    topCategory: topCategory?.category ?? "нет данных",
    savingsRate,
  };
}

export const monthlyChartConfig = {
  income: {
    label: "Доход",
    color: "var(--chart-2)",
  },
  expense: {
    label: "Расход",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function formatChartCurrency(value: number | string | readonly (string | number)[] | undefined) {
  return formatCurrency(Number(value ?? 0));
}
