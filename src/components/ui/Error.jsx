import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  title = "Something went wrong",
  message = "We encountered an error while loading this content.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {message}
      </p>
      
      {showRetry && onRetry && (
        <div className="flex gap-3">
          <Button onClick={onRetry} variant="gradient">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Refresh Page
          </Button>
        </div>
      )}
    </div>
  );
};

export default Error;