
import React, { useState } from 'react';
import { AnalysisState, SupplierEvent, CombinedPayload, SupplierProfile } from './types';
import { extractSupplierEvent } from './services/geminiService';
import { 
  fetchProfilesByName, 
  fetchInventoryByPart, 
  fetchProductionContext,
  fetchAllProfilesForPart
} from './services/supabaseService';
import { getMistralDecision } from './services/mistralService';
import { DashboardHeader } from './components/DashboardHeader';
import { EmailInput } from './components/EmailInput';
import { AnalysisOutput } from './components/AnalysisOutput';
import { LoadingState } from './components/LoadingState';

const App: React.FC = () => {
  const [emailText, setEmailText] = useState('');
  const [state, setState] = useState<AnalysisState>({ status: 'idle' });

  const handleAnalyze = async () => {
    if (!emailText.trim()) return;

    setState({ status: 'extracting' });

    try {
      // Step 1: Extract Event via Gemini
      const event: SupplierEvent = await extractSupplierEvent(emailText);
      setState(prev => ({ ...prev, status: 'fetching_data', event }));

      // --- VALIDATION SEQUENCE (STRICT ORDER) ---

      // STEP A — Supplier Validation
      const supplierProfiles = await fetchProfilesByName(event.supplier_name);
      if (supplierProfiles.length === 0) {
        setState({ 
          status: 'error', 
          errorMessage: "Supplier not found in system. Please verify the supplier name or onboard the supplier before analysis." 
        });
        return;
      }

      // STEP B — Supplier–Part Validation
      const partName = event.part_name;
      if (!partName) {
        setState({ 
          status: 'error', 
          errorMessage: "Could not identify a part name in the email. Please verify the product scope." 
        });
        return;
      }

      const isApproved = supplierProfiles.some(p => p.part_name === partName);
      if (!isApproved) {
        setState({ 
          status: 'error', 
          errorMessage: "Supplier exists but is not approved for the mentioned product. Risk analysis cannot be performed for this combination." 
        });
        return;
      }

      // STEP C — Inventory & Production Context Fetching
      const inventory = await fetchInventoryByPart(partName);
      if (!inventory) {
        setState({ 
          status: 'error', 
          errorMessage: "Product not found in inventory records. Please verify the part name or update inventory master data." 
        });
        return;
      }

      // Fetch additional context for the decision payload
      const production = await fetchProductionContext();
      const allProfilesForPart = await fetchAllProfilesForPart(partName);

      const payload: CombinedPayload = {
        supplier_event: event,
        supplier_profiles: allProfilesForPart, // Includes primary and alternates
        inventory_status: inventory,
        production_context: production,
      };

      setState(prev => ({ ...prev, status: 'reasoning', payload }));

      // Step 3: Reasoning via Mistral
      const decision = await getMistralDecision(payload);
      
      setState(prev => ({ ...prev, status: 'success', decision }));
    } catch (error: any) {
      console.error(error);
      let msg = "An unexpected error occurred during analysis.";
      if (error.message === "DATA_SOURCE_ERROR") {
        msg = "Data source not connected. Unable to perform supplier risk assessment at this time.";
      } else if (error.message) {
        msg = error.message;
      }
      
      setState({ 
        status: 'error', 
        errorMessage: msg
      });
    }
  };

  const handleReset = () => {
    setEmailText('');
    setState({ status: 'idle' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      <div className="w-full max-w-5xl space-y-8">
        <DashboardHeader />

        <main className="grid grid-cols-1 gap-8">
          {state.status === 'idle' && (
            <EmailInput 
              value={emailText} 
              onChange={setEmailText} 
              onAnalyze={handleAnalyze} 
            />
          )}

          {(state.status === 'extracting' || state.status === 'fetching_data' || state.status === 'reasoning') && (
            <LoadingState status={state.status} />
          )}

          {state.status === 'success' && state.decision && (
            <AnalysisOutput 
              decision={state.decision} 
              event={state.event!} 
              onBack={handleReset} 
            />
          )}

          {state.status === 'error' && (
            <div className="bg-red-900/20 border border-red-500/50 p-8 rounded-2xl flex flex-col items-center text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/30">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-400">Analysis Halted</h3>
                <p className="text-slate-300 mt-4 max-w-md leading-relaxed">{state.errorMessage}</p>
              </div>
              <button 
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-xl transition-all border border-slate-700 font-bold active:scale-95"
              >
                Return to Input
              </button>
            </div>
          )}
        </main>
      </div>

      <footer className="mt-auto py-8 text-slate-500 text-sm flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span>SUPPLY-SHIELD Autonomous Node Active</span>
      </footer>
    </div>
  );
};

export default App;
