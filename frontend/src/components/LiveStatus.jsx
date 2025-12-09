import React from "react";

const StatusStep = ({ icon, title, description, status, isLast }) => {
  // status can be: 'pending', 'processing', 'completed', 'error'
  
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500 animate-pulse';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-300';
    }
  };

  const getIconBg = () => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'processing': return 'bg-blue-100 text-blue-600';
      case 'error': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-400';
    }
  };

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Vertical line */}
      {!isLast && (
        <div className={`absolute left-6 top-12 w-0.5 h-full ${
          status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
        }`}></div>
      )}
      
      {/* Icon circle */}
      <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${getIconBg()}`}>
        {status === 'completed' ? '✓' : status === 'processing' ? '⏳' : icon}
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-2">
        <h4 className="font-semibold text-slate-800 text-base">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{description}</p>
        
        {status === 'processing' && (
          <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-ping"></div>
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};

const LiveStatus = ({ currentStep, steps }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Application Status</h3>
        <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
          LIVE
        </div>
      </div>
      
      <div className="space-y-0">
        {steps.map((step, index) => (
          <StatusStep
            key={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
            status={step.status}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveStatus;

