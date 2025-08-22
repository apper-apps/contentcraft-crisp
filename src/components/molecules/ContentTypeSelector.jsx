import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const ContentTypeSelector = ({ selectedTypes = [], onTypesChange }) => {
  const contentTypes = [
    {
      id: "youtube_description",
      name: "YouTube Description",
      icon: "Youtube",
      description: "Optimized video descriptions with tags and timestamps"
    },
    {
      id: "blog_post",
      name: "Blog Post",
      icon: "PenTool",
      description: "SEO-optimized blog content with proper structure"
    },
    {
      id: "forum_post",
      name: "Forum Post",
      icon: "MessageSquare",
      description: "Community-focused discussion content"
    },
    {
      id: "seo_tags",
      name: "SEO Tags",
      icon: "Tag",
      description: "Keywords and meta tags for search optimization"
    },
    {
      id: "timestamps",
      name: "Timestamps",
      icon: "Clock",
      description: "Video chapter markers and time codes"
    },
    {
      id: "voice_analysis",
      name: "Voice Analysis",
      icon: "Mic",
      description: "Tone and style analysis of content"
    },
    {
      id: "social_posts",
      name: "Social Media Posts",
      icon: "Share2",
      description: "Multi-platform social media content"
    },
    {
      id: "email_newsletter",
      name: "Email Newsletter",
      icon: "Mail",
      description: "Newsletter-formatted content with sections"
    }
  ];

  const handleTypeToggle = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      onTypesChange(selectedTypes.filter(id => id !== typeId));
    } else {
      onTypesChange([...selectedTypes, typeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedTypes.length === contentTypes.length) {
      onTypesChange([]);
    } else {
      onTypesChange(contentTypes.map(type => type.id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Select the content types you want to generate ({selectedTypes.length} selected)
        </p>
        <button
          onClick={handleSelectAll}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          {selectedTypes.length === contentTypes.length ? "Deselect All" : "Select All"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {contentTypes.map((type) => {
          const isSelected = selectedTypes.includes(type.id);
          
          return (
            <div
              key={type.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all duration-200",
                isSelected
                  ? "border-primary-500 bg-primary-50 shadow-md"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
              onClick={() => handleTypeToggle(type.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                  isSelected ? "bg-primary-100" : "bg-gray-100"
                )}>
                  <ApperIcon
                    name={type.icon}
                    className={cn(
                      "w-4 h-4",
                      isSelected ? "text-primary-600" : "text-gray-600"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={cn(
                      "font-medium text-sm",
                      isSelected ? "text-primary-900" : "text-gray-900"
                    )}>
                      {type.name}
                    </h4>
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      isSelected
                        ? "border-primary-500 bg-primary-500"
                        : "border-gray-300"
                    )}>
                      {isSelected && (
                        <ApperIcon name="Check" className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                  <p className={cn(
                    "text-xs mt-1",
                    isSelected ? "text-primary-700" : "text-gray-500"
                  )}>
                    {type.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTypes.length === 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">
            Please select at least one content type to generate
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentTypeSelector;