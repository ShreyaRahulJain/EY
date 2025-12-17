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
          <div className="mt-3">
            {/* Processing details */}
            <div className="text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI analysis complete</span>
              </div>
            </div>
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

      {/* Contact section after AI analysis */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">💬</span>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 text-base mb-2">Need Further Discussion?</h4>
              <p className="text-sm text-blue-700 mb-4">
                Our AI has completed the analysis. If you have questions or want to discuss your application further, feel free to reach out.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <span className="font-medium">📞 Call:</span>
                  <span>+91-9876543210</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <span className="font-medium">📧 Email:</span>
                  <span>support@opencred.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-800">
                  <span className="font-medium">💬 Chat:</span>
                  <button className="text-blue-600 underline hover:text-blue-800">
                    Start Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatus;