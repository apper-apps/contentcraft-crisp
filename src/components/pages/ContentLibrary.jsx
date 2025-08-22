import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { useNavigate } from "react-router-dom";
import { contentService } from "@/services/api/contentService";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const ContentLibrary = ({ selectedBrand }) => {
  const [activeTab, setActiveTab] = useState("history");
  const [contents, setContents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current tenant from localStorage or context
  const currentTenant = { Id: 1 }; // Simplified for this implementation

  const loadContents = async () => {
    try {
      setLoading(true);
      const data = await contentService.getAll(currentTenant?.Id);
      
      const filteredData = selectedBrand && selectedBrand.Id
        ? data.filter(item => item.brand_id_c === selectedBrand.Id)
        : data;
      setContents(filteredData);
    } catch (err) {
      setError("Failed to load content library");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents();
  }, [selectedBrand]);

  const handleDeleteContent = async (contentId) => {
    try {
      await contentService.delete(contentId);
      setContents(contents.filter(c => c.Id !== contentId));
      toast.success("Content deleted successfully");
    } catch (error) {
      toast.error("Failed to delete content");
    }
  };

  const copyContent = async (content, type) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${type} copied to clipboard!`);
    } catch (err) {
      toast.error("Failed to copy content");
    }
  };

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadContents} />;

  const categories = [
    { id: "all", name: "All Content", count: contents.length },
{ id: "youtube", name: "YouTube", count: contents.filter(c => c.preset_c?.includes("YouTube")).length },
    { id: "blog", name: "Blog Posts", count: contents.filter(c => c.preset_c?.includes("Blog")).length },
    { id: "social", name: "Social Media", count: contents.filter(c => c.preset_c?.includes("Social")).length },
    { id: "marketing", name: "Marketing", count: contents.filter(c => c.preset_c?.includes("Marketing")).length }
  ];

const filteredContents = contents.filter(content => {
    const matchesSearch = content.input_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.preset_c?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           content.preset_c?.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const historyContents = filteredContents.slice().reverse(); // Most recent first
  const libraryContents = filteredContents.filter(c => c.isSaved); // Saved/starred content

  const renderContentCard = (content) => (
<Card key={content.Id} className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" className="w-4 h-4 text-gray-500" />
            <CardTitle className="text-base">{content.preset_c}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="success" className="text-xs">
              {content.output_count_c || 4} outputs
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-6 w-6"
              onClick={() => handleDeleteContent(content.Id)}
            >
              <ApperIcon name="Trash2" className="w-3 h-3 text-red-500" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {content.input_c}
        </p>
        
        <div className="space-y-2 mb-4">
          {content.outputs_c && Object.entries(JSON.parse(content.outputs_c || '{}')).slice(0, 2).map(([type, output]) => (
            <div key={type} className="p-2 bg-gray-50 rounded border text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-700 capitalize">
                  {type.replace("_", " ")}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-5 text-xs"
                  onClick={() => copyContent(output, type)}
                >
                  <ApperIcon name="Copy" className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-gray-600 line-clamp-2">{output}</p>
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{format(new Date(content.created_at_c), "MMM d, yyyy 'at' h:mm a")}</span>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <ApperIcon name="BarChart3" className="w-3 h-3" />
              <span>{content.word_count_c || 1250} words</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" className="w-3 h-3" />
              <span>2m read</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = () => {
    if (activeTab === "history") {
      return (
        <Empty
          icon="Clock"
          title="No content history"
          description="Start generating content to see your history here"
          actionLabel="Generate Content"
          onAction={() => navigate("/")}
        />
      );
    } else {
      return (
        <Empty
          icon="BookOpen"
          title="No saved content"
          description="Save your favorite generated content to access it quickly"
          actionLabel="Browse History"
          onAction={() => setActiveTab("history")}
        />
      );
    }
  };

  const currentContents = activeTab === "history" ? historyContents : libraryContents;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
            <p className="text-gray-600 mt-1">
              Manage and organize your generated content
            </p>
          </div>
          <Button variant="gradient" onClick={() => navigate("/")}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Generate New
          </Button>
        </div>

        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "history"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("history")}
              >
                <ApperIcon name="Clock" className="w-4 h-4 mr-2 inline" />
                History ({historyContents.length})
              </button>
              <button
                className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "library"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveTab("library")}
              >
                <ApperIcon name="BookOpen" className="w-4 h-4 mr-2 inline" />
                Saved ({libraryContents.length})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="p-6">
            {currentContents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentContents.map(renderContentCard)}
              </div>
            ) : searchQuery || selectedCategory !== "all" ? (
              <div className="text-center py-12">
                <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all content.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              renderEmptyState()
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContentLibrary;