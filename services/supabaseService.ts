
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../constants";
import { SupplierProfile, InventoryStatus, ProductionContext } from "../types";

const headers = {
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json"
};

export const fetchProfilesByName = async (supplierName: string): Promise<SupplierProfile[]> => {
  // Using ilike for case-insensitive exact match without wildcards
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/supplier_profile?supplier_name=ilike.${encodeURIComponent(supplierName)}`,
    { headers }
  );
  if (!response.ok) throw new Error("DATA_SOURCE_ERROR");
  return await response.json();
};

export const fetchInventoryByPart = async (partName: string): Promise<InventoryStatus | null> => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/inventory_status?part_name=eq.${encodeURIComponent(partName)}`,
    { headers }
  );
  if (!response.ok) throw new Error("DATA_SOURCE_ERROR");
  const data: InventoryStatus[] = await response.json();
  return data[0] || null;
};

export const fetchProductionContext = async (): Promise<ProductionContext | null> => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/production_context?select=*&limit=1`,
    { headers }
  );
  if (!response.ok) throw new Error("DATA_SOURCE_ERROR");
  const data: ProductionContext[] = await response.json();
  return data[0] || null;
};

export const fetchAllProfilesForPart = async (partName: string): Promise<SupplierProfile[]> => {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/supplier_profile?part_name=eq.${encodeURIComponent(partName)}`,
    { headers }
  );
  if (!response.ok) throw new Error("DATA_SOURCE_ERROR");
  return await response.json();
};
