
export interface HedgeLayerMonthlyData {
  month_index: number;
  revenue: number;
  costs: number;
  net_income: number;
  hedged_exposure: number;
  hedge_layer_amount: number;
  indicative_coverage_percentage: number;
  cumulative_layer_amount: number;
  cumulative_coverage_percentage: number;
}

export interface HedgeLayerDetails {
  hedge_id: string;
  layer_number: number;
  layer_percentage: number;
  hedge_ratio: number;
  start_month: string;
  end_month: string;
  monthly_data: HedgeLayerMonthlyData[];
}
