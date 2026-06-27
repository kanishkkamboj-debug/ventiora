import React, { useState, useRef } from 'react';
import { Upload, X, FileImage, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/*",
  maxSizeMB = 5 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (selectedFile: File) => {
    setError(null);
    
    // Validate size
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setFile(selectedFile);
    
    // Create local preview
    if (selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Simulate upload progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          if (onFileSelect) onFileSelect(selectedFile);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
    setIsUploading(false);
    setUploadProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-border bg-surface-container-lowest hover:bg-surface-container-low'
          }`}
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors mb-3 ${
            dragActive ? 'bg-primary/20 text-primary' : 'bg-surface-container-low text-muted-text group-hover:text-primary'
          }`}>
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-label-md text-label-md font-semibold text-on-surface mb-1">
            {dragActive ? "Drop file here" : "Drag & drop an image"}
          </p>
          <p className="font-label-sm text-label-sm text-muted-text">
            or click to browse (Max {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-xl p-4 bg-surface-container-lowest">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 overflow-hidden">
              {previewUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-lg shrink-0 border border-border bg-surface-container-low flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-muted-text" />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md font-semibold text-on-surface truncate">
                  {file.name}
                </p>
                <p className="font-label-sm text-label-sm text-muted-text">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                
                {isUploading && (
                  <div className="mt-2 w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
                {isUploading && (
                  <p className="font-label-sm text-[10px] text-primary mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                  </p>
                )}
                {!isUploading && !error && (
                  <p className="font-label-sm text-[10px] text-green-600 dark:text-green-400 mt-1">
                    Upload complete (Simulated)
                  </p>
                )}
              </div>
            </div>
            
            <button 
              type="button"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="p-1.5 text-muted-text hover:bg-surface-container-low hover:text-error rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-error font-medium flex items-center gap-1">
          <X className="w-4 h-4" /> {error}
        </p>
      )}
    </div>
  );
}
