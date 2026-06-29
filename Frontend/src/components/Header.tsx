import React from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useThemeStore } from '../Theme/theme';
import { ThemeToggle } from './ui/Themetoggle';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {

  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="flex items-center justify-between w-full px-6 py-4 border-b border-brand-border lg:border-none lg:bg-transparent">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="-ml-2 text-brand-dark hover:bg-gray-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-xl pr-1 lg:pr-3 font-bold md:text-2xl text-brand-dark">Dashboard</h1>
      </div>

      <div className="flex items-center gap-1 md:gap-1 lg:gap-4">
        <div className="relative hidden md:block w-72">
          <Input
            type="text"
            placeholder="Search here..."
            className="pl-9 pr-4 bg-input-bg border-gray-300 text-sm placeholder-input-placeholder"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
        </div>

        <Button variant="ghost" size="icon" className="text-brand-gray hover:bg-gray-100 md:hidden" aria-label="Search">
          <Search className="w-5 h-5" />
        </Button>

        <Button variant="ghost" className="px-3 py-2 hover:bg-gray-100">
          <span className="hidden sm:inline text-xs font-semibold text-brand-dark">Eng (US)</span>
          <ChevronDown className="w-4 h-4 text-brand-gray" />
        </Button>

        <ThemeToggle
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <Button variant="ghost" size="icon" className="relative bg-alert-bg text-alert-accent hover:bg-alert-bg-hover" aria-label="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger-accent rounded-full border border-white" />
        </Button>

        <Button variant="ghost" className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-brand-divider hover:bg-transparent">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm bg-gradient-to-tr from-brand-purple to-indigo-400 text-white font-bold text-sm flex items-center justify-center">
            M
          </div>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-bold leading-tight text-brand-dark">Master</span>
            <span className="text-xs text-brand-gray mt-0.5">Admin</span>
          </div>
          <ChevronDown className="hidden sm:block w-4 h-4 text-brand-gray" />
        </Button>
      </div>
    </header>
  );
};
