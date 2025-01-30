import { ColDef } from 'ag-grid-community';
import { validateDate } from '../validation';
import { toast } from "@/hooks/use-toast";

export const dateColumns: ColDef[] = [
  {
    field: 'trade_date',
    headerName: 'Trade Date',
    width: 120,
    editable: true,
    valueSetter: validateDate
  },
  {
    field: 'settlement_date',
    headerName: 'Settlement Date',
    width: 120,
    editable: true,
    valueSetter: (params) => {
      if (!validateDate(params)) return false;
      
      const tradeDate = new Date(params.data.trade_date);
      const settlementDate = new Date(params.newValue);
      
      if (settlementDate <= tradeDate) {
        toast({
          title: "Invalid Settlement Date",
          description: "Settlement date must be after trade date",
          variant: "destructive"
        });
        return false;
      }
      return true;
    }
  }
];