import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const PresetCard = ({ 
  preset, 
  isSelected, 
  onClick, 
  onEdit, 
  isDragging = false,
  dragHandleProps = {}
}) => {
  const getCategoryColor = (category) => {
    const colors = {
      "comprehensive": "default",
      "youtube": "danger",
      "blog": "success", 
      "social": "secondary",
      "technical": "warning",
      "marketing": "default",
      "podcast": "secondary",
      "ecommerce": "success",
      "newsletter": "warning",
      "webinar": "default",
      "corporate": "secondary",
      "startup": "danger",
      "healthcare": "success",
      "finance": "warning",
      "nonprofit": "default",
      "local": "secondary"
    };
    return colors[category] || "default";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "comprehensive": "Layers",
      "youtube": "Youtube",
      "blog": "PenTool",
      "social": "Share2",
      "technical": "Code2",
      "marketing": "TrendingUp",
      "podcast": "Mic",
      "ecommerce": "ShoppingCart",
      "newsletter": "Mail",
      "webinar": "Video",
      "corporate": "Building",
      "startup": "Rocket",
      "healthcare": "Heart",
      "finance": "DollarSign",
      "nonprofit": "HandHeart",
      "local": "MapPin"
    };
    return icons[category] || "FileText";
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg border-2",
        isSelected 
          ? "border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200" 
          : "border-transparent hover:border-gray-200 hover:-translate-y-1",
        isDragging && "opacity-50 scale-105 shadow-2xl rotate-1"
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div {...dragHandleProps} className="cursor-move p-1 hover:bg-gray-100 rounded transition-colors">
              <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
            </div>
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              isSelected ? "bg-primary-100" : "bg-gray-100"
            )}>
              <ApperIcon 
name={getCategoryIcon(preset.category_c)} 
                className={cn(
                  "w-5 h-5",
                  isSelected ? "text-primary-600" : "text-gray-600"
                )}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
<Badge variant={getCategoryColor(preset.category_c)}>
{preset.category_c}
            </Badge>
            {preset.is_custom_c && (
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(preset);
                }}
              >
                <ApperIcon name="Edit2" className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
        <CardTitle className={cn(
          "text-base leading-tight",
          isSelected ? "text-primary-900" : "text-gray-900"
        )}>
{preset.Name}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <p className={cn(
          "text-sm leading-relaxed line-clamp-3",
          isSelected ? "text-primary-700" : "text-gray-600"
        )}>
{preset.description_c}
        </p>
        
{preset.suggested_c && (
          <div className="mt-3 flex items-center space-x-1">
            <ApperIcon name="Star" className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-yellow-600">Suggested</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PresetCard;