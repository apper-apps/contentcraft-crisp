import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useTenant } from "@/contexts/TenantContext";
import { cn } from "@/utils/cn";

const TenantSelector = ({ onManageTenants }) => {
  const { currentTenant, tenants, switchTenant } = useTenant();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (!currentTenant || tenants.length <= 1) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 min-w-[160px] border border-gray-200 bg-white/80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentTenant.primaryColor }}
          />
          <span className="font-medium text-gray-900">{currentTenant.name}</span>
        </div>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-gray-500" 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-slide-in-top">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Switch Tenant
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {tenants.map((tenant) => (
              <button
                key={tenant.Id}
                className={cn(
                  "w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150",
                  currentTenant?.Id === tenant.Id && "bg-blue-50 text-blue-700"
                )}
                onClick={() => {
                  switchTenant(tenant);
                  setIsOpen(false);
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: tenant.primaryColor }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{tenant.name}</div>
                  <div className="text-xs text-gray-500 truncate">{tenant.domain}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    tenant.subscription.status === 'active' 
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  )}>
                    {tenant.subscription.plan}
                  </div>
                  {currentTenant?.Id === tenant.Id && (
                    <ApperIcon name="Check" className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {onManageTenants && (
            <div className="border-t border-gray-100 mt-2 pt-2">
              <button
                className="w-full px-4 py-2 text-left flex items-center space-x-2 text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                onClick={() => {
                  onManageTenants();
                  setIsOpen(false);
                }}
              >
                <ApperIcon name="Building2" className="w-4 h-4" />
                <span className="font-medium">Manage Tenants</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantSelector;