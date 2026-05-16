import { FormEvent, useState } from "react";
import {
  readTransactions,
  writeTransactions,
  parseQuickTransaction,
  filterTransactions,
  sortTransactions,
  updateTransaction,
  buildEditFormState,
  exportTransactionsToCsv,
  isCurrentMonth,
  initialFilters,
  initialSort,
  Transaction,
  TransactionFormState,
} from "@/entities/transaction/model/transactions";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(readTransactions());
  const [quickInput, setQuickInput] = useState("");
  const [formError, setFormError] = useState("");
  const [editingTransaction, setEditingTransaction] =
      useState<TransactionFormState | null>(null);
  const [editError, setEditError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [sort, setSort] = useState(initialSort);

  function saveTransactions(newTransactions: Transaction[]) {
    setTransactions(newTransactions);
    writeTransactions(newTransactions);
  }

  function handleQuickSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      const newTransaction = parseQuickTransaction(quickInput);
      saveTransactions([newTransaction, ...transactions]);
      setQuickInput("");
      setFormError("");
    } catch {
      setFormError("Ошибка ввода");
    }
  }

  function handleDeleteTransaction(id: string) {
    const newTransactions = transactions.filter((item) => item.id !== id);
    saveTransactions(newTransactions);
  }

  function handleStartEdit(transaction: Transaction) {
    setEditingTransaction(buildEditFormState(transaction));
    setEditError("");
  }

  function handleCloseEditDialog() {
    setEditingTransaction(null);
    setEditError("");
  }

  function handleEditFieldChange(field: keyof TransactionFormState, value: any) {
    if (editingTransaction === null) return;

    setEditingTransaction({
      ...editingTransaction,
      [field]: value,
    });
  }

  function handleEditSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingTransaction === null) return;

    try {
      const newTransactions = updateTransaction(transactions, editingTransaction);
      saveTransactions(newTransactions);
      handleCloseEditDialog();
    } catch {
      setEditError("Ошибка сохранения");
    }
  }

  function handleFilterChange(field: any, value: any) {
    setFilters({
      ...filters,
      [field]: value,
    });
  }

  function handleSortChange(field: any, value: any) {
    setSort({
      ...sort,
      [field]: value,
    });
  }

  let totalIncome = 0;
  let totalExpenses = 0;

  transactions.forEach((item) => {
    if (isCurrentMonth(item.date)) {
      if (item.type === "income") {
        totalIncome = totalIncome + item.amount;
      }

      if (item.type === "expense") {
        totalExpenses = totalExpenses + item.amount;
      }
    }
  });

  const summary = {
    totalIncome: totalIncome,
    totalExpenses: totalExpenses,
    balance: totalIncome - totalExpenses,
  };

  const categories = Array.from(
      new Set(transactions.map((item) => item.category)),
  );

  const filteredTransactions = filterTransactions(transactions, filters);
  const visibleTransactions = sortTransactions(filteredTransactions, sort);

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