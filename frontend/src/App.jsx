import React, { useState, useEffect } from "react";
import LoanForm from "./components/Loanform";
import Timeline from "./components/Timeline";
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
      setStatusData({ status: "processing", timeline: data.timeline, explanation: "Our AI agents are analyzing your file..." });
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
          console.log("=== POLLING DATA ===");
          console.log("Full data object:", JSON.stringify(data, null, 2));
          console.log("Status:", data.status);
          console.log("Explanation:", data.explanation);
          console.log("Timeline:", data.timeline);
          console.log("===================");
          setStatusData(data);
          
          // Stop polling if final state reached AND explanation is not placeholder
          const hasRealExplanation = data.explanation && 
                                     !data.explanation.includes("analyzing") && 
                                     !data.explanation.includes("Processing");
          
          if (["pre_approved", "rejected", "manual_review"].includes(data.status) && hasRealExplanation) {
            console.log("Stopping polling - final state reached");
            setLoading(false);
            clearInterval(intervalId);
          } else {
            console.log("⏳ Continue polling...");
          }
        } catch (error) {
          console.error("Polling error", error);
        }
      }, 1000); // Poll every 1 second for faster updates
    }

    return () => clearInterval(intervalId);
  }, [loanId]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <nav className="bg-yellow-400 p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-bold text-lg sm:text-xl flex items-center gap-2 text-black">
            <span className="bg-black text-white px-2 py-1 rounded">EY</span> 
            <span>Techathon 6.0</span>
          </div>
          <span className="text-xs sm:text-sm font-medium opacity-80">Intelligent Lending System</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start">
        
          {/* Left Column: Form */}
          <div className={`transition-all duration-500 ${loanId ? "opacity-50 pointer-events-none grayscale" : "opacity-100"}`}>
            <LoanForm onSubmit={handleLoanSubmit} isLoading={loading && !loanId} />
          </div>

          {/* Right Column: Status Display */}
          <div className="space-y-6">
            {!loanId ? (
              // Empty State
              <div className="h-full min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-slate-400">
                <div className="text-center">
                  <p className="mb-2 text-4xl">👋</p>
                  <p className="text-sm sm:text-base">Fill the form to start the AI Agents</p>
                </div>
              </div>
            ) : (
              // Active Status
              <div className="animate-slide-up">
                 {/* 1. Header of Status Panel */}
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Live Status</h2>
                    {loading && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full animate-pulse">
                        AGENTS WORKING...
                      </span>
                    )}
                 </div>

                 {/* 2. Timeline */}
                 {statusData && <Timeline events={statusData.timeline} />}

                 {/* 3. Final Result Card */}
                 {statusData && statusData.explanation && (
                   <ResultCard status={statusData.status} explanation={statusData.explanation} />
                 )}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;