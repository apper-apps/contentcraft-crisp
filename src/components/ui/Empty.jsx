import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "FileText",
  title = "No content found",
  description = "Get started by creating your first content piece.",
  actionLabel = "Create New",
  onAction,
  showAction = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-indigo-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {showAction && onAction && (
        <Button onClick={onAction} variant="gradient" size="lg">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;