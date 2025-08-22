import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import BrandSelector from "@/components/molecules/BrandSelector";
import TenantSelector from "@/components/molecules/TenantSelector";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const TopNavigation = ({ 
  brands, 
  selectedBrand, 
  onBrandChange, 
  onManageBrands,
  onManageTenants,
  currentUser = { name: "Content Creator", avatar: null }
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigationItems = [
    { path: "/", label: "Home", icon: "Home" },
    { path: "/dashboard", label: "Dashboard", icon: "BarChart3" },
    { path: "/library", label: "Library", icon: "Library" },
    { path: "/analytics", label: "Analytics", icon: "TrendingUp" },
    { path: "/profile", label: "Profile", icon: "User" }
  ];

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav 
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm"
      onKeyDown={handleKeyDown}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">
                ContentCraft Pro
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary-50 text-primary-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )
                }
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

{/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Tenant Selector */}
            <TenantSelector onManageTenants={onManageTenants} />
            
            {/* Brand Selector */}
            <BrandSelector
              brands={brands}
              selectedBrand={selectedBrand}
              onBrandChange={onBrandChange}
              onManageBrands={onManageBrands}
            />
            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 px-3 py-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <ApperIcon name="User" className="w-4 h-4 text-white" />
                  )}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {currentUser.name}
                </span>
                <ApperIcon 
                  name={isUserMenuOpen ? "ChevronUp" : "ChevronDown"} 
                  className="w-4 h-4 text-gray-500" 
                />
              </Button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-slide-in-top">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">Content Creator</p>
                  </div>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    onClick={() => {
                      navigate("/profile");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <ApperIcon name="Settings" className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    onClick={() => {
                      navigate("/");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    <ApperIcon name="HelpCircle" className="w-4 h-4" />
                    <span>Help</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                className="w-5 h-5" 
              />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2 animate-slide-in-top">
            <div className="space-y-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    )
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default TopNavigation;