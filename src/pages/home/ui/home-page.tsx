import { FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  comment?: string;
};

type TransactionFormState = {
  id: string;
  category: string;
  amount: string;
  type: TransactionType;
  date: string;
  comment: string;
};

const STORAGE_KEY = "transactions";

const demoTransactions: Transaction[] = [
  {
    id: "1",
    category: "зарплата",
    amount: 125000,
    type: "income",
    date: new Date().toISOString(),
    comment: "основная работа",
  },
  {
    id: "2",
    category: "фриланс",
    amount: 28000,
    type: "income",
    date: new Date().toISOString(),
    comment: "проект",
  },
  {
    id: "3",
    category: "аренда",
    amount: 35000,
    type: "expense",
    date: new Date().toISOString(),
    comment: "квартира",
  },
  {
    id: "4",
    category: "продукты",
    amount: 12400,
    type: "expense",
    date: new Date().toISOString(),
    comment: "супермаркет",
  },
  {
    id: "5",
    category: "подписки",
    amount: 2900,
    type: "expense",
    date: new Date().toISOString(),
    comment: "сервисы",
  },
];

function normalizeTransaction(value: unknown): Transaction | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const rawTransaction = value as {
    id?: unknown;
    category?: unknown;
    title?: unknown;
    amount?: unknown;
    type?: unknown;
    date?: unknown;
    comment?: unknown;
  };

  const categorySource = rawTransaction.category ?? rawTransaction.title;

  if (
    typeof rawTransaction.id !== "string" ||
    typeof categorySource !== "string" ||
    typeof rawTransaction.amount !== "number" ||
    (rawTransaction.type !== "income" && rawTransaction.type !== "expense") ||
    typeof rawTransaction.date !== "string"
  ) {
    return null;
  }

  return {
    id: rawTransaction.id,
    category: categorySource,
    amount: rawTransaction.amount,
    type: rawTransaction.type,
    date: rawTransaction.date,
    comment: typeof rawTransaction.comment === "string" ? rawTransaction.comment : undefined,
  };
}

function readTransactions(): Transaction[] {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTransactions));
    return demoTransactions;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as unknown;

    if (!Array.isArray(parsedValue)) {
      return demoTransactions;
    }

    const normalizedTransactions = parsedValue
      .map(normalizeTransaction)
      .filter((transaction): transaction is Transaction => transaction !== null);

    if (normalizedTransactions.length === 0) {
      return demoTransactions;
    }

    return normalizedTransactions;
  } catch {
    return demoTransactions;
  }
}

function writeTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function isCurrentMonth(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTransactionDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU");
}

function toDateInputValue(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function buildEditFormState(transaction: Transaction): TransactionFormState {
  return {
    id: transaction.id,
    category: transaction.category,
    amount: String(transaction.amount),
    type: transaction.type,
    date: toDateInputValue(transaction.date),
    comment: transaction.comment ?? "",
  };
}

function parseQuickTransaction(rawValue: string): Transaction {
  const parts = rawValue.trim().split(/\s+/);

  if (parts.length < 3) {
    throw new Error("Введите строку в формате: р авто 100 или р авто 100 комментарий");
  }

  const [rawType, rawCategory, ...rest] = parts;

  if (!rawCategory || rest.length === 0) {
    throw new Error("Нужны категория и сумма.");
  }

  const amountIndex = rest.findIndex((token) => {
    const normalizedToken = token.replace(",", ".");
    const parsedAmount = Number(normalizedToken);

    return Number.isFinite(parsedAmount) && parsedAmount > 0;
  });

  if (amountIndex === -1) {
    throw new Error("После категории укажите сумму.");
  }

  const amountToken = rest[amountIndex];
  const comment = rest.slice(amountIndex + 1).join(" ").trim();
  const category = rawCategory.toLowerCase();

  const normalizedType = rawType.toLowerCase();
  const type =
    normalizedType === "р"
      ? "expense"
      : normalizedType === "д"
        ? "income"
        : null;

  if (!type) {
    throw new Error("Используйте `р` для расхода или `д` для дохода.");
  }

  const amount = Number(amountToken.replace(",", "."));

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Сумма должна быть числом больше нуля.");
  }

  return {
    id: crypto.randomUUID(),
    category,
    amount,
    type,
    date: new Date().toISOString(),
    comment: comment || undefined,
  };
}

export function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quickInput, setQuickInput] = useState("");
  const [formError, setFormError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormState | null>(null);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    setTransactions(readTransactions());
  }, []);

  function handleQuickSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const nextTransaction = parseQuickTransaction(quickInput);
      const nextTransactions = [nextTransaction, ...transactions];

      setTransactions(nextTransactions);
      writeTransactions(nextTransactions);
      setQuickInput("");
      setFormError("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось разобрать строку.");
    }
  }

  function handleDeleteTransaction(transactionId: string) {
    const nextTransactions = transactions.filter((transaction) => transaction.id !== transactionId);

    setTransactions(nextTransactions);
    writeTransactions(nextTransactions);
  }

  function handleStartEdit(transaction: Transaction) {
    setEditingTransaction(buildEditFormState(transaction));
    setEditError("");
  }

  function handleEditFieldChange<K extends keyof TransactionFormState>(
    field: K,
    value: TransactionFormState[K],
  ) {
    setEditingTransaction((currentState) =>
      currentState
        ? {
            ...currentState,
            [field]: value,
          }
        : currentState,
    );
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingTransaction) {
      return;
    }

    const category = editingTransaction.category.trim().toLowerCase();
    const comment = editingTransaction.comment.trim();
    const amount = Number(editingTransaction.amount.replace(",", "."));

    if (!category) {
      setEditError("Укажите категорию.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setEditError("Сумма должна быть числом больше нуля.");
      return;
    }

    if (!editingTransaction.date) {
      setEditError("Укажите дату.");
      return;
    }

    const nextTransactions = transactions.map((transaction) =>
      transaction.id === editingTransaction.id
        ? {
            ...transaction,
            category,
            amount,
            type: editingTransaction.type,
            date: new Date(`${editingTransaction.date}T12:00:00`).toISOString(),
            comment: comment || undefined,
          }
        : transaction,
    );

    setTransactions(nextTransactions);
    writeTransactions(nextTransactions);
    setEditingTransaction(null);
    setEditError("");
  }

  const { balance, totalIncome, totalExpenses } = useMemo(() => {
    const currentMonthTransactions = transactions.filter((transaction) =>
      isCurrentMonth(transaction.date),
    );

    const totalIncome = currentMonthTransactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpenses = currentMonthTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      balance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
    };
  }, [transactions]);

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((transaction) => transaction.category)));
  }, [transactions]);

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Баланс пользователя</CardDescription>
            <CardTitle className="text-4xl leading-tight md:text-5xl">
              {formatCurrency(balance)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Доходы за месяц</CardDescription>
            <CardTitle className="text-4xl leading-tight md:text-5xl">
              {formatCurrency(totalIncome)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Расходы за месяц</CardDescription>
            <CardTitle className="text-4xl leading-tight md:text-5xl">
              {formatCurrency(totalExpenses)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Быстрый ввод</CardTitle>
          <CardDescription>
            Введите транзакцию в виде: р/д категория сумма комментарий
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleQuickSubmit}>
            <Input
              value={quickInput}
              onChange={(event) => setQuickInput(event.target.value)}
              placeholder="р авто 100 комментарий"
              aria-label="Быстрый ввод транзакции"
            />
            <Button type="submit">Добавить</Button>
          </form>
          {formError ? (
            <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>
          ) : (
            <p className="mt-3 text-sm text-black/60">
              `р` означает расход, `д` означает доход. После категории пишется сумма,
              а все слова после суммы сохраняются как комментарий.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Список транзакций</CardTitle>
          <CardDescription>{transactions.length} записей</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-black/15 px-4 py-8 text-center text-sm text-black/60">
              Транзакций пока нет.
            </div>
          ) : (
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-black/50">
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
                    <td className="rounded-l-lg border-y border-l border-black/10 px-4 py-3 text-sm text-black/70">
                      {formatTransactionDate(transaction.date)}
                    </td>
                    <td className="border-y border-black/10 px-4 py-3">
                      <Badge variant="secondary">{transaction.category}</Badge>
                    </td>
                    <td
                      className={`border-y border-black/10 px-4 py-3 text-sm font-semibold ${
                        transaction.type === "income" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="border-y border-black/10 px-4 py-3 text-sm text-black/70">
                      {transaction.comment || "—"}
                    </td>
                    <td className="rounded-r-lg border-y border-r border-black/10 px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleStartEdit(transaction)}
                          aria-label="Редактировать транзакцию"
                          title="Редактировать"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTransaction(transaction.id)}
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

      <Dialog
        open={editingTransaction !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingTransaction(null);
            setEditError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактирование транзакции</DialogTitle>
            <DialogDescription>
              Обновите дату, категорию, тип, сумму и комментарий.
            </DialogDescription>
          </DialogHeader>

          {editingTransaction ? (
            <form className="grid gap-4" onSubmit={handleEditSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="transaction-date">Дата</Label>
                <Input
                  id="transaction-date"
                  type="date"
                  value={editingTransaction.date}
                  onChange={(event) => handleEditFieldChange("date", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transaction-category">Категория</Label>
                <Input
                  id="transaction-category"
                  value={editingTransaction.category}
                  onChange={(event) => handleEditFieldChange("category", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transaction-type">Тип</Label>
                <Select
                  value={editingTransaction.type}
                  onValueChange={(value) =>
                    handleEditFieldChange("type", value as TransactionType)
                  }
                >
                  <SelectTrigger id="transaction-type">
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Доход</SelectItem>
                    <SelectItem value="expense">Расход</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transaction-amount">Сумма</Label>
                <Input
                  id="transaction-amount"
                  inputMode="decimal"
                  value={editingTransaction.amount}
                  onChange={(event) => handleEditFieldChange("amount", event.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transaction-comment">Комментарий</Label>
                <Textarea
                  id="transaction-comment"
                  value={editingTransaction.comment}
                  onChange={(event) => handleEditFieldChange("comment", event.target.value)}
                  placeholder="Необязательный комментарий"
                />
              </div>

              {editError ? <p className="text-sm font-medium text-red-600">{editError}</p> : null}

              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingTransaction(null);
                    setEditError("");
                  }}
                >
                  Отмена
                </Button>
                <Button type="submit">Сохранить</Button>
              </DialogFooter>
            </form>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
