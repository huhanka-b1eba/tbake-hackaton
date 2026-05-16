import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  buildEditFormState,
  exportTransactionsToCsv,
  filterTransactions,
  initialFilters,
  initialSort,
  isCurrentMonth,
  parseQuickTransaction,
  readTransactions,
  sortTransactions,
  Transaction,
  TransactionFilters,
  TransactionFormState,
  TransactionSort,
  updateTransaction,
  writeTransactions,
} from "@/entities/transaction/model/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [quickInput, setQuickInput] = useState("");
  const [formError, setFormError] = useState("");
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormState | null>(null);
  const [editError, setEditError] = useState("");
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const [sort, setSort] = useState<TransactionSort>(initialSort);

  useEffect(() => {
    setTransactions(readTransactions());
  }, []);

  function persistTransactions(nextTransactions: Transaction[]) {
    setTransactions(nextTransactions);
    writeTransactions(nextTransactions);
  }

  function handleQuickSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const nextTransaction = parseQuickTransaction(quickInput);
      persistTransactions([nextTransaction, ...transactions]);
      setQuickInput("");
      setFormError("");
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Не удалось разобрать строку.");
    }
  }

  function handleDeleteTransaction(transactionId: string) {
    persistTransactions(transactions.filter((transaction) => transaction.id !== transactionId));
  }

  function handleStartEdit(transaction: Transaction) {
    setEditingTransaction(buildEditFormState(transaction));
    setEditError("");
  }

  function handleCloseEditDialog() {
    setEditingTransaction(null);
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

    try {
      persistTransactions(updateTransaction(transactions, editingTransaction));
      handleCloseEditDialog();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : "Не удалось сохранить изменения.");
    }
  }

  function handleFilterChange<K extends keyof TransactionFilters>(
    field: K,
    value: TransactionFilters[K],
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function handleSortChange<K extends keyof TransactionSort>(
    field: K,
    value: TransactionSort[K],
  ) {
    setSort((currentSort) => ({
      ...currentSort,
      [field]: value,
    }));
  }

  const summary = useMemo(() => {
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

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.category))),
    [transactions],
  );

  const visibleTransactions = useMemo(
    () => sortTransactions(filterTransactions(transactions, filters), sort),
    [filters, sort, transactions],
  );

  function handleExportCsv() {
    exportTransactionsToCsv(visibleTransactions);
  }

  return {
    transactions,
    visibleTransactions,
    quickInput,
    setQuickInput,
    formError,
    editingTransaction,
    editError,
    filters,
    sort,
    categories,
    summary,
    handleQuickSubmit,
    handleDeleteTransaction,
    handleStartEdit,
    handleCloseEditDialog,
    handleEditFieldChange,
    handleEditSubmit,
    handleFilterChange,
    handleSortChange,
    handleExportCsv,
  };
}
