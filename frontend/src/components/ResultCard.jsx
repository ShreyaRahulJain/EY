import React from "react";

const ResultCard = ({ status, explanation, data }) => {
  const isApproved = status === "pre_approved";
  const isRejected = status === "rejected";
  const isProcessing = status === "processing";

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
          Our AI agents are analyzing your application...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Decision Card */}
      <div
        className={`rounded-2xl border-4 p-8 ${
          isApproved
            ? "bg-black border-yellow-400"
            : isRejected
            ? "bg-red-50 border-red-300"
            : "bg-yellow-50 border-yellow-300"
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
            <div>
              <h3
                className={`text-2xl font-bold ${
                  isApproved ? "text-white" : "text-gray-900"
                }`}
              >
                {isApproved ? "CONGRATULATIONS!" : isRejected ? "APPLICATION REJECTED" : "MANUAL REVIEW REQUIRED"}
              </h3>
              <p
                className={`text-sm ${
                  isApproved ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {isApproved ? "Your loan application has been approved" : ""}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-4xl font-bold ${
                isApproved ? "text-yellow-400" : "text-gray-900"
              }`}
            >
              ₹5,00,000
            </div>
            <div
              className={`text-sm ${
                isApproved ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Approved Amount
            </div>
          </div>
        </div>

        {isApproved && (
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-700">
            <div>
              <p className="text-sm text-gray-300 mb-1">Interest Rate</p>
              <p className="text-2xl font-bold text-white">8.5% p.a.</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Monthly EMI</p>
              <p className="text-2xl font-bold text-white">₹15,372</p>
            </div>
            <div>
              <p className="text-sm text-gray-300 mb-1">Tenure</p>
              <p className="text-2xl font-bold text-white">36 months</p>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="mt-6 p-4 bg-yellow-400 rounded-lg text-black font-semibold text-sm flex items-center gap-2">
            📄 A Sanction Letter has been generated and emailed to you.
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      {isApproved && (
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