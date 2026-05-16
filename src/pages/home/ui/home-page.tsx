import { Card, CardHeader, CardDescription, CardTitle } from "@/shared/ui/card";
import { formatCurrency } from "@/entities/transaction/model/transactions";
import { useTransactions } from "@/entities/transaction/model/use-transactions";
import { EditTransactionDialog } from "@/entities/transaction/ui/edit-transaction-dialog";
import { TransactionsSection } from "@/entities/transaction/ui/transactions-section";
import { QuickTransactionForm } from "@/pages/home/ui/quick-transaction-form";

export function HomePage() {
  const {
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
  } = useTransactions();

  return (
    <section className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Баланс пользователя</CardDescription>
            <CardTitle className="text-4xl leading-tight md:text-5xl">
              {formatCurrency(summary.balance)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Доходы за месяц</CardDescription>
            <CardTitle className="text-4xl leading-tight md:text-5xl">
              {formatCurrency(summary.totalIncome)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Расходы за месяц</CardDescription>
            <CardTitle className="text-4xl leading-tight md:text-5xl">
              {formatCurrency(summary.totalExpenses)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <QuickTransactionForm
        value={quickInput}
        error={formError}
        onChange={setQuickInput}
        onSubmit={handleQuickSubmit}
      />

      <TransactionsSection
        transactions={visibleTransactions}
        totalCount={transactions.length}
        categories={categories}
        filters={filters}
        sort={sort}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onEdit={handleStartEdit}
        onDelete={handleDeleteTransaction}
        onExportCsv={handleExportCsv}
      />

      <EditTransactionDialog
        transaction={editingTransaction}
        error={editError}
        onClose={handleCloseEditDialog}
        onSubmit={handleEditSubmit}
        onFieldChange={handleEditFieldChange}
      />
    </section>
  );
}
