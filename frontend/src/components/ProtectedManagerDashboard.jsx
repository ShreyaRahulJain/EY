import React, { useState } from "react";
import ManagerLogin from "./ManagerLogin";
import ManagerDashboard from "./ManagerDashboard";

const ProtectedManagerDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  console.log("ProtectedManagerDashboard rendered, isAuthenticated:", isAuthenticated);

  const handleLogin = (success) => {
    if (success) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h1>Manager Login Required</h1>
        <ManagerLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div>
      {/* Add logout button to the dashboard */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
        >
          🔓 Logout
        </button>
      </div>
      <ManagerDashboard />
    </div>
  );
};

export default ProtectedManagerDashboard;
