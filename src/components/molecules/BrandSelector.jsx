import React, { useState, useRef, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const BrandSelector = ({ brands, selectedBrand, onBrandChange, onManageBrands, currentTenant }) => {
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

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <Button
        variant="secondary"
        className="flex items-center space-x-2 min-w-[140px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{selectedBrand?.emoji}</span>
        <span className="font-medium">{selectedBrand?.name}</span>
        <ApperIcon 
          name={isOpen ? "ChevronUp" : "ChevronDown"} 
          className="w-4 h-4 text-gray-500" 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-slide-in-top">
          <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
            Select Brand
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {brands.map((brand) => (
              <button
                key={brand.Id}
                className={cn(
                  "w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-gray-50 transition-colors duration-150",
                  selectedBrand?.Id === brand.Id && "bg-primary-50 text-primary-700"
                )}
                onClick={() => {
                  onBrandChange(brand);
                  setIsOpen(false);
                }}
              >
                <span className="text-lg">{brand.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{brand.name}</div>
                </div>
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: brand.color }}
                ></div>
                {selectedBrand?.Id === brand.Id && (
                  <ApperIcon name="Check" className="w-4 h-4 text-primary-600" />
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              className="w-full px-4 py-2 text-left flex items-center space-x-2 text-primary-600 hover:bg-primary-50 transition-colors duration-150"
              onClick={() => {
                onManageBrands();
                setIsOpen(false);
              }}
            >
              <ApperIcon name="Settings" className="w-4 h-4" />
              <span className="font-medium">Manage Brands</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandSelector;