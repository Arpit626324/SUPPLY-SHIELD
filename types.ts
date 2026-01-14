
export type EventType = "DELAY" | "SHORTAGE" | "QUALITY" | "OTHER";

export interface SupplierEvent {
  event_type: EventType;
  delay_hours: number | null;
  reason: string;
  supplier_name: string;
  part_name: string | null;
  expected_recovery_date: string | null;
}

export interface SupplierProfile {
  supplier_id: string;
  supplier_name: string;
  part_name: string;
  is_critical: boolean;
  past_delay_count: number;
}

export interface InventoryStatus {
  part_name: string;
  current_stock_units: number;
  consumption_per_hour: number;
}

export interface ProductionContext {
  plant: string;
  line: string;
  oem: string;
  priority: string;
  cost_per_hour: number;
}

export interface MistralDecision {
  risk_level: "HIGH" | "MEDIUM" | "LOW";
  buffer_stock_hours: number;
  expected_line_stop_hours: number;
  estimated_financial_loss: number;
  primary_reason: string;
  recommended_action: string;
  alternate_supplier_suggestion: {
    supplier_name: string;
    reason: string;
  };
  confidence_score: number;
}

export interface CombinedPayload {
  supplier_event: SupplierEvent;
  supplier_profiles: SupplierProfile[];
  inventory_status: InventoryStatus | null;
  production_context: ProductionContext | null;
}

export interface AnalysisState {
  status: 'idle' | 'extracting' | 'fetching_data' | 'reasoning' | 'success' | 'error';
  errorMessage?: string;
  event?: SupplierEvent;
  payload?: CombinedPayload;
  decision?: MistralDecision;
}
