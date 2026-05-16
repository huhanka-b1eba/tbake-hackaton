import { useCounterStore } from "@/features/counter/model/use-counter-store";

export function HomePage() {
  const { value, increment } = useCounterStore();

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-black bg-white p-6">
        <h2 className="text-xl font-semibold">Home</h2>
        <p className="mt-2 text-sm">
          Simple page inside `pages/home/ui`, state lives in `features/counter`.
        </p>
      </div>

      <div className="rounded-xl border border-black bg-white p-6">
        <p className="text-sm">Counter</p>
        <p className="mt-2 text-4xl font-semibold">{value}</p>
        <button
          type="button"
          onClick={increment}
          className="mt-4 rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Increment
        </button>
      </div>
    </section>
  );
}
