import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    default: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm focus:ring-primary-500",
    ghost: "hover:bg-gray-100 text-gray-900 focus:ring-primary-500",
    gradient: "bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-lg focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg focus:ring-red-500"
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    default: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    icon: "w-10 h-10"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;