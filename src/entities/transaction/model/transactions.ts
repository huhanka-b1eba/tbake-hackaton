export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  category: string;
  amount: number;
  type: TransactionType;
  date: string;
  comment?: string;
};

export type TransactionFormState = {
  id: string;
  category: string;
  amount: string;
  type: TransactionType;
  date: string;
  comment: string;
};

export type TransactionFilters = {
  category: string;
  type: "all" | TransactionType;
  dateFrom: string;
  dateTo: string;
};

export type TransactionSort = {
  field: "date" | "amount" | "category";
  direction: "asc" | "desc";
};

const STORAGE_KEY = "transactions";

export const initialFilters: TransactionFilters = {
  category: "all",
  type: "all",
  dateFrom: "",
  dateTo: "",
};

export const initialSort: TransactionSort = {
  field: "date",
  direction: "desc",
};

export function normalizeTransaction(value: unknown): Transaction | null {
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

export function readTransactions(): Transaction[] {
  const storedValue = window.localStorage.getItem(STORAGE_KEY);

  try {
    const parsedValue = JSON.parse(storedValue ?? "null") as unknown;

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue
      .map(normalizeTransaction)
      .filter((transaction): transaction is Transaction => transaction !== null);
  } catch {
    return [];
  }
}

export function writeTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function isCurrentMonth(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatTransactionDate(value: string) {
  return new Date(value).toLocaleDateString("ru-RU");
}

export function toDateInputValue(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function buildEditFormState(transaction: Transaction): TransactionFormState {
  return {
    id: transaction.id,
    category: transaction.category,
    amount: String(transaction.amount),
    type: transaction.type,
    date: toDateInputValue(transaction.date),
    comment: transaction.comment ?? "",
  };
}

export function parseQuickTransaction(rawValue: string): Transaction {
  const parts = rawValue.trim().split(/\s+/);

  if (parts.length < 3) {
    throw new Error("Введите строку в формате: р авто 100 или р авто 100 комментарий");
  }

  const [rawType, rawCategory, ...rest] = parts;

  if (!rawCategory || rest.length === 0) {
    throw new Error("Нужны категория и сумма.");
  }

  const amountIndex = rest.findIndex((token) => {
    const parsedAmount = Number(token.replace(",", "."));
    return Number.isFinite(parsedAmount) && parsedAmount > 0;
  });

  if (amountIndex === -1) {
    throw new Error("После категории укажите сумму.");
  }

  const normalizedType = rawType.toLowerCase();
  const type =
    normalizedType === "р" ? "expense" : normalizedType === "д" ? "income" : null;

  if (!type) {
    throw new Error("Используйте `р` для расхода или `д` для дохода.");
  }

  const amount = Number(rest[amountIndex].replace(",", "."));

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Сумма должна быть числом больше нуля.");
  }

  return {
    id: crypto.randomUUID(),
    category: rawCategory.toLowerCase(),
    amount,
    type,
    date: new Date().toISOString(),
    comment: rest.slice(amountIndex + 1).join(" ").trim() || undefined,
  };
}

export function updateTransaction(
  transactions: Transaction[],
  formState: TransactionFormState,
): Transaction[] {
  const category = formState.category.trim().toLowerCase();
  const comment = formState.comment.trim();
  const amount = Number(formState.amount.replace(",", "."));

  if (!category) {
    throw new Error("Укажите категорию.");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Сумма должна быть числом больше нуля.");
  }

  if (!formState.date) {
    throw new Error("Укажите дату.");
  }

  return transactions.map((transaction) =>
    transaction.id === formState.id
      ? {
          ...transaction,
          category,
          amount,
          type: formState.type,
          date: new Date(`${formState.date}T12:00:00`).toISOString(),
          comment: comment || undefined,
        }
      : transaction,
  );
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
) {
  return transactions.filter((transaction) => {
    if (filters.category !== "all" && transaction.category !== filters.category) {
      return false;
    }

    if (filters.type !== "all" && transaction.type !== filters.type) {
      return false;
    }

    const transactionDate = toDateInputValue(transaction.date);

    if (filters.dateFrom && transactionDate < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && transactionDate > filters.dateTo) {
      return false;
    }

    return true;
  });
}

export function sortTransactions(
  transactions: Transaction[],
  sort: TransactionSort,
) {
  return [...transactions].sort((left, right) => {
    let comparison = 0;

    if (sort.field === "date") {
      comparison = new Date(left.date).getTime() - new Date(right.date).getTime();
    }

    if (sort.field === "amount") {
      comparison = left.amount - right.amount;
    }

    if (sort.field === "category") {
      comparison = left.category.localeCompare(right.category, "ru");
    }

    return sort.direction === "asc" ? comparison : -comparison;
  });
}

function escapeCsvValue(value: string | number) {
  const normalizedValue = String(value).replace(/"/g, '""');
  return `"${normalizedValue}"`;
}

export function exportTransactionsToCsv(transactions: Transaction[]) {
  const header = ["Дата", "Категория", "Тип", "Сумма", "Комментарий"];

  const rows = transactions.map((transaction) => [
    formatTransactionDate(transaction.date),
    transaction.category,
    transaction.type === "income" ? "Доход" : "Расход",
    transaction.amount,
    transaction.comment ?? "",
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const currentDate = toDateInputValue(new Date().toISOString());

  link.href = url;
  link.download = `transactions-${currentDate}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
