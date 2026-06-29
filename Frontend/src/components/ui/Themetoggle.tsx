import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
    theme: "light" | "dark";
    toggleTheme: () => void;
}

export function ThemeToggle({
    theme,
    toggleTheme,
}: ThemeToggleProps) {
    return (
        <button
            onClick={toggleTheme}
            className="relative flex items-center w-16 h-8 rounded-full bg-muted transition-colors bg-brand-purple/20 "
        >

            {theme == "dark" ? <Sun className="absolute left-2 h-4 w-4" /> : <Moon className="absolute right-2 h-4 w-4" />}

            <div
                className={`absolute h-6 w-6 rounded-full bg-background shadow-md transition-transform duration-300 ${theme === "dark"
                    ? "translate-x-9"
                    : "translate-x-1"
                    }`}
            />
        </button>
    );
}