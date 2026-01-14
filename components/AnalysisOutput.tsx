
import React from 'react';
import { MistralDecision, SupplierEvent } from '../types';

interface AnalysisOutputProps {
  decision: MistralDecision;
  event: SupplierEvent;
  onBack: () => void;
}

export const AnalysisOutput: React.FC<AnalysisOutputProps> = ({ decision, event, onBack }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700">
      {/* Risk Summary Header */}
      <div className={`border rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 ${getRiskColor(decision.risk_level)}`}>
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-current bg-white/5">
            <span className="text-xl font-black">{decision.risk_level}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-wider">Operational Risk Level</h2>
            <p className="opacity-80">System Confidence: {(decision.confidence_score * 100).toFixed(1)}%</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-70 uppercase font-bold">Primary Reason</p>
          <p className="text-xl font-semibold max-w-md">{decision.primary_reason}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Action (Main) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl ring-1 ring-blue-500/20">
          <div>
            <span className="inline-block px-3 py-1 bg-blue-600/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase mb-4">
              Strategic Directive
            </span>
            <h3 className="text-3xl font-bold text-white leading-tight">
              {decision.recommended_action}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Buffer Stock Health</p>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-mono text-blue-400">{decision.buffer_stock_hours}h</span>
                <span className="text-xs text-slate-500 mb-1">remaining</span>
              </div>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase mb-1">Expected Recovery</p>
              <div className="flex items-end space-x-2">
                <span className="text-2xl font-mono text-purple-400">{event.delay_hours || 'N/A'}h</span>
                <span className="text-xs text-slate-500 mb-1">delay duration</span>
              </div>
            </div>
          </div>

          {/* Alternate Suggestion */}
          <div className="p-6 bg-blue-900/10 border border-blue-500/30 rounded-xl space-y-3">
             <div className="flex items-center space-x-2">
               <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
               </svg>
               <h4 className="font-bold text-blue-300">Alternate Supply Recommendation</h4>
             </div>
             <div>
               <p className="text-lg font-bold text-white">{decision.alternate_supplier_suggestion.supplier_name}</p>
               <p className="text-sm text-slate-400 mt-1">{decision.alternate_supplier_suggestion.reason}</p>
             </div>
          </div>
        </div>

        {/* Financial & Impact Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
             <h4 className="text-sm font-bold text-slate-500 uppercase mb-6 border-b border-slate-800 pb-2">Impact Assessment</h4>
             <div className="space-y-6">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-slate-400 text-sm">Estimated Loss</p>
                   <p className="text-3xl font-bold text-white mt-1">₹{decision.estimated_financial_loss.toLocaleString()}</p>
                 </div>
                 <div className="w-10 h-10 bg-red-900/20 rounded-lg flex items-center justify-center">
                   <span className="text-red-400 font-bold">₹</span>
                 </div>
               </div>

               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-slate-400 text-sm">Line Stop Forecast</p>
                   <p className="text-3xl font-bold text-white mt-1">{decision.expected_line_stop_hours}h</p>
                 </div>
                 <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                   <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
               </div>
             </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
             <h4 className="text-sm font-bold text-slate-500 uppercase mb-4 border-b border-slate-800 pb-2">Event Origin</h4>
             <div className="space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Supplier</span>
                 <span className="text-slate-300 font-medium">{event.supplier_name}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Component</span>
                 <span className="text-slate-300 font-medium">{event.part_name}</span>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-slate-500">Event Type</span>
                 <span className="text-slate-300 font-medium">{event.event_type}</span>
               </div>
             </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all border border-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>New Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
};
