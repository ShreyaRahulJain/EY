import React from "react";
import { generateLoanApprovalPDF } from "../utils/pdfGenerator";

const ResultCard = ({ status, explanation, data, onContactManager }) => {
  const isApproved = status === "approved"; // Only final approved, not pre_approved
  const isRejected = status === "rejected";
  const isProcessing = status === "processing";
  const isManualReview = status === "manual_review";
  const isPendingManager = status === "pending_manager_approval";
  
  console.log("ResultCard status:", status, "isPendingManager:", isPendingManager);

  // Mock detailed analysis data (in production, this would come from backend)
  const analysisFactors = [
    {
      name: "Credit Score",
      value: "785",
      weight: "35%",
      status: "positive",
      description: "Excellent credit history with consistent repayment patterns",
    },
    {
      name: "Income Stability",
      value: "High",
      weight: "30%",
      status: "positive",
      description: "Regular salary credits detected over 24+ months",
    },
    {
      name: "Debt-to-Income Ratio",
      value: "28%",
      weight: "20%",
      status: "positive",
      description: "Healthy ratio indicating good financial management",
    },
    {
      name: "Existing Loans",
      value: "2 Active",
      weight: "10%",
      status: "neutral",
      description: "Two loans with on-time payment history",
    },
    {
      name: "Banking Behavior",
      value: "Excellent",
      weight: "5%",
      status: "positive",
      description: "Consistent savings and no overdrafts",
    },
  ];

  const aiInsights = [
    "Your credit score of 785 places you in the 'Excellent' category, which significantly improved your approval chances.",
    "Consistent monthly income of ₹75,000 demonstrates strong repayment capability for the requested loan amount.",
    "Low debt-to-income ratio (28%) indicates you have sufficient financial capacity to manage this new loan.",
    "Your banking behavior shows disciplined financial management with regular savings patterns.",
  ];

  const recommendations = [
    {
      title: "Consider a shorter tenure",
      description: "Opting for 24 months could save you ₹12,450 in total interest",
    },
    {
      title: "Maintain your credit score",
      description: "Continue making timely payments to keep your excellent rating",
    },
    {
      title: "Set up auto-debit",
      description: "Ensure you never miss a payment and maintain your credit health",
    },
  ];

  if (isProcessing) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">⏳</span>
          <h3 className="text-xl font-bold text-blue-900">Processing Application</h3>
        </div>
        <p className="text-sm text-blue-800 leading-relaxed">
          Our team is analyzing your application...
        </p>
      </div>
    );
  }

  if (isPendingManager) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">👨‍💼</span>
          <h3 className="text-xl font-bold text-yellow-900">Pending Manager Review</h3>
        </div>
        <p className="text-sm text-yellow-800 leading-relaxed mb-4">
          {explanation || "Your application has been processed and is now under manager review for final approval."}
        </p>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Our manager will review your application within 24 hours</li>
            <li>• You'll receive an email notification once the decision is made</li>
            <li>• No further action is required from your side</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Decision Card */}
      <div
        className={`rounded-2xl border-4 p-8 ${
          isApproved
            ? "bg-green-50 border-green-400"
            : isRejected
            ? "bg-red-50 border-red-300"
            : isPendingManager
            ? "bg-yellow-50 border-yellow-400"
            : "bg-blue-50 border-blue-300"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-400 rounded-xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-black"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {isApproved ? "CONGRATULATIONS!" : 
                 isRejected ? "APPLICATION REJECTED" : 
                 isPendingManager ? "PENDING MANAGER REVIEW" :
                 "MANUAL REVIEW REQUIRED"}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {isApproved ? "Your loan application has been approved" : 
                 isRejected ? "We regret to inform you that your application was not approved" :
                 isPendingManager ? "Your application is under manager review" :
                 "Additional review is required"}
              </p>
              {/* Amount moved below description */}
              <div className="text-right">
                <div className="text-4xl font-bold text-gray-900">
                  ₹{data?.amount ? Number(data.amount).toLocaleString() : "0"}
                </div>
                <div className="text-sm text-gray-600">
                  {isPendingManager ? "Requested Amount" : 
                   isApproved ? "Approved Amount" : 
                   "Loan Amount"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status-specific content */}
        {isPendingManager && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="text-lg">⏳</span>
              <span className="font-semibold">Awaiting manager approval within 24 hours</span>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <span className="text-lg">📄</span>
                <span className="font-semibold">Sanction letter has been generated and emailed to you</span>
              </div>
            </div>
            
            {/* Download Certificate Button */}
            <button
              onClick={() => {
                const approvalDetails = {
                  loanId: data?.loanId || `OC${Date.now()}`,
                  approvalDate: new Date().toLocaleDateString('en-IN'),
                  approvedBy: 'OpenCred Loan Officer'
                };
                generateLoanApprovalPDF(data, approvalDetails);
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2"
            >
              <span className="text-lg">📋</span>
              Download Loan Approval Certificate
            </button>
          </div>
        )}

        {/* Contact Manager Button for Manual Review */}
        {isManualReview && (
          <div className="mt-6 space-y-3">
            <button 
              onClick={onContactManager}
              className="w-full py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
            >
              <span>💬</span>
              CONNECT WITH LOAN MANAGER
            </button>
            <p className="text-xs text-center text-gray-600">
              A loan manager will review your case and respond within 24 hours
            </p>
          </div>
        )}
      </div>

      {/* AI Analysis & Explanation */}
      {explanation && !isProcessing && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">AI Analysis</h3>
              <p className="text-sm text-gray-600">Powered by advanced machine learning</p>
            </div>
          </div>

          {/* Enhanced loan metrics with visual indicators */}
          {data && (
            <div className="space-y-6 mb-6">
              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-blue-700">Monthly Income</h4>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">₹{Number(data.income || 0).toLocaleString()}</p>
                  <div className="mt-2 text-xs text-blue-600">Verified via bank statements</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-green-700">Loan Amount</h4>
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">🎯</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-green-900">₹{Number(data.amount || 0).toLocaleString()}</p>
                  <div className="mt-2 text-xs text-green-600">Requested amount</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-purple-700">Affordability Score</h4>
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {data.income && data.amount ? Math.min(100, (Number(data.income) / (Number(data.amount) / 36) * 100)).toFixed(0) : 0}%
                  </p>
                  <div className="mt-2 text-xs text-purple-600">Income vs EMI ratio</div>
                </div>
              </div>

              {/* Visual Analysis Charts */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Risk Assessment Breakdown</h4>
                
                <div className="space-y-4">
                  {/* Credit Score Simulation */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Credit Profile</span>
                      <span className="text-sm font-bold text-green-600">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full" style={{width: '85%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Score: 785/900</div>
                  </div>

                  {/* Income Stability */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Income Stability</span>
                      <span className="text-sm font-bold text-blue-600">Stable</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">24+ months consistent salary</div>
                  </div>

                  {/* Debt-to-Income */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Debt-to-Income Ratio</span>
                      <span className="text-sm font-bold text-green-600">Low Risk</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full" style={{width: '32%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">32% of monthly income</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Detailed Analysis */}
      {false && isApproved && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg inline-block mb-6 font-bold text-sm">
            AI-POWERED EXPLANATION • POWERED BY GOOGLE GEMINI
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Your Loan Decision Explained
          </h3>
          <p className="text-gray-600 mb-8">
            Transparent, human-friendly insights into how we reached your decision
          </p>

          {/* Key Factors Analyzed */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-400">
              KEY FACTORS ANALYZED
            </h4>
            <div className="space-y-4">
              {analysisFactors.map((factor, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      factor.status === "positive"
                        ? "bg-green-100 text-green-600"
                        : factor.status === "neutral"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {factor.status === "positive" ? "+" : factor.status === "neutral" ? "=" : "-"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-gray-900">{factor.name}</h5>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">
                          {factor.value}
                        </span>
                        <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">
                          {factor.weight} WEIGHT
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{factor.description}</p>
                    <div className="mt-2 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          factor.status === "positive"
                            ? "bg-green-500"
                            : factor.status === "neutral"
                            ? "bg-gray-400"
                            : "bg-red-500"
                        }`}
                        style={{ width: factor.weight }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights and Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-400">
                AI INSIGHTS
              </h4>
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded flex items-center justify-center flex-shrink-0 text-black font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-yellow-400">
                RECOMMENDATIONS
              </h4>
              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-lg">→</span>
                      <h5 className="font-bold text-gray-900">{rec.title}</h5>
                    </div>
                    <p className="text-sm text-gray-700 ml-7">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transparency Notice */}
          <div className="mt-8 border-t-2 border-gray-200 pt-6">
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              HOW WE ENSURE TRANSPARENT AI DECISIONS
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Our multi-agent AI system evaluates your application using explainable
              machine learning models. Every decision factor is weighted, documented,
              and available for audit. This explanation is generated by Google Gemini
              to ensure you understand exactly how we reached this decision.
            </p>
            <div className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                AI-ASSISTED
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                HUMAN-GOVERNED
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                FULLY AUDITABLE
              </span>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-6">
            <button className="w-full py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all">
              VIEW FINAL OFFER →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;