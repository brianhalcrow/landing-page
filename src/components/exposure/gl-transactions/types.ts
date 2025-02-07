
export interface GLTransaction {
  entity: string;
  entity_id: string;
  cost_centre: string;
  account_number: string;
  account_name: string;
  transaction_currency: string;
  transaction_amount: number;
  base_amount: number;
  document_date: string;
  period: string;
  year: string;
}

export interface GLTransactionsPaginationProps {
  page: number;
  totalPages: number;
  totalRows: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}
