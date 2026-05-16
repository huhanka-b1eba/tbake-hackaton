import { useMemo } from "react";
import { storeTransactions } from "@/entities/transaction/model/storeTransactions";
import {
  getAnalyticsSummary,
  getCategoryChartConfig,
  getCategoryChartData,
  getCurrentMonthTransactions,
  getMonthlyChartData,
} from "@/entities/analytics/lib/analytics";

export function useAnalytics() {
  const transactions = storeTransactions();

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
