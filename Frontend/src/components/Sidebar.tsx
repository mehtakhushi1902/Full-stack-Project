import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Form,
  TrendingUp,
  MessageSquare,
  Settings,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useThemeStore } from '../Theme/theme';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/form', label: 'Form', icon: Form },
    { path: '/react-query', label: 'React Query', icon: MessageSquare },
    { path: '/payment', label: 'Payment', icon: Settings },
  ];

  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      theme === "dark"
    );
  }, [theme]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between w-64  border-r border-brand-border py-6 px-4 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${isOpen ? 'translate-x-0' : '-translate-x-0 hidden lg:flex'
          }`}
      >
        <Card className="[box-shadow:none] flex flex-col gap-8">
          <CardContent className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-brand-purple rounded-xl text-white shadow-md shadow-brand-purple/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-brand-dark">Dabang</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-8 w-8  text-brand-gray"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </Button>
          </CardContent>

          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={({ isActive }) => `flex items-center justify-between w-full px-4 py-3.5 rounded-xl font-semibold text-nav transition-all duration-200 group ${isActive
                    ? 'bg-brand-gray  shadow-lg shadow-brand-purple/20'
                    : 'text-brand-gray  hover:text-brand-dark'
                    }`}
                >
                  {({ isActive }) => (
                    <CardContent className="flex items-center gap-3.5">
                      <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-white' : 'text-brand-gray group-hover:text-brand-dark'
                        }`} />
                      <span>{item.label}</span>
                    </CardContent>
                  )}

                </NavLink>
              );
            })}
          </nav>
        </Card>


      </aside>
    </>
  );
};
