import React, { useState, useEffect } from "react";

const ManagerDashboard = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch pending applications from API
  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      console.log("Fetching pending applications...");
      const response = await fetch("http://localhost:8000/manager/pending");
      const data = await response.json();
      console.log("Received data:", data);
      setPendingApplications(data.pending_loans || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pending applications:", error);
      setPendingApplications([]);
      setLoading(false);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      const response = await fetch("http://localhost:8000/manager/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loan_id: loanId,
          decision: "approved",
          comments: "Application meets all criteria. Approved by manager."
        }),
      });

      if (response.ok) {
        setPendingApplications(pendingApplications.filter((app) => app.loan_id !== loanId));
        alert(`Loan ${loanId} APPROVED by manager`);
        setShowDetails(false);
      } else {
        throw new Error("Failed to approve loan");
      }
    } catch (error) {
      console.error("Error approving loan:", error);
      alert("Error approving loan");
    }
  };

  const handleReject = async (loanId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      const response = await fetch("http://localhost:8000/manager/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loan_id: loanId,
          decision: "rejected",
          comments: reason
        }),
      });

      if (response.ok) {
        setPendingApplications(pendingApplications.filter((app) => app.loan_id !== loanId));
        alert(`Loan ${loanId} REJECTED by manager`);
        setShowDetails(false);
      } else {
        throw new Error("Failed to reject loan");
      }
    } catch (error) {
      console.error("Error rejecting loan:", error);
      alert("Error rejecting loan");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-black text-white border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-xl text-black">
                OC
              </div>
              <div>
                <h1 className="font-bold text-xl">Manager Dashboard</h1>
                <p className="text-xs text-gray-400">Loan Review & Approval</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span>{pendingApplications.length} Pending Reviews</span>
              </div>
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-bold text-black">
                M
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pending Applications</h2>
            <p className="text-gray-600">
              Review AI-generated sanction letters and approve/reject applications
            </p>
          </div>
          <button
            onClick={fetchPendingApplications}
            disabled={loading}
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-500 transition-all disabled:opacity-50"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Applications...</h3>
            <p className="text-gray-600">Fetching pending reviews from the system.</p>
          </div>
        ) : pendingApplications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
            <p className="text-gray-600">No pending applications to review at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingApplications.map((app) => (
              <div
                key={app.loan_id}
                className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 hover:border-yellow-400 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {app.data.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Application ID: {app.loan_id.slice(0, 8)}...
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted: {formatDate(app.submitted_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ₹{app.data.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{app.data.purpose}</div>
                    </div>
                  </div>

                  {/* AI Suggestion */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🤖</span>
                        <h4 className="font-bold text-gray-900">AI Suggestion</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            app.ai_suggestion === "APPROVED"
                              ? "bg-green-200 text-green-800"
                              : "bg-red-200 text-red-800"
                          }`}
                        >
                          {app.ai_suggestion}
                        </span>
                        <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                          {app.ai_confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{app.ai_explanation}</p>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Monthly Income</p>
                      <p className="font-bold text-gray-900">
                        ₹{app.data.income.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Loan Amount</p>
                      <p className="font-bold text-gray-900">
                        ₹{app.data.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Debt Ratio</p>
                      <p className="font-bold text-gray-900">
                        {(app.data.amount / app.data.income).toFixed(2)}x
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowDetails(true);
                      }}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
                    >
                      VIEW DETAILS
                    </button>
                    <button
                      onClick={() => handleReject(app.loan_id)}
                      className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                    >
                      ✕ REJECT
                    </button>
                    <button
                      onClick={() => handleApprove(app.loan_id)}
                      className="flex-1 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all"
                    >
                      ✓ APPROVE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-yellow-400 text-black p-6 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl">Application Details</h3>
                <p className="text-sm">
                  ID: {selectedApplication.loan_id.slice(0, 16)}...
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="w-10 h-10 bg-black text-white rounded-lg hover:bg-gray-800 transition-all font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Applicant Info */}
              <div>
                <h4 className="font-bold text-lg mb-4 pb-2 border-b-2 border-yellow-400">
                  APPLICANT INFORMATION
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold">{selectedApplication.data.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PAN Number</p>
                    <p className="font-semibold">{selectedApplication.data.pan}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Income</p>
                    <p className="font-semibold">
                      ₹{selectedApplication.data.income.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-semibold">
                      ₹{selectedApplication.data.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              <div>
                <h4 className="font-bold text-lg mb-4 pb-2 border-b-2 border-yellow-400">
                  AI ANALYSIS & RECOMMENDATION
                </h4>
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-gray-900">AI Recommendation:</span>
                    <span
                      className={`px-4 py-2 rounded-lg font-bold ${
                        selectedApplication.ai_suggestion === "APPROVED"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {selectedApplication.ai_suggestion}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{selectedApplication.ai_explanation}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Confidence Level:</span>
                    <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full"
                        style={{ width: `${selectedApplication.ai_confidence}%` }}
                      ></div>
                    </div>
                    <span className="font-bold">{selectedApplication.ai_confidence}%</span>
                  </div>
                </div>
              </div>

              {/* Manager Decision */}
              <div>
                <h4 className="font-bold text-lg mb-4 pb-2 border-b-2 border-yellow-400">
                  MANAGER DECISION
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  As the loan manager, you have the final authority to approve or reject this
                  application. The AI suggestion is advisory only.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleReject(selectedApplication.loan_id)}
                    className="flex-1 py-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                  >
                    ✕ REJECT APPLICATION
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApplication.loan_id)}
                    className="flex-1 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all"
                  >
                    ✓ APPROVE APPLICATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;

