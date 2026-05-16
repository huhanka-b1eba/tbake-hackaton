import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
};

const STORAGE_KEY = "transactions";

const demoTransactions: Transaction[] = [
  {
    id: "1",
    title: "Зарплата",
    amount: 125000,
    type: "income",
    date: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Фриланс",
    amount: 28000,
    type: "income",
    date: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Аренда",
    amount: 35000,
    type: "expense",
    date: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Продукты",
    amount: 12400,
    type: "expense",
    date: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Подписки",
    amount: 2900,
    type: "expense",
    date: new Date().toISOString(),
  },
];

function readTransactions(): Transaction[] {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  if (!storedValue) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoTransactions));
    return demoTransactions;
  }

  try {
    const parsedValue = JSON.parse(storedValue) as Transaction[];

    if (!Array.isArray(parsedValue)) {
      return demoTransactions;
    }

    return parsedValue;
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

function parseQuickTransaction(rawValue: string): Transaction {
  const parts = rawValue.trim().split(/\s+/);

  if (parts.length < 3) {
    throw new Error("Введите строку в формате: р авто 100");
  }

  const [rawType, ...rest] = parts;
  const amountToken = rest.at(-1);
  const title = rest.slice(0, -1).join(" ");

  if (!amountToken || !title) {
    throw new Error("Нужны категория и сумма.");
  }

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
    title,
    amount,
    type,
    date: new Date().toISOString(),
  };
}

export function HomePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quickInput, setQuickInput] = useState("");
  const [formError, setFormError] = useState("");

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
            Одна строка на транзакцию: `р авто 100` или `д зарплата 50000`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleQuickSubmit}>
            <Input
              value={quickInput}
              onChange={(event) => setQuickInput(event.target.value)}
              placeholder="р авто 100"
              aria-label="Быстрый ввод транзакции"
            />
            <Button type="submit">Добавить</Button>
          </form>
          {formError ? (
            <p className="mt-3 text-sm font-medium text-red-600">{formError}</p>
          ) : (
            <p className="mt-3 text-sm text-black/60">
              `р` означает расход, `д` означает доход. Последнее значение считается суммой.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Транзакции текущего месяца</CardTitle>
          <CardDescription>{transactions.length} записей в локальном хранилище</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border border-black/10 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{transaction.title}</p>
                <p className="text-xs text-black/60">
                  {new Date(transaction.date).toLocaleDateString("ru-RU")}
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
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
