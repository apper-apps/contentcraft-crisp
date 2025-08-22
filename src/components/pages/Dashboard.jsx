import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { useNavigate } from "react-router-dom";
import { contentService } from "@/services/api/contentService";
import { useTenant } from "@/contexts/TenantContext";
import { format } from "date-fns";

const Dashboard = ({ selectedBrand }) => {
  const { currentTenant } = useTenant();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [selectedBrand, currentTenant]);

const loadDashboardData = async () => {
    try {
      setLoading(true);
const data = await contentService.getAll(currentTenant?.Id);
      setContents(data);
      
      const filteredData = selectedBrand && selectedBrand.Id
        ? data.filter(item => item.brandId === selectedBrand.Id)
        : data;
      setContents(filteredData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const stats = {
    totalContent: contents.length,
    thisWeek: contents.filter(c => {
      const createdDate = new Date(c.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate >= weekAgo;
    }).length,
    totalWords: contents.reduce((acc, c) => acc + (c.wordCount || 0), 0),
    avgRating: contents.length > 0 ? 4.8 : 0
  };

  const quickActions = [
    {
      title: "Generate Content",
      description: "Create new AI-powered content",
      icon: "Zap",
      action: () => navigate("/"),
      variant: "gradient"
    },
    {
      title: "View Library",
      description: "Browse your content collection",
      icon: "Library",
      action: () => navigate("/library"),
      variant: "secondary"
    },
    {
      title: "Analytics",
      description: "View performance insights",
      icon: "TrendingUp", 
      action: () => navigate("/analytics"),
      variant: "secondary"
    },
    {
      title: "Settings",
      description: "Manage your profile and preferences",
      icon: "Settings",
      action: () => navigate("/profile"),
      variant: "secondary"
    }
  ];

  const recentContent = contents.slice(0, 6);

  const renderStatCard = (title, value, icon, change) => (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {change && (
              <div className="flex items-center mt-2 text-sm">
                <ApperIcon name="TrendingUp" className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">{change}</span>
              </div>
            )}
          </div>
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            <ApperIcon name={icon} className="w-6 h-6 text-primary-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's your content overview for {selectedBrand?.name || "your account"}.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{selectedBrand?.emoji || "🚀"}</span>
            <div className="text-right">
              <p className="font-medium text-gray-900">{selectedBrand?.name || "Default Brand"}</p>
              <p className="text-sm text-gray-500">Active Brand</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {renderStatCard("Total Content", stats.totalContent, "FileText", "+12% this month")}
          {renderStatCard("This Week", stats.thisWeek, "Calendar", "+23% vs last week")}
          {renderStatCard("Total Words", stats.totalWords.toLocaleString(), "Type", "+8% this month")}
          {renderStatCard("Avg. Rating", stats.avgRating.toFixed(1), "Star", "Excellent quality")}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Zap" className="w-5 h-5 text-primary-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant={action.variant}
                  className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
                  onClick={action.action}
                >
                  <ApperIcon name={action.icon} className="w-6 h-6" />
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-75">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Clock" className="w-5 h-5 text-primary-600" />
              <span>Recent Content</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/library")}
            >
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {recentContent.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentContent.map((content) => (
                  <Card key={content.Id} className="card-hover">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="FileText" className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {content.preset}
                          </span>
                        </div>
                        <Badge variant="success" className="text-xs">
                          {content.outputCount || 4} outputs
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {content.input}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{format(new Date(content.createdAt), "MMM d, yyyy")}</span>
                        <div className="flex items-center space-x-1">
                          <ApperIcon name="BarChart3" className="w-3 h-3" />
                          <span>{content.wordCount || 1250} words</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty
                icon="FileText"
                title="No content yet"
                description="Start by generating your first piece of content"
                actionLabel="Create Content"
                onAction={() => navigate("/")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;