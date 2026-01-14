
import React from 'react';

interface EmailInputProps {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
}

export const EmailInput: React.FC<EmailInputProps> = ({ value, onChange, onAnalyze }) => {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <label className="block text-sm font-medium text-slate-400 mb-3">Paste Supplier Email</label>
        <textarea
          className="w-full h-64 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none placeholder-slate-700 font-mono text-sm"
          placeholder="From: global.logistics@supplier.com
Subject: Urgent Production Update - Delayed Shipment

Hi Team, 
We've hit a snag with the transmission housings (Part: TH-902). Due to a localized power outage, we're looking at a 12-hour delay on Batch B22..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="mt-6 flex justify-end">
          <button
            onClick={onAnalyze}
            disabled={!value.trim()}
            className="group flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            <span>Analyze Supplier Risk</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Extract", desc: "Unstructured Email to Data" },
          { title: "Query", desc: "Live Operational Context" },
          { title: "Decide", desc: "Executive Action Plans" }
        ].map((item, idx) => (
          <div key={idx} className="bg-slate-900/50 border border-slate-800/50 p-4 rounded-xl flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-400 border border-slate-700">
              {idx + 1}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-300">{item.title}</p>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
