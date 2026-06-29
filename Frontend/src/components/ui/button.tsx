import { useThemeStore } from "@/Theme/theme";
import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(

  ({ className = "", variant = "default", size = "default", ...props }, ref) => {
    const theme = useThemeStore((state) => state.theme);
    const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default: `${theme == "dark" ? "bg-gray-300" : "bg-brand-purple/70"} text-white hover:bg-brand-purple/90 shadow-md shadow-brand-purple/10`,
      outline: "border border-brand-divider text-brand-dark ",
      secondary: "bg-brand-purple/10 text-brand-purple hover:bg-brand-purple/15",
      ghost: "hover:bg-brand-bg text-brand-gray hover:text-brand-dark",
      destructive: "border border-red-200 hover:bg-red-50 text-red-500"
    };

    const sizeStyles = {
      default: "px-4 py-2.5",
      sm: "px-3.5 py-2",
      lg: "px-6 py-3 text-sm",
      icon: "h-9 w-9"
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
