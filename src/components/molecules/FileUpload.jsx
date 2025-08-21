import React, { useState, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";

const FileUpload = ({ onFileSelect, accept = ".txt,.docx,.pdf,.srt,.vtt,.json" }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const allowedTypes = accept.split(",").map(type => type.trim());

  const validateFile = (file) => {
    const fileExtension = "." + file.name.split(".").pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`File type not supported. Please select: ${allowedTypes.join(", ")}`);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFileSelect = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
      toast.success(`File "${file.name}" selected successfully`);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          isDragOver 
            ? "border-primary-500 bg-primary-50" 
            : selectedFile
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            selectedFile 
              ? "bg-green-100" 
              : isDragOver 
                ? "bg-primary-100" 
                : "bg-gray-100"
          )}>
            <ApperIcon 
              name={selectedFile ? "CheckCircle" : isDragOver ? "Upload" : "FileText"} 
              className={cn(
                "w-8 h-8",
                selectedFile 
                  ? "text-green-600" 
                  : isDragOver 
                    ? "text-primary-600" 
                    : "text-gray-500"
              )}
            />
          </div>
          
          {selectedFile ? (
            <div className="text-center">
              <h3 className="font-medium text-green-900 mb-1">
                File Selected
              </h3>
              <p className="text-green-700 font-medium">
                {selectedFile.name}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h3 className="font-medium text-gray-900 mb-2">
                {isDragOver ? "Drop your file here" : "Upload a file"}
              </h3>
              <p className="text-gray-600 mb-4">
                Drag and drop or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                {allowedTypes.map((type) => (
                  <span key={type} className="bg-gray-100 px-2 py-1 rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedFile && (
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="File" className="w-4 h-4" />
            <span>Ready to process</span>
          </div>
          <Button variant="ghost" size="sm" onClick={clearFile}>
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;