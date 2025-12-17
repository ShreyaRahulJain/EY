import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
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
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                RBI Compliant
              </span>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg p-4 inline-block mb-6">
          <span className="text-sm font-bold text-gray-800 uppercase">
            EY TECHATHON 6.0 SOLUTION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
              Instant Digital Loan Approvals with{" "}
              <span className="text-gray-700">AI Intelligence</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              OpenCred delivers enterprise-grade loan processing with AI-powered
              decisioning, OCR verification, and transparent explanations. Built
              for modern banking.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/apply")}
                className="px-8 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all"
              >
                Apply for Loan →
              </button>
              <button
                onClick={() => navigate("/manager")}
                className="px-8 py-3 border-2 border-gray-800 text-gray-800 font-semibold rounded-lg hover:bg-gray-800 hover:text-white transition-all"
              >
                Manager Dashboard
              </button>
            </div>
          </div>

          {/* Right - Status Card */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 bg-black text-white px-4 py-2 rounded-lg font-bold text-sm z-10">
              AI-POWERED
            </div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Application Status</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">APPROVED</h2>

              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="text-2xl font-bold text-gray-900">₹5,00,000</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Interest Rate</span>
                  <span className="text-xl font-bold text-gray-900">8.5% p.a.</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Monthly EMI</span>
                  <span className="text-xl font-bold text-gray-900">₹15,372</span>
                </div>
              </div>

              <div className="mt-6 bg-yellow-400 h-2 rounded-full"></div>
              <p className="text-sm text-gray-600 mt-2">Processing Complete</p>
            </div>
            <div className="absolute top-8 right-8 bg-yellow-400 rounded-lg p-4">
              <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why Choose OpenCred?
            </h2>
            <p className="text-gray-600">
              Enterprise-grade platform built for the future of digital lending
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-all">
              <div className="text-4xl font-bold text-yellow-400 mb-4">01</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Instant OCR Processing
              </h3>
              <p className="text-gray-600">
                Upload documents and get instant verification with AI-powered OCR
                technology for seamless KYC
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-all">
              <div className="text-4xl font-bold text-yellow-400 mb-4">02</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Multi-Agent AI
              </h3>
              <p className="text-gray-600">
                Advanced underwriting with specialized AI agents for KYC, credit
                scoring, and risk assessment
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-all">
              <div className="text-4xl font-bold text-yellow-400 mb-4">03</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-Time Tracking
              </h3>
              <p className="text-gray-600">
                Track your application status live with transparent progress updates
                at every stage
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-all">
              <div className="text-4xl font-bold text-yellow-400 mb-4">04</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Bank-Grade Security
              </h3>
              <p className="text-gray-600">
                RBI-compliant infrastructure with end-to-end encryption and
                comprehensive data protection
              </p>
            </div>

            {/* Feature 5 */}
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-all">
              <div className="text-4xl font-bold text-yellow-400 mb-4">05</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                AI Explainability
              </h3>
              <p className="text-gray-600">
                Get clear, human-friendly explanations for every loan decision with
                complete transparency
              </p>
            </div>

            {/* Feature 6 */}
            <div className="border-2 border-gray-200 rounded-lg p-8 hover:border-yellow-400 transition-all">
              <div className="text-4xl font-bold text-yellow-400 mb-4">06</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Audit Trail
              </h3>
              <p className="text-gray-600">
                Complete transparency with detailed audit logs and comprehensive
                compliance reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black rounded-2xl p-12 text-center border-4 border-yellow-400">
            <h2 className="text-3xl font-bold text-white mb-4">
              Trusted by Leading Financial Institutions
            </h2>
            <p className="text-gray-300 mb-8">
              AI-Assisted Decision Making • Human-Governed Approval • RBI Compliant
            </p>

            <div className="grid grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-yellow-400">99.8%</div>
                <div className="text-sm text-gray-300 mt-2">Accuracy Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400">&lt;2 min</div>
                <div className="text-sm text-gray-300 mt-2">Avg. Processing</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400">500K+</div>
                <div className="text-sm text-gray-300 mt-2">Loans Processed</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400">100%</div>
                <div className="text-sm text-gray-300 mt-2">Compliant</div>
              </div>
            </div>

            <button
              onClick={() => navigate("/apply")}
              className="px-12 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition-all text-lg"
            >
              START YOUR APPLICATION
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center font-bold">
                OC
              </div>
              <span className="font-semibold">OpenCred</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 OpenCred. Built for EY Techathon 6.0. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-yellow-400 transition-colors">
                Compliance
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;