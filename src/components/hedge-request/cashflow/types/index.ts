
export * from './general-information';
export * from './risk-management';
export * from './hedged-item';
export * from './hedging-instrument';
export * from './assessment-monitoring';
export * from './exposure-details';

// Database fields type
interface DatabaseFields {
  hedge_id: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  approved_at?: string;
  approved_by?: string;
  submitted_at?: string;
  submitted_by?: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

// Base type with common fields
export interface BaseHedgeRequest {
  hedge_id?: string; // Make hedge_id optional in base type
  entity_id: string;
  entity_name: string;
  cost_centre: string;
  transaction_currency: string;
  documentation_date: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy: string;
  hedging_entity: string;
  hedging_entity_fccy: string;
  functional_currency: string;
  risk_management_description: string;
  hedged_item_description: string;
  instrument: string;
  forward_element_designation: string;
  currency_basis_spreads: string;
  hedging_instrument_description: string;
  credit_risk_impact: string;
  oci_reclassification_approach: string;
  economic_relationship: string;
  discontinuation_criteria: string;
  effectiveness_testing_method: string;
  testing_frequency: string;
  assessment_details: string;
  start_month: string | null;
  end_month: string | null;
  status: 'draft';
}

// Type for database records (includes all fields)
export interface HedgeAccountingRequest extends BaseHedgeRequest, DatabaseFields {}

// Type for new hedge requests (no database fields)
export type NewHedgeRequest = BaseHedgeRequest;

// Type for existing hedge requests (all fields required)
export type ExistingHedgeRequest = HedgeAccountingRequest;
