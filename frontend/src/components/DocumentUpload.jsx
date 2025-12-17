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
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid document (JPG, PNG, or PDF)");
      return;
    }

    // Check file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadedFile(file);
    onUpload(file);
  };

  const inputId = React.useId();

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        dragActive
          ? "border-yellow-400 bg-yellow-50"
          : uploadedFile
          ? "border-green-400 bg-green-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id={inputId}
        className="hidden"
        onChange={handleChange}
        accept="image/*,.pdf"
        disabled={isDisabled}
      />

      <label
        htmlFor={inputId}
        className="cursor-pointer block"
      >
        {uploadedFile ? (
          <div className="space-y-3">
            <div className="text-4xl">✅</div>
            <p className="text-sm font-semibold text-green-700">
              {uploadedFile.name}
            </p>
            <p className="text-xs text-green-600">
              {(uploadedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-5xl">↑</div>
            <p className="text-sm font-semibold text-gray-700">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, JPG, PNG (Max 5MB)
            </p>
          </div>
        )}
      </label>
    </div>
  );
};

export default DocumentUpload;