import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

type QuickTransactionFormProps = {
  value: string;
  error: string;
  onChange: (value: string) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

export function QuickTransactionForm({
  value,
  error,
  onChange,
  onSubmit,
}: QuickTransactionFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Быстрый ввод</CardTitle>
        <CardDescription>
          Введите транзакцию в виде: р/д категория сумма комментарий
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={onSubmit}>
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="р авто 100 комментарий"
            aria-label="Быстрый ввод транзакции"
          />
          <Button type="submit" className="w-full md:w-auto">
            Добавить
          </Button>
        </form>
        {error ? (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        ) : (
          <p className="mt-3 text-sm text-black/60 dark:text-zinc-400">
            `р` означает расход, `д` означает доход. После категории пишется сумма, а
            все слова после суммы сохраняются как комментарий.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
