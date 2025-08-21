import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";

const OutputPanel = ({ type, content, isGenerating = false }) => {
  const [copied, setCopied] = useState(false);

  const getTypeConfig = (type) => {
    const configs = {
      youtube_description: {
        name: "YouTube Description",
        icon: "Youtube",
        color: "danger",
        placeholder: "YouTube description will appear here..."
      },
      blog_post: {
        name: "Blog Post",
        icon: "PenTool", 
        color: "success",
        placeholder: "Blog post content will appear here..."
      },
      forum_post: {
        name: "Forum Post",
        icon: "MessageSquare",
        color: "secondary",
        placeholder: "Forum post content will appear here..."
      },
      seo_tags: {
        name: "SEO Tags",
        icon: "Tag",
        color: "warning",
        placeholder: "SEO tags and keywords will appear here..."
      },
      timestamps: {
        name: "Timestamps",
        icon: "Clock",
        color: "default",
        placeholder: "Video timestamps will appear here..."
      },
      voice_analysis: {
        name: "Voice Analysis",
        icon: "Mic",
        color: "secondary",
        placeholder: "Voice analysis will appear here..."
      },
      social_posts: {
        name: "Social Media",
        icon: "Share2",
        color: "default",
        placeholder: "Social media posts will appear here..."
      },
      email_newsletter: {
        name: "Email Newsletter",
        icon: "Mail",
        color: "warning",
        placeholder: "Newsletter content will appear here..."
      }
    };
    return configs[type] || {
      name: type,
      icon: "FileText",
      color: "default",
      placeholder: "Content will appear here..."
    };
  };

  const config = getTypeConfig(type);

  const copyToClipboard = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success(`${config.name} copied to clipboard!`);
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy content");
    }
  };

  const downloadContent = () => {
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.name.toLowerCase().replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success(`${config.name} downloaded successfully!`);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <ApperIcon name={config.icon} className="w-4 h-4 text-gray-600" />
            </div>
            <CardTitle className="text-base">{config.name}</CardTitle>
          </div>
          <Badge variant={config.color} className="text-xs">
            {content ? "Ready" : "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-0">
        <div className="flex-1 relative">
          {isGenerating ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Generating {config.name.toLowerCase()}...</p>
              </div>
            </div>
          ) : content ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full min-h-[128px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                {content}
              </pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-500 text-center px-4">
                {config.placeholder}
              </p>
            </div>
          )}
        </div>

        {content && !isGenerating && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {content.length} characters
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                disabled={!content}
              >
                <ApperIcon 
                  name={copied ? "CheckCircle" : "Copy"} 
                  className="w-4 h-4 mr-1" 
                />
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadContent}
                disabled={!content}
              >
                <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OutputPanel;