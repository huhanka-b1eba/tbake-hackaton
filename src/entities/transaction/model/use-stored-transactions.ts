import { useEffect, useState } from "react";
import {
  readTransactions,
  TRANSACTIONS_STORAGE_EVENT,
  type Transaction,
} from "@/entities/transaction/model/transactions";

export function useStoredTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const syncTransactions = () => {
      setTransactions(readTransactions());
    };

    syncTransactions();
    window.addEventListener("storage", syncTransactions);
    window.addEventListener(TRANSACTIONS_STORAGE_EVENT, syncTransactions);

    return () => {
      window.removeEventListener("storage", syncTransactions);
      window.removeEventListener(TRANSACTIONS_STORAGE_EVENT, syncTransactions);
    };
  }, []);

  return transactions;
}
