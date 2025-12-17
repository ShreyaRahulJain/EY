import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DocumentUpload from "./DocumentUpload";

const ApplicationForm = ({ onSubmit, isLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if coming from chatbot
  const urlParams = new URLSearchParams(location.search);
  const stepFromUrl = parseInt(urlParams.get('step')) || 1;
  const chatbotData = JSON.parse(sessionStorage.getItem('chatbotData') || '{}');
  
  console.log("ApplicationForm - URL params:", location.search);
  console.log("ApplicationForm - Step from URL:", stepFromUrl);
  console.log("ApplicationForm - Chatbot data:", chatbotData);
  
  const [currentStep, setCurrentStep] = useState(stepFromUrl);
  const [formData, setFormData] = useState({
    fullName: chatbotData.fullName || "",
    email: chatbotData.email || "",
    phone: chatbotData.phone || "",
    pan: chatbotData.pan || "",
    address: chatbotData.address || "",
    employmentType: chatbotData.employmentType || "Salaried",
    income: chatbotData.income || "",
    amount: chatbotData.amount || "",
    purpose: chatbotData.purpose || "Personal Loan",
    tenure: chatbotData.tenure ? `${chatbotData.tenure} Months` : "36 Months",
    agreeToTerms: stepFromUrl === 2 ? true : false, // Auto-agree if coming from chatbot
  });
  const [uploadedDocuments, setUploadedDocuments] = useState({
    pan: null,
    aadhaar: null,
    bankStatement: null,
    salarySlips: null,
  });

  // Clean up session storage when component unmounts
  useEffect(() => {
    return () => {
      if (stepFromUrl === 2) {
        sessionStorage.removeItem('chatbotData');
      }
    };
  }, [stepFromUrl]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleDocumentUpload = (docType, file) => {
    console.log(`Document uploaded: ${docType}`, file.name, `${(file.size / 1024).toFixed(2)} KB`);
    setUploadedDocuments({ ...uploadedDocuments, [docType]: file });
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate personal info
      if (
        !formData.fullName ||
        !formData.email ||
        !formData.phone ||
        !formData.pan ||
        !formData.address
      ) {
        alert("Please fill all required fields");
        return;
      }
      setCurrentStep(2);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      alert("Please agree to the Terms & Conditions");
      return;
    }

    if (!uploadedDocuments.pan || !uploadedDocuments.aadhaar) {
      alert("Please upload required documents (PAN and Aadhaar)");
      return;
    }

    // Prepare data for submission (for demo, we're just sending metadata)
    // Create a summary of all uploaded documents
    const documentSummary = [
      uploadedDocuments.pan ? `PAN: ${uploadedDocuments.pan.name}` : null,
      uploadedDocuments.aadhaar ? `Aadhaar: ${uploadedDocuments.aadhaar.name}` : null,
      uploadedDocuments.bankStatement ? `Bank Statement: ${uploadedDocuments.bankStatement.name}` : null,
      uploadedDocuments.salarySlips ? `Salary Slips: ${uploadedDocuments.salarySlips.name}` : null,
    ].filter(Boolean).join(", ");

    const submissionData = {
      name: formData.fullName,
      pan: formData.pan,
      income: parseFloat(formData.income),
      amount: parseFloat(formData.amount),
      purpose: formData.purpose,
      document_name: documentSummary || "Documents uploaded"
    };

    console.log("Submitting application with documents:", submissionData);
    console.log("Uploaded documents:", {
      pan: uploadedDocuments.pan?.name,
      aadhaar: uploadedDocuments.aadhaar?.name,
      bankStatement: uploadedDocuments.bankStatement?.name,
      salarySlips: uploadedDocuments.salarySlips?.name,
    });
    onSubmit(submissionData);
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Personal Info" },
      { number: 2, label: "Documents" },
      { number: 3, label: "Verification" },
      { number: 4, label: "Decision" },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                  currentStep >= step.number
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number}
              </div>
              <span className="text-xs mt-2 text-gray-600">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-24 mx-2 mb-6 ${
                  currentStep > step.number ? "bg-yellow-400" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-xl">
                OC
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">OpenCred</h1>
                <p className="text-xs text-gray-600">Digital Lending Platform</p>
              </div>
            </div>
            <span className="flex items-center gap-2 text-sm text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              RBI Compliant
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {currentStep < 3 && (
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg inline-block mb-6 font-bold text-sm">
            AI-POWERED OCR • INSTANT VERIFICATION
          </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentStep === 1 && "Personal Information"}
            {currentStep === 2 && "Document Upload & Verification"}
          </h1>
          <p className="text-gray-600">
            {currentStep === 1 && "Please provide your details to get started"}
            {currentStep === 2 && "Upload your documents for instant OCR processing"}
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-400">
                    PERSONAL INFORMATION
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        FULL NAME *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        EMAIL ADDRESS *
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PHONE NUMBER *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PAN NUMBER *
                      </label>
                      <input
                        id="pan"
                        type="text"
                        value={formData.pan}
                        onChange={handleChange}
                        placeholder="ABCDE1234F"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ADDRESS *
                      </label>
                      <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your complete address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-400">
                    EMPLOYMENT DETAILS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        EMPLOYMENT TYPE *
                      </label>
                      <select
                        id="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option>Salaried</option>
                        <option>Self-Employed</option>
                        <option>Business Owner</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        MONTHLY INCOME (₹) *
                      </label>
                      <input
                        id="income"
                        type="number"
                        value={formData.income}
                        onChange={handleChange}
                        placeholder="Enter your monthly income"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-400">
                    LOAN REQUIREMENTS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LOAN AMOUNT (₹) *
                      </label>
                      <input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter desired loan amount"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LOAN PURPOSE *
                      </label>
                      <select
                        id="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option>Personal Loan</option>
                        <option>Home Renovation</option>
                        <option>Car Purchase</option>
                        <option>Education</option>
                        <option>Emergency</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        TENURE (MONTHS) *
                      </label>
                      <select
                        id="tenure"
                        value={formData.tenure}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option>12 Months</option>
                        <option>24 Months</option>
                        <option>36 Months</option>
                        <option>48 Months</option>
                        <option>60 Months</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    id="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                    required
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="font-semibold text-black">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-semibold text-black">
                      Privacy Policy
                    </a>
                    . I authorize OpenCred to access my credit information and
                    verify my documents.
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all"
                >
                  PROCEED TO DOCUMENT UPLOAD →
                </button>
              </div>
            )}

            {/* Step 2: Document Upload */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PAN Card */}
                  <div className={`border-2 rounded-lg p-6 ${uploadedDocuments.pan ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">PAN Card</h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${uploadedDocuments.pan ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                        {uploadedDocuments.pan ? 'UPLOADED' : 'UPLOAD REQUIRED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">IDENTITY</p>
                    <DocumentUpload
                      onUpload={(file) => handleDocumentUpload("pan", file)}
                      isDisabled={isLoading}
                    />
                  </div>

                  {/* Aadhaar Card */}
                  <div className={`border-2 rounded-lg p-6 ${uploadedDocuments.aadhaar ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">Aadhaar Card</h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${uploadedDocuments.aadhaar ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                        {uploadedDocuments.aadhaar ? 'UPLOADED' : 'UPLOAD REQUIRED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">IDENTITY</p>
                    <DocumentUpload
                      onUpload={(file) => handleDocumentUpload("aadhaar", file)}
                      isDisabled={isLoading}
                    />
                  </div>

                  {/* Bank Statement */}
                  <div className={`border-2 rounded-lg p-6 ${uploadedDocuments.bankStatement ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">
                        Bank Statement (Last 3 months)
                      </h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${uploadedDocuments.bankStatement ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                        {uploadedDocuments.bankStatement ? 'UPLOADED' : 'UPLOAD REQUIRED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">FINANCIAL</p>
                    <DocumentUpload
                      onUpload={(file) => handleDocumentUpload("bankStatement", file)}
                      isDisabled={isLoading}
                    />
                  </div>

                  {/* Salary Slips */}
                  <div className={`border-2 rounded-lg p-6 ${uploadedDocuments.salarySlips ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">
                        Salary Slips (Last 3 months)
                      </h4>
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${uploadedDocuments.salarySlips ? 'bg-green-200 text-green-800' : 'bg-gray-100'}`}>
                        {uploadedDocuments.salarySlips ? 'UPLOADED' : 'UPLOAD REQUIRED'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">FINANCIAL</p>
                    <DocumentUpload
                      onUpload={(file) => handleDocumentUpload("salarySlips", file)}
                      isDisabled={isLoading}
                    />
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    All documents are encrypted and stored securely • OCR by Google
                    Cloud Vision
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                  >
                    ← BACK
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 py-4 font-bold rounded-lg transition-all ${
                      isLoading
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-yellow-400 text-black hover:bg-yellow-500"
                    }`}
                  >
                    {isLoading ? "PROCESSING..." : "PROCEED TO VERIFICATION →"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationForm;