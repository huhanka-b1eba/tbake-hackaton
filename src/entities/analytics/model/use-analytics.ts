import { useMemo } from "react";
import { useStoredTransactions } from "@/entities/transaction/model/use-stored-transactions";
import {
  getAnalyticsSummary,
  getCategoryChartConfig,
  getCategoryChartData,
  getCurrentMonthTransactions,
  getMonthlyChartData,
} from "@/entities/analytics/lib/analytics";

export function useAnalytics() {
  const transactions = useStoredTransactions();

  return useMemo(() => {
    const currentMonthTransactions = getCurrentMonthTransactions(transactions);
    const categoryChartData = getCategoryChartData(currentMonthTransactions);

    return {
      transactions,
      currentMonthTransactions,
      summary: getAnalyticsSummary(currentMonthTransactions),
      categoryChartData,
      categoryChartConfig: getCategoryChartConfig(categoryChartData),
      monthlyChartData: getMonthlyChartData(transactions),
    };
  }, [transactions]);
}
