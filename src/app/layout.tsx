import { Moon, Sun } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTheme } from "@/app/providers/theme-provider";
import { Button } from "@/shared/ui/button";

const links = [
  { to: "/", label: "Главная" },
  { to: "/anailitica", label: "Аналитика" },
];

export function AppLayout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
        <header className="mb-8 rounded-xl border border-black/10 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-black/70 dark:text-zinc-300">КопиМопс — финансовый друг студента, который помогает дожить до стипендии.</p>
              <h1 className="text-2xl font-semibold">Личный дашборд</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <nav className="flex gap-2">
                {links.map((link) => {
                  const active = location.pathname === link.to;
                  return (
                    <Button
                      key={link.to}
                      asChild
                      variant={active ? "default" : "outline"}
                    >
                      <Link to={link.to}>{link.label}</Link>
                    </Button>
                  );
                })}
              </nav>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                aria-label={theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"}
                title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
              >
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
