
import React from 'react';

export const DashboardHeader: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">SUPPLY-SHIELD</h1>
          <p className="text-slate-400 text-sm">Autonomous Supplier Risk Analysis & Decision Agent</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 rounded-full border border-slate-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs font-medium text-slate-300">Operational Memory Linked</span>
      </div>
    </header>
  );
};
