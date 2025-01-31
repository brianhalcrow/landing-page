import { AgGridReact } from 'ag-grid-react';
import { useRef, useEffect, useState } from 'react';
import { ColDef } from 'ag-grid-community';
import { gridStyles } from '../../../configuration/grid/gridStyles';
import { validateAmount, validateBuySell } from '../../grid/validation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface TradesGridProps {
  draftId: string | null;
}

const TradesGrid = ({ draftId }: TradesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrades = async () => {
      if (!draftId) return;

      const { data, error } = await supabase
        .from('hedge_request_draft_trades')
        .select('*')
        .eq('draft_id', draftId);

      if (error) {
        console.error('Error fetching trades:', error);
        toast.error('Failed to load trades');
        return;
      }

      setRowData(data || []);
    };

    fetchTrades();
  }, [draftId]);

  const columnDefs: ColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      editable: false,
    },
    {
      field: 'draft_id',
      headerName: 'Draft ID',
      width: 120,
      editable: false,
    },
    {
      field: 'base_currency',
      headerName: 'Base Currency',
      editable: true,
      width: 120,
    },
    {
      field: 'quote_currency',
      headerName: 'Quote Currency',
      editable: true,
      width: 120,
    },
    {
      field: 'currency_pair',
      headerName: 'Currency Pair',
      editable: true,
      width: 120,
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: true,
      width: 120,
      type: 'dateColumn',
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: true,
      width: 120,
      type: 'dateColumn',
    },
    {
      field: 'buy_sell',
      headerName: 'Buy/Sell',
      editable: true,
      width: 100,
      valueSetter: validateBuySell,
    },
    {
      field: 'buy_sell_currency_code',
      headerName: 'Currency Code',
      editable: true,
      width: 120,
    },
    {
      field: 'buy_sell_amount',
      headerName: 'Amount',
      editable: true,
      width: 120,
      type: 'numericColumn',
      valueSetter: validateAmount,
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 160,
      editable: false,
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      width: 160,
      editable: false,
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };

  return (
    <div className="w-full h-[400px] ag-theme-alpine">
      <style>{gridStyles}</style>
      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
      />
    </div>
  );
};

export default TradesGrid;