import { Download, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  formatCurrency,
  formatTransactionDate,
  Transaction,
  TransactionFilters,
  TransactionSort,
} from "@/entities/transaction/model/transactions";

type TransactionsSectionProps = {
  transactions: Transaction[];
  totalCount: number;
  categories: string[];
  filters: TransactionFilters;
  sort: TransactionSort;
  onFilterChange: <K extends keyof TransactionFilters>(
    field: K,
    value: TransactionFilters[K],
  ) => void;
  onSortChange: <K extends keyof TransactionSort>(
    field: K,
    value: TransactionSort[K],
  ) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  onExportCsv: () => void;
};

export function TransactionsSection({
  transactions,
  totalCount,
  categories,
  filters,
  sort,
  onFilterChange,
  onSortChange,
  onEdit,
  onDelete,
  onExportCsv,
}: TransactionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Список транзакций</CardTitle>
            <CardDescription>
              {transactions.length} из {totalCount} записей
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onExportCsv}
            disabled={transactions.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="mb-4 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <div className="grid gap-2">
            <Label htmlFor="filter-category">Категория</Label>
            <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
              <SelectTrigger id="filter-category">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filter-type">Тип</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFilterChange("type", value as TransactionFilters["type"])}
            >
              <SelectTrigger id="filter-type">
                <SelectValue placeholder="Все типы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                <SelectItem value="income">Доходы</SelectItem>
                <SelectItem value="expense">Расходы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filter-date-from">Дата от</Label>
            <Input
              id="filter-date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(event) => onFilterChange("dateFrom", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="filter-date-to">Дата до</Label>
            <Input
              id="filter-date-to"
              type="date"
              value={filters.dateTo}
              onChange={(event) => onFilterChange("dateTo", event.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sort-field">Сортировка</Label>
            <Select
              value={sort.field}
              onValueChange={(value) => onSortChange("field", value as TransactionSort["field"])}
            >
              <SelectTrigger id="sort-field">
                <SelectValue placeholder="Поле сортировки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="amount">По сумме</SelectItem>
                <SelectItem value="category">По категории</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sort-direction">Порядок</Label>
            <Select
              value={sort.direction}
              onValueChange={(value) =>
                onSortChange("direction", value as TransactionSort["direction"])
              }
            >
              <SelectTrigger id="sort-direction">
                <SelectValue placeholder="Порядок сортировки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">По убыванию</SelectItem>
                <SelectItem value="asc">По возрастанию</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/60 dark:border-zinc-700 dark:text-zinc-400">
            По текущим фильтрам транзакций нет.
          </div>
        ) : (
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-black/50 dark:text-zinc-500">
                <th className="px-4">Дата</th>
                <th className="px-4">Категория</th>
                <th className="px-4">Сумма</th>
                <th className="px-4">Комментарий</th>
                <th className="px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="rounded-l-lg border-y border-l border-black/10 px-4 py-3 text-sm text-black/70 dark:border-zinc-800 dark:text-zinc-300">
                    {formatTransactionDate(transaction.date)}
                  </td>
                  <td className="border-y border-black/10 px-4 py-3 dark:border-zinc-800">
                    <Badge variant="secondary">{transaction.category}</Badge>
                  </td>
                  <td
                    className={`border-y border-black/10 px-4 py-3 text-sm font-semibold dark:border-zinc-800 ${
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="border-y border-black/10 px-4 py-3 text-sm text-black/70 dark:border-zinc-800 dark:text-zinc-300">
                    {transaction.comment || "—"}
                  </td>
                  <td className="rounded-r-lg border-y border-r border-black/10 px-4 py-3 dark:border-zinc-800">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(transaction)}
                        aria-label="Редактировать транзакцию"
                        title="Редактировать"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(transaction.id)}
                        aria-label="Удалить транзакцию"
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
