import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
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
import { TransactionFormState, TransactionType } from "@/entities/transaction/model/transactions";

type EditTransactionDialogProps = {
  transaction: TransactionFormState | null;
  error: string;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange: <K extends keyof TransactionFormState>(
    field: K,
    value: TransactionFormState[K],
  ) => void;
};

export function EditTransactionDialog({
  transaction,
  error,
  onClose,
  onSubmit,
  onFieldChange,
}: EditTransactionDialogProps) {
  return (
    <Dialog open={transaction !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование транзакции</DialogTitle>
          <DialogDescription>
            Обновите дату, категорию, тип, сумму и комментарий.
          </DialogDescription>
        </DialogHeader>

        {transaction ? (
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="transaction-date">Дата</Label>
              <Input
                id="transaction-date"
                type="date"
                value={transaction.date}
                onChange={(event) => onFieldChange("date", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-category">Категория</Label>
              <Input
                id="transaction-category"
                value={transaction.category}
                onChange={(event) => onFieldChange("category", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-type">Тип</Label>
              <Select
                value={transaction.type}
                onValueChange={(value) => onFieldChange("type", value as TransactionType)}
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
                value={transaction.amount}
                onChange={(event) => onFieldChange("amount", event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="transaction-comment">Комментарий</Label>
              <Textarea
                id="transaction-comment"
                value={transaction.comment}
                onChange={(event) => onFieldChange("comment", event.target.value)}
                placeholder="Необязательный комментарий"
              />
            </div>

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
