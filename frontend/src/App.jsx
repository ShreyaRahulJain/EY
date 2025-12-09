import React, { useState, useEffect } from "react";
import LoanForm from "./components/Loanform";
import LiveStatus from "./components/LiveStatus";
import ResultCard from "./components/ResultCard";
import { submitLoanApplication, checkLoanStatus } from "./api";

function App() {
  const [loanId, setLoanId] = useState(null);
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Submit Handler
  const handleLoanSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await submitLoanApplication(formData);
      console.log("Initial submission response:", data);
      setLoanId(data.loan_id);
      // Initialize status immediately
      setStatusData({ status: "processing", timeline: data.timeline, explanation: "Our AI agents are analyzing your file...", data: formData });
    } catch (error) {
      alert("Error submitting loan. Is Backend running?");
      setLoading(false);
    }
  };

  // 2. Polling Logic (The heartbeat of the app)
  useEffect(() => {
    let intervalId;

    if (loanId) {
      intervalId = setInterval(async () => {
        try {
          const data = await checkLoanStatus(loanId);
          setStatusData(data);
          
          // Stop polling if final state reached AND explanation is not placeholder
          const hasRealExplanation = data.explanation && 
                                     !data.explanation.includes("analyzing") && 
                                     !data.explanation.includes("Processing");
          
          if (["pre_approved", "rejected", "manual_review"].includes(data.status) && hasRealExplanation) {
            setLoading(false);
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      }, 1000); // Poll every 1 second for faster updates
    }

    return () => clearInterval(intervalId);
  }, [loanId]);

  // Convert timeline to live status steps
  const getStatusSteps = () => {
    if (!statusData || !statusData.timeline) return [];
    
    return statusData.timeline.map((event, index) => {
      const isLast = index === statusData.timeline.length - 1;
      return {
        icon: getStepIcon(event.step),
        title: event.step,
        description: event.detail,
        status: isLast && loading ? 'processing' : 'completed'
      };
    });
  };

  const getStepIcon = (step) => {
    if (step.includes("Submitted")) return "📝";
    if (step.includes("Document") || step.includes("Received")) return "📄";
    if (step.includes("OCR")) return "🔍";
    if (step.includes("PAN")) return "🆔";
    if (step.includes("KYC")) return "✓";
    if (step.includes("Underwriting")) return "📊";
    if (step.includes("AI")) return "🤖";
    return "•";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-lg">
                EY
              </div>
              <div>
                <h1 className="font-bold text-lg text-slate-800">Intelligent Lending</h1>
                <p className="text-xs text-slate-500">Powered by AI Agents</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Secure & Encrypted
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loanId ? (
          // Application Form View
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Apply for a Loan</h2>
              <p className="text-slate-600">Get instant approval with our AI-powered system</p>
            </div>
            <LoanForm onSubmit={handleLoanSubmit} isLoading={loading} />
          </div>
        ) : (
          // Status Tracking View
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Application Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
                  Application Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Applicant Name</p>
                    <p className="font-semibold text-slate-800">{statusData?.data?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Loan Amount</p>
                    <p className="font-semibold text-slate-800">₹{statusData?.data?.amount?.toLocaleString() || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Purpose</p>
                    <p className="font-semibold text-slate-800">{statusData?.data?.purpose || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly Income</p>
                    <p className="font-semibold text-slate-800">₹{statusData?.data?.income?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Result Card */}
              {statusData && statusData.explanation && (
                <ResultCard status={statusData.status} explanation={statusData.explanation} />
              )}
            </div>

            {/* Right: Live Status */}
            <div className="lg:col-span-3">
              <LiveStatus steps={getStatusSteps()} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
