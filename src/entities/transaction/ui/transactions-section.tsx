import { Download, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
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
  onFilterChange: (field: string, value: string) => void;
  onSortChange: (field: string, value: string) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  onExportCsv: () => void;
};

export function TransactionsSection(props: TransactionsSectionProps) {
  const {
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
  } = props;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
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

      <CardContent>
        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <div className="grid gap-2">
            <Label>Категория</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => onFilterChange("category", value)}
            >
              <SelectTrigger>
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
            <Label>Тип</Label>
            <Select
              value={filters.type}
              onValueChange={(value) => onFilterChange("type", value)}
            >
              <SelectTrigger>
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
            <Label>Дата от</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(event) =>
                onFilterChange("dateFrom", event.target.value)
              }
            />
          </div>

          <div className="grid gap-2">
            <Label>Дата до</Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(event) =>
                onFilterChange("dateTo", event.target.value)
              }
            />
          </div>
<div className="grid gap-2">
            <Label>Сортировка</Label>
            <Select
              value={sort.field}
              onValueChange={(value) => onSortChange("field", value)}
            >
              <SelectTrigger>
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
            <Label>Порядок</Label>
            <Select
              value={sort.direction}
              onValueChange={(value) => onSortChange("direction", value)}
            >
              <SelectTrigger>
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
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-black/60">
            По текущим фильтрам транзакций нет.
          </div>
        ) : (
          <div className="grid gap-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="rounded-lg border p-4"
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <Badge variant="secondary">
                      {transaction.category}
                    </Badge>

                    <p className="mt-2 text-sm text-black/60">
                      {formatTransactionDate(transaction.date)}
                    </p>
                  </div>

                  <p
                    className={
                      transaction.type === "income"
                        ? "text-sm font-semibold text-emerald-600"
                        : "text-sm font-semibold text-red-600"
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-xs text-black/50">Комментарий</p>
                  <p className="text-sm">
                    {transaction.comment || "—"}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(transaction)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Изменить
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}