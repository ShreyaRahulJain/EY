import React, { useState } from "react";

const DocumentUpload = ({ onUpload, isDisabled }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    // Only accept images and PDFs
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid document (JPG, PNG, or PDF)');
      return;
    }

    setUploadedFile(file);
    onUpload(file);
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-600">
        Upload Document (PAN Card / Aadhaar)
      </label>
      
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragActive 
            ? 'border-yellow-400 bg-yellow-50' 
            : uploadedFile
            ? 'border-green-400 bg-green-50'
            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
        } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          accept="image/*,.pdf"
          disabled={isDisabled}
        />
        
        <label htmlFor="file-upload" className="cursor-pointer">
          {uploadedFile ? (
            <div className="space-y-2">
              <div className="text-3xl">✅</div>
              <p className="text-sm font-medium text-green-700">{uploadedFile.name}</p>
              <p className="text-xs text-green-600">Document uploaded successfully</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-3xl">📄</div>
              <p className="text-sm font-medium text-slate-700">
                Drop your document here or click to browse
              </p>
              <p className="text-xs text-slate-500">Supports: JPG, PNG, PDF (Max 5MB)</p>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default DocumentUpload;

