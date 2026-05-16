import { useState } from "react";
import { useCounterStore } from "@/features/counter/model/use-counter-store";
import { useProjectTitleStore } from "@/features/project-title/model/use-project-title-store";

export function SandboxPage() {
  const [text, setText] = useState("");
  const { value, decrement } = useCounterStore();
  const { title, setTitle } = useProjectTitleStore();

  return (
    <section className="grid gap-6">
      <div className="rounded-xl border border-black bg-white p-6">
        <h2 className="text-xl font-semibold">Sandbox</h2>
        <p className="mt-2 text-sm">
          Simple page inside `pages/sandbox/ui`, state lives in feature stores.
        </p>
      </div>

      <div className="rounded-xl border border-black bg-white p-6">
        <label className="mb-2 block text-sm">Project title</label>
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type anything"
          className="w-full rounded-md border border-black bg-white px-3 py-2 text-sm outline-none"
        />
        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setTitle(text)}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white"
          >
            Save title
          </button>
          <button
            type="button"
            onClick={decrement}
            className="rounded-md border border-black px-4 py-2 text-sm font-medium"
          >
            Decrement
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-black bg-white p-6">
        <p className="text-sm">Stored title</p>
        <p className="mt-2 text-lg font-medium">{title || "Empty"}</p>
        <p className="mt-4 text-sm">Shared counter: {value}</p>
      </div>
    </section>
  );
}
