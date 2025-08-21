import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-primary-100 text-primary-800 hover:bg-primary-200",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    danger: "bg-red-100 text-red-800 hover:bg-red-200",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;