import React from "react";

const ResultCard = ({ status, explanation }) => {
  const isApproved = status === "pre_approved";
  const isRejected = status === "rejected";
  const isProcessing = status === "processing";
  
  // Dynamic Styles based on status
  const containerClass = isApproved
    ? "bg-green-50 border-green-200 text-green-900"
    : isRejected
    ? "bg-red-50 border-red-200 text-red-900"
    : isProcessing
    ? "bg-blue-50 border-blue-200 text-blue-900"
    : "bg-yellow-50 border-yellow-200 text-yellow-900"; // Manual Review

  const title = isApproved 
    ? "Loan Pre-Approved" 
    : isRejected 
    ? "Application Rejected" 
    : isProcessing
    ? "Processing Application"
    : "Manual Review Required";

  const icon = isApproved 
    ? "🎉" 
    : isRejected 
    ? "❌" 
    : isProcessing
    ? "⏳"
    : "⚠️";

  return (
    <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl border ${containerClass} shadow-sm animate-fade-in`}>
      <div className="flex items-center gap-3 mb-3">
        {/* Status Icon */}
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
      </div>
      <p className="text-sm sm:text-base leading-relaxed opacity-90 font-medium">
        {explanation}
      </p>
      
      {isApproved && (
         <div className="mt-4 p-3 bg-white/50 rounded-lg text-xs sm:text-sm font-mono text-green-800 border border-green-100">
            📄 A Sanction Letter has been generated and emailed to you.
         </div>
      )}
    </div>
  );
};

export default ResultCard;