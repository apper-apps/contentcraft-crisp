import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import FileUpload from "@/components/molecules/FileUpload";
import PresetCard from "@/components/molecules/PresetCard";
import ContentTypeSelector from "@/components/molecules/ContentTypeSelector";
import OutputPanel from "@/components/molecules/OutputPanel";
import Loading from "@/components/ui/Loading";
import { toast } from "react-toastify";
import { presetService } from "@/services/api/presetService";
import { contentService } from "@/services/api/contentService";

const ContentGenerator = ({ selectedBrand }) => {
  const [presets, setPresets] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(["youtube_description", "blog_post", "seo_tags"]);
  const [inputText, setInputText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState({});
  const [activeTab, setActiveTab] = useState("text");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    try {
      setLoading(true);
      const data = await presetService.getAll();
      setPresets(data);
      if (data.length > 0) {
        setSelectedPreset(data[0]);
      }
    } catch (error) {
      toast.error("Failed to load presets");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPreset) {
      toast.error("Please select a preset");
      return;
    }

    if (!inputText.trim() && !selectedFile) {
      toast.error("Please provide content or upload a file");
      return;
    }

    if (selectedTypes.length === 0) {
      toast.error("Please select at least one content type");
      return;
    }

    try {
      setIsGenerating(true);
      setGeneratedContent({});
      
      const contentData = {
input_c: inputText || `File: ${selectedFile?.name}`,
preset_c: selectedPreset.Name,
types: selectedTypes,
brand_id_c: selectedBrand?.Id,
tenant_id_c: selectedBrand?.tenant_id_c
};

      toast.info("Starting content generation...");
      
      // Simulate AI generation with progressive updates
      for (const type of selectedTypes) {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        const content = await contentService.generateContent(contentData, type);
        
        setGeneratedContent(prev => ({
          ...prev,
          [type]: content
        }));

        toast.success(`${type.replace("_", " ")} generated successfully!`);
      }

      toast.success("All content generated successfully!");
      
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDemoGenerate = () => {
    setInputText("This is a sample video transcript about content marketing strategies. In this video, we discuss the importance of creating valuable content that resonates with your target audience. We cover various techniques including storytelling, data-driven insights, and engagement optimization. The key takeaway is that successful content marketing requires understanding your audience's pain points and providing solutions through compelling narratives.");
    setSelectedTypes(["youtube_description", "blog_post", "seo_tags", "social_posts"]);
    toast.success("Demo content loaded! Click Generate to see AI content creation in action.");
  };

  if (loading) {
    return <Loading message="Loading content generator..." />;
  }

  const renderInputArea = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="PenTool" className="w-5 h-5 text-primary-600" />
          <span>Content Input</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "text" 
                  ? "text-primary-600 border-b-2 border-primary-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("text")}
            >
              <ApperIcon name="Type" className="w-4 h-4 mr-2 inline" />
              Text Input
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "file" 
                  ? "text-primary-600 border-b-2 border-primary-600" 
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab("file")}
            >
              <ApperIcon name="Upload" className="w-4 h-4 mr-2 inline" />
              File Upload
            </button>
          </div>

          {activeTab === "text" ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                placeholder="Paste your video transcript, article, or any content you want to transform..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{inputText.length} characters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDemoGenerate}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <ApperIcon name="Play" className="w-4 h-4 mr-1" />
                  Load Demo Content
                </Button>
              </div>
            </div>
          ) : (
            <FileUpload
              onFileSelect={setSelectedFile}
              accept=".txt,.docx,.pdf,.srt,.vtt,.json"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderPresetSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ApperIcon name="Settings" className="w-5 h-5 text-primary-600" />
            <span>Content Presets</span>
          </div>
          <span className="text-sm text-gray-500 font-normal">
            {selectedPreset ? `Selected: ${selectedPreset.name}` : "Select a preset"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {presets.map((preset) => (
            <PresetCard
              key={preset.Id}
              preset={preset}
              isSelected={selectedPreset?.Id === preset.Id}
              onClick={() => setSelectedPreset(preset)}
              onEdit={() => {}} // Placeholder for edit functionality
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderContentTypeSelector = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ApperIcon name="CheckSquare" className="w-5 h-5 text-primary-600" />
          <span>Output Types</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ContentTypeSelector
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />
      </CardContent>
    </Card>
  );

  const renderGenerateSection = () => (
    <Card className="bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
            <ApperIcon name="Zap" className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Generate Content
            </h3>
            <p className="text-gray-600 mb-6">
              Transform your content into {selectedTypes.length} different formats using AI
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (!inputText.trim() && !selectedFile) || !selectedPreset}
              variant="gradient"
              size="lg"
              className="px-8"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <ApperIcon name="Sparkles" className="w-5 h-5 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
            
            {!isGenerating && Object.keys(generatedContent).length > 0 && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  setGeneratedContent({});
                  toast.info("Content cleared");
                }}
              >
                <ApperIcon name="RotateCcw" className="w-5 h-5 mr-2" />
                Clear Results
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderOutputPanels = () => {
    if (selectedTypes.length === 0) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <ApperIcon name="FileOutput" className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedTypes.map((type) => (
            <OutputPanel
              key={type}
              type={type}
              content={generatedContent[type]}
              isGenerating={isGenerating && !generatedContent[type]}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Content Generator
        </h1>
        <p className="text-lg text-gray-600">
          Transform any content into multiple formats with AI-powered generation
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {renderInputArea()}
          {renderPresetSelector()}
        </div>
        <div className="space-y-6">
          {renderContentTypeSelector()}
          {renderGenerateSection()}
        </div>
      </div>

      {/* Output Section */}
      {renderOutputPanels()}
    </div>
  );
};

export default ContentGenerator;