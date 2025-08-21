import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";

const BrandManager = ({ brands, onSave, onClose }) => {
  const [brandList, setBrandList] = useState([...brands]);
  const [newBrand, setNewBrand] = useState({
    name: "",
    color: "#3B82F6",
    emoji: "🚀"
  });
  const [isCreating, setIsCreating] = useState(false);

  const presetColors = [
    "#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", 
    "#EF4444", "#6366F1", "#EC4899", "#14B8A6",
    "#F97316", "#84CC16", "#06B6D4", "#8B5A2B"
  ];

  const emojiCategories = {
    business: ["🚀", "💼", "📈", "🎯", "⚡", "🔥", "💡", "🌟"],
    tech: ["💻", "🤖", "⚙️", "🔧", "📱", "🖥️", "⌚", "📡"],
    creative: ["🎨", "✨", "🎭", "🎪", "🎨", "🖌️", "📸", "🎬"],
    lifestyle: ["☕", "🏠", "🌱", "🎵", "📚", "🍕", "🏃", "✈️"]
  };

  const handleCreateBrand = () => {
    if (!newBrand.name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    if (brandList.some(brand => brand.name.toLowerCase() === newBrand.name.toLowerCase())) {
      toast.error("Brand name already exists");
      return;
    }

    const brand = {
      Id: Math.max(...brandList.map(b => b.Id)) + 1,
      name: newBrand.name.trim(),
      color: newBrand.color,
      emoji: newBrand.emoji,
      isDefault: false,
      createdAt: new Date().toISOString()
    };

    setBrandList([...brandList, brand]);
    setNewBrand({ name: "", color: "#3B82F6", emoji: "🚀" });
    setIsCreating(false);
    toast.success(`Brand "${brand.name}" created successfully`);
  };

  const handleDeleteBrand = (brandId) => {
    const brand = brandList.find(b => b.Id === brandId);
    
    if (brand?.isDefault) {
      toast.error("Cannot delete the default brand");
      return;
    }

    setBrandList(brandList.filter(b => b.Id !== brandId));
    toast.success(`Brand "${brand.name}" deleted successfully`);
  };

  const handleColorChange = (color) => {
    setNewBrand({ ...newBrand, color });
  };

  const handleSave = () => {
    onSave(brandList);
    onClose();
    toast.success("Brand settings saved successfully");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Brand Management</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Existing Brands */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Brands ({brandList.length})
              </h3>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {brandList.map((brand) => (
                  <Card key={brand.Id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{brand.emoji}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{brand.name}</h4>
                          {brand.isDefault && (
                            <span className="text-xs text-gray-500">Default Brand</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: brand.color }}
                        />
                        {!brand.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBrand(brand.Id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Create New Brand */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Create New Brand</h3>
                {!isCreating && (
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => setIsCreating(true)}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-1" />
                    New Brand
                  </Button>
                )}
              </div>

              {isCreating && (
                <Card className="p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Name
                      </label>
                      <Input
                        placeholder="Enter brand name..."
                        value={newBrand.name}
                        onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Color
                      </label>
                      <div className="grid grid-cols-6 gap-2 mb-3">
                        {presetColors.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              newBrand.color === color 
                                ? "border-gray-900" 
                                : "border-gray-300"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={newBrand.color}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className="w-16 h-10 p-1 cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand Emoji
                      </label>
                      <div className="space-y-3">
                        {Object.entries(emojiCategories).map(([category, emojis]) => (
                          <div key={category}>
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                              {category}
                            </p>
                            <div className="grid grid-cols-8 gap-1">
                              {emojis.map((emoji) => (
                                <button
                                  key={emoji}
                                  className={`text-xl p-2 rounded hover:bg-gray-100 transition-colors ${
                                    newBrand.emoji === emoji ? "bg-primary-100 ring-2 ring-primary-500" : ""
                                  }`}
                                  onClick={() => setNewBrand({ ...newBrand, emoji })}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button onClick={handleCreateBrand} variant="gradient" size="sm">
                        <ApperIcon name="Check" className="w-4 h-4 mr-1" />
                        Create Brand
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsCreating(false);
                          setNewBrand({ name: "", color: "#3B82F6", emoji: "🚀" });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSave}>
            <ApperIcon name="Save" className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandManager;