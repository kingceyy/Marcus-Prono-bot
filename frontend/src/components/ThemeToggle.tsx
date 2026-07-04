import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Passer au thème sombre" : "Passer au thème clair"}
      className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition active:scale-90 hover:border-primary/60"
    >
      <Sun
        className={`absolute h-[18px] w-[18px] text-primary transition-all duration-300 ${
          isLight ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] text-muted-foreground transition-all duration-300 ${
          isLight ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        }`}
      />
    </button>
  );
}
