import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ContentTypeSelector = ({ selectedTypes, onTypesChange }) => {
  const contentTypes = [
    {
      id: "youtube_description",
      name: "YouTube Description",
      icon: "Youtube",
      description: "SEO-optimized video descriptions"
    },
    {
      id: "blog_post",
      name: "Blog Post",
      icon: "PenTool",
      description: "Full-length blog articles"
    },
    {
      id: "forum_post",
      name: "Forum Post",
      icon: "MessageSquare",
      description: "Discussion forum content"
    },
    {
      id: "seo_tags",
      name: "SEO Tags",
      icon: "Tag",
      description: "Keywords and meta tags"
    },
    {
      id: "timestamps",
      name: "Timestamps",
      icon: "Clock",
      description: "Video chapter markers"
    },
    {
      id: "voice_analysis",
      name: "Voice Analysis",
      icon: "Mic",
      description: "Speaking style and tone analysis"
    },
    {
      id: "social_posts",
      name: "Social Media",
      icon: "Share2",
      description: "Twitter, LinkedIn, Facebook posts"
    },
    {
      id: "email_newsletter",
      name: "Email Newsletter",
      icon: "Mail",
      description: "Newsletter content blocks"
    }
  ];

  const handleTypeToggle = (typeId) => {
    const newTypes = selectedTypes.includes(typeId)
      ? selectedTypes.filter(id => id !== typeId)
      : [...selectedTypes, typeId];
    onTypesChange(newTypes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Types</h3>
        <div className="text-sm text-gray-600">
          {selectedTypes.length} selected
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {contentTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          
          return (
            <div
              key={type.id}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              onClick={() => handleTypeToggle(type.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  isSelected ? "bg-primary-100" : "bg-gray-100"
                )}>
                  <ApperIcon 
                    name={type.icon} 
                    className={cn(
                      "w-4 h-4",
                      isSelected ? "text-primary-600" : "text-gray-500"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-medium text-sm mb-1",
                    isSelected ? "text-primary-900" : "text-gray-900"
                  )}>
                    {type.name}
                  </div>
                  <div className={cn(
                    "text-xs leading-tight",
                    isSelected ? "text-primary-700" : "text-gray-600"
                  )}>
                    {type.description}
                  </div>
                </div>
                <div className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0",
                  isSelected 
                    ? "border-primary-500 bg-primary-500" 
                    : "border-gray-300"
                )}>
                  {isSelected && (
                    <ApperIcon name="Check" className="w-3 h-3 text-white" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          onClick={() => onTypesChange(contentTypes.map(t => t.id))}
        >
          Select All
        </button>
        <span className="text-gray-300">•</span>
        <button
          className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          onClick={() => onTypesChange([])}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default ContentTypeSelector;