import React, { useState } from "react";

const ManagerLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  
  console.log("ManagerLogin rendered");

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Accept any credentials for demo purposes
    setTimeout(() => {
      if (credentials.username.trim() && credentials.password.trim()) {
        onLogin(true);
      } else {
        alert("Please enter both username and password");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-black rounded-lg flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center font-bold text-xl text-black">
              OC
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Manager Access</h2>
          <p className="mt-2 text-sm text-gray-600">
            Secure login required for loan management dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Manager ID
              </label>
              <input
                id="username"
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your manager ID"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                "Access Dashboard"
              )}
            </button>
          </form>

          {/* Demo Notice */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              🎭 Demo Mode - Any credentials accepted for testing
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              In production: Integrated with company SSO/Active Directory
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-blue-500 text-lg">🔒</span>
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">Security Features</h4>
              <ul className="text-xs text-blue-800 mt-1 space-y-1">
                <li>• Multi-factor authentication</li>
                <li>• Session timeout protection</li>
                <li>• Audit trail logging</li>
                <li>• Role-based access control</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerLogin;
