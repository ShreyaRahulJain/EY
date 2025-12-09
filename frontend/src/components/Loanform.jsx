import React, { useState } from "react";
import DocumentUpload from "./DocumentUpload";

const InputField = ({ label, id, type = "text", value, onChange, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-sm font-semibold text-slate-600">
      {label}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
      required
    />
  </div>
);

const LoanForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    pan: "",
    income: "",
    amount: "",
    purpose: "Home Renovation",
    document_name: "", // Will be set by file upload
  });
  const [uploadedDocument, setUploadedDocument] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDocumentUpload = (file) => {
    setUploadedDocument(file);
    setFormData({ ...formData, document_name: file.name });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!uploadedDocument) {
      alert("Please upload a document (PAN Card or Aadhaar)");
      return;
    }
    
    // Convert numbers before sending
    onSubmit({
      ...formData,
      income: parseFloat(formData.income),
      amount: parseFloat(formData.amount),
      document: uploadedDocument, // Send the actual file
    });
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">Apply for a Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <InputField id="name" label="Full Name" value={formData.name} onChange={handleChange} placeholder="e.g. Aditi Sharma" />
        <InputField id="pan" label="PAN Number" value={formData.pan} onChange={handleChange} placeholder="ABCDE1234F" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField id="income" type="number" label="Monthly Income (₹)" value={formData.income} onChange={handleChange} placeholder="50000" />
          <InputField id="amount" type="number" label="Loan Amount (₹)" value={formData.amount} onChange={handleChange} placeholder="500000" />
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-600">Purpose</label>
            <select id="purpose" value={formData.purpose} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none bg-white focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all">
                <option>Home Renovation</option>
                <option>Car Purchase</option>
                <option>Education</option>
                <option>Emergency</option>
            </select>
        </div>

        <DocumentUpload onUpload={handleDocumentUpload} isDisabled={isLoading} />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all text-sm sm:text-base ${
            isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-black hover:bg-slate-800"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default LoanForm;