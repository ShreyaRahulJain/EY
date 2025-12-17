import React from "react";
import { useNavigate } from "react-router-dom";

const ApplicationChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-xl">
                OC
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">OpenCred</h1>
                <p className="text-xs text-gray-600">Digital Lending Platform</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg inline-block mb-6 font-bold text-sm">
            CHOOSE YOUR APPLICATION METHOD
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How would you like to apply?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the method that works best for you. Both options provide the same secure, fast loan processing.
          </p>
        </div>

        {/* Two Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Option 1: Chatbot Assistant */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-all relative overflow-hidden">
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🤖</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                AI Chatbot Assistant
              </h2>
              <p className="text-sm text-gray-600">
                Guided conversation-based application
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Easy & Interactive</p>
                  <p className="text-sm text-gray-600">
                    AI guides you step-by-step through questions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ask Questions Anytime</p>
                  <p className="text-sm text-gray-600">
                    Clarify doubts about any information requested
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Natural Conversation</p>
                  <p className="text-sm text-gray-600">
                    Talk to AI like a human loan officer
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Perfect for First-Time Users</p>
                  <p className="text-sm text-gray-600">
                    No prior loan application experience needed
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/apply/chatbot")}
              className="w-full py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all text-lg"
            >
              START WITH AI ASSISTANT →
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Estimated time: 5-7 minutes
            </p>
          </div>

          {/* Option 2: Manual Form */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-all">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Manual Form Upload
              </h2>
              <p className="text-sm text-gray-600">
                Traditional form-based application
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Direct Form Filling</p>
                  <p className="text-sm text-gray-600">
                    Fill all fields at once if you have everything ready
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Faster for Experienced Users</p>
                  <p className="text-sm text-gray-600">
                    Skip the conversation, go straight to form
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">See All Requirements</p>
                  <p className="text-sm text-gray-600">
                    View all required fields and documents upfront
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Traditional Experience</p>
                  <p className="text-sm text-gray-600">
                    Familiar form-based application process
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/apply/manual")}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all text-lg"
            >
              USE MANUAL FORM →
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Estimated time: 8-10 minutes
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="max-w-4xl mx-auto mt-12 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Both methods are equally secure and fast</h3>
              <p className="text-sm text-gray-700">
                Whether you choose the AI chatbot or manual form, your application goes through the same
                rigorous verification process. Both options use bank-grade encryption and are RBI compliant.
                The chatbot is recommended for first-time users as it provides guidance and answers questions
                in real-time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationChoice;

