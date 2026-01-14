
import React from 'react';

interface LoadingStateProps {
  status: 'extracting' | 'fetching_data' | 'reasoning';
}

export const LoadingState: React.FC<LoadingStateProps> = ({ status }) => {
  const steps = [
    { id: 'extracting', label: 'Extracting Supplier Event', active: status === 'extracting', done: status === 'fetching_data' || status === 'reasoning' },
    { id: 'fetching_data', label: 'Fetching Operational Memory', active: status === 'fetching_data', done: status === 'reasoning' },
    { id: 'reasoning', label: 'Agent Reasoning & Decisioning', active: status === 'reasoning', done: false },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in fade-in duration-500">
      <div className="relative">
        <div className="w-24 h-24 border-4 border-slate-800 rounded-full"></div>
        <div className="absolute top-0 w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-10 h-10 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <div className="w-full max-w-sm space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-900/50 border border-slate-800 transition-all duration-500">
            {step.done ? (
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ) : step.active ? (
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-slate-700"></div>
            )}
            <span className={`text-sm font-medium ${step.active ? 'text-blue-400' : step.done ? 'text-slate-400' : 'text-slate-600'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
