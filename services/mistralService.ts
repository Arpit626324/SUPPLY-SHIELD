
import { MISTRAL_API_KEY, MISTRAL_AGENT_ID, MISTRAL_ENDPOINT } from "../constants";
import { CombinedPayload, MistralDecision } from "../types";

export const getMistralDecision = async (payload: CombinedPayload): Promise<MistralDecision> => {
  const content = `
    You are a Supplier Risk Decision Agent. Analyze the following data:
    
    SUPPLIER EVENT:
    ${JSON.stringify(payload.supplier_event, null, 2)}
    
    SUPPLIER PROFILES (FOR ALTERNATIVES):
    ${JSON.stringify(payload.supplier_profiles, null, 2)}
    
    INVENTORY STATUS:
    ${JSON.stringify(payload.inventory_status, null, 2)}
    
    PRODUCTION CONTEXT:
    ${JSON.stringify(payload.production_context, null, 2)}
    
    Analyze delay impact, buffer stock sufficiency, production loss, and recommend actions. 
    Prefer alternate suppliers from supplier_profiles where part_name matches and is_critical = false or past_delay_count is lower.
    
    IMPORTANT: Respond ONLY with valid JSON matching the schema:
    {
      "risk_level": "HIGH | MEDIUM | LOW",
      "buffer_stock_hours": number,
      "expected_line_stop_hours": number,
      "estimated_financial_loss": number,
      "primary_reason": string,
      "recommended_action": string,
      "alternate_supplier_suggestion": {
        "supplier_name": string,
        "reason": string
      },
      "confidence_score": number
    }
  `;

  const response = await fetch(MISTRAL_ENDPOINT, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      agent_id: MISTRAL_AGENT_ID,
      messages: [{ role: "user", content }],
      response_format: { type: "json_object" }
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Mistral API Error: ${response.status} - ${errText}`);
  }

  const result = await response.json();
  const decisionText = result.choices[0].message.content;
  
  try {
    return JSON.parse(decisionText) as MistralDecision;
  } catch (e) {
    console.error("Failed to parse Mistral response:", decisionText);
    throw new Error("Mistral returned invalid JSON structure.");
  }
};
