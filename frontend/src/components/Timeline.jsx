import React from "react";

const TimelineItem = ({ step, detail, time, isLast }) => (
  <div className="relative pl-8 pb-8 last:pb-0">
    {/* Line connecting dots */}
    {!isLast && (
      <div className="absolute left-[11px] top-4 h-full w-[2px] bg-slate-200"></div>
    )}
    
    {/* The Dot */}
    <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-green-500 border-4 border-white shadow-sm flex items-center justify-center">
      <div className="h-2 w-2 bg-white rounded-full"></div>
    </div>

    {/* Content */}
    <div>
      <h4 className="font-bold text-slate-800 text-sm">{step}</h4>
      <p className="text-xs text-slate-500 mb-1">{detail}</p>
      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
        {new Date(time).toLocaleTimeString()}
      </span>
    </div>
  </div>
);

const Timeline = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="mt-4 sm:mt-6">
      <h3 className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3 sm:mb-4">
        Processing Timeline
      </h3>
      <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100">
        {events.map((event, index) => (
          <TimelineItem 
            key={index} 
            {...event} 
            isLast={index === events.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;