import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Chart from "react-apexcharts";
import { contentService } from "@/services/api/contentService";
import { useTenant } from "@/contexts/TenantContext";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
const Analytics = ({ selectedBrand }) => {
// Simplified tenant for this implementation
  const currentTenant = { Id: 1 };
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7d");

useEffect(() => {
    loadAnalytics();
  }, [selectedBrand, currentTenant]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contentService.getAll(currentTenant?.Id);
      const filteredData = selectedBrand && selectedBrand.Id
        ? data.filter(item => item.brand_id_c === selectedBrand.Id)
        : data;
      setContents(filteredData);
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading analytics..." />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  if (contents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6">
          <Empty
            icon="BarChart3"
            title="No analytics data"
            description="Generate some content to see your analytics and insights"
            actionLabel="Start Creating"
            onAction={() => window.location.href = "/"}
          />
        </div>
      </div>
    );
  }

  // Calculate metrics
const totalContent = contents.length;
  const totalWords = contents.reduce((acc, c) => acc + (c.word_count_c || 1250), 0);
  const avgWordsPerContent = Math.round(totalWords / totalContent);
  
const last7Days = contents.filter(c => {
    const contentDate = new Date(c.created_at_c);
    const sevenDaysAgo = subDays(new Date(), 7);
    return contentDate >= sevenDaysAgo;
  }).length;

  // Prepare chart data
const getDailyData = () => {
    const days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date()
    });

    return days.map(day => {
      const dayContents = contents.filter(c => {
        const contentDate = new Date(c.created_at_c);
        return format(contentDate, "yyyy-MM-dd") === format(day, "yyyy-MM-dd");
      });
      
      return {
        date: format(day, "MMM d"),
        content: dayContents.length,
        words: dayContents.reduce((acc, c) => acc + (c.word_count_c || 1250), 0)
      };
    });
  };

  const dailyData = getDailyData();

  // Content type distribution
const getContentTypeData = () => {
    const types = {};
    contents.forEach(content => {
      if (content.outputs_c) {
        Object.keys(JSON.parse(content.outputs_c || '{}')).forEach(type => {
          types[type] = (types[type] || 0) + 1;
        });
      }
    });

    return Object.entries(types).map(([type, count]) => ({
      type: type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()),
      count
    })).slice(0, 6);
  };

  const contentTypeData = getContentTypeData();

  // Preset usage
  const getPresetUsage = () => {
const presets = {};
    contents.forEach(content => {
      const preset = content.preset_c || "Unknown";
      presets[preset] = (presets[preset] || 0) + 1;
    });

    return Object.entries(presets)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([preset, count]) => ({ preset, count }));
  };

  const presetUsage = getPresetUsage();

  // Chart configurations
  const dailyChartOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
      background: "transparent"
    },
    colors: ["#3B82F6", "#8B5CF6"],
    stroke: {
      width: 3,
      curve: "smooth"
    },
    xaxis: {
      categories: dailyData.map(d => d.date),
      labels: {
        style: { colors: "#6B7280" }
      }
    },
    yaxis: [
      {
        title: {
          text: "Content Pieces",
          style: { color: "#6B7280" }
        },
        labels: {
          style: { colors: "#6B7280" }
        }
      },
      {
        opposite: true,
        title: {
          text: "Words Generated",
          style: { color: "#6B7280" }
        },
        labels: {
          style: { colors: "#6B7280" }
        }
      }
    ],
    grid: {
      borderColor: "#E5E7EB"
    },
    legend: {
      labels: {
        colors: "#6B7280"
      }
    }
  };

  const dailyChartSeries = [
    {
      name: "Content Created",
      data: dailyData.map(d => d.content),
      yAxisIndex: 0
    },
    {
      name: "Words Generated",
      data: dailyData.map(d => d.words),
      yAxisIndex: 1
    }
  ];

  const typeChartOptions = {
    chart: {
      type: "donut",
      height: 350
    },
    colors: ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1"],
    labels: contentTypeData.map(d => d.type),
    legend: {
      position: "bottom",
      labels: {
        colors: "#6B7280"
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%"
        }
      }
    }
  };

  const typeChartSeries = contentTypeData.map(d => d.count);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Insights and performance metrics for your content
            </p>
          </div>
          <div className="flex items-center space-x-2">
<span className="text-2xl">{selectedBrand?.emoji_c || "📊"}</span>
            <div className="text-right">
              <p className="font-medium text-gray-900">{selectedBrand?.Name || "All Brands"}</p>
              <p className="text-sm text-gray-500">Analytics Scope</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Content</p>
                  <div className="text-3xl font-bold text-gray-900">{totalContent}</div>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <ApperIcon name="TrendingUp" className="w-4 h-4 mr-1" />
                    <span>+{last7Days} this week</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="FileText" className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Words</p>
                  <div className="text-3xl font-bold text-gray-900">{totalWords.toLocaleString()}</div>
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <ApperIcon name="Type" className="w-4 h-4 mr-1" />
                    <span>Avg: {avgWordsPerContent}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="BarChart3" className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Content Types</p>
                  <div className="text-3xl font-bold text-gray-900">{contentTypeData.length}</div>
                  <div className="flex items-center mt-2 text-sm text-purple-600">
                    <ApperIcon name="Grid" className="w-4 h-4 mr-1" />
                    <span>Formats used</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Grid" className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Efficiency</p>
                  <div className="text-3xl font-bold text-gray-900">94%</div>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <ApperIcon name="CheckCircle" className="w-4 h-4 mr-1" />
                    <span>Success rate</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Target" className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="Activity" className="w-5 h-5 text-primary-600" />
                <span>Content Creation Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={dailyChartOptions}
                series={dailyChartSeries}
                type="line"
                height={350}
              />
            </CardContent>
          </Card>

          {/* Content Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ApperIcon name="PieChart" className="w-5 h-5 text-primary-600" />
                <span>Content Type Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart
                options={typeChartOptions}
                series={typeChartSeries}
                type="donut"
                height={350}
              />
            </CardContent>
          </Card>
        </div>

        {/* Top Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Star" className="w-5 h-5 text-primary-600" />
              <span>Most Used Presets</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {presetUsage.map((preset, index) => (
                <div key={preset.preset} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm font-medium text-primary-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{preset.preset}</p>
                      <p className="text-sm text-gray-500">Used {preset.count} times</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(preset.count / Math.max(...presetUsage.map(p => p.count))) * 100}%` }}
                      ></div>
                    </div>
                    <Badge variant="secondary">{preset.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;