
export * from './general-information';
export * from './risk-management';
export * from './hedged-item';
export * from './hedging-instrument';
export * from './assessment-monitoring';
export * from './exposure-details';

// Base type without database-managed fields
interface BaseHedgeRequest {
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

// Type for new hedge requests (no hedge_id required)
export interface NewHedgeRequest extends BaseHedgeRequest {}

// Type for existing hedge requests (hedge_id required)
export interface ExistingHedgeRequest extends BaseHedgeRequest {
  hedge_id: string;
}

// Combined type for all hedge accounting requests
export type HedgeAccountingRequest = NewHedgeRequest | ExistingHedgeRequest;
