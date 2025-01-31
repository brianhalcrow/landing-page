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

interface DraftData {
  entity_id: string | null;
  entity_name: string | null;
  strategy: string | null;
  instrument: string | null;
}

const TradesGrid = ({ draftId }: TradesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [draftData, setDraftData] = useState<DraftData | null>(null);

  useEffect(() => {
    const fetchDraftAndTrades = async () => {
      if (!draftId) return;

      const { data: draftData, error: draftError } = await supabase
        .from('hedge_request_draft')
        .select('entity_id, entity_name, strategy, instrument')
        .eq('id', draftId)
        .single();

      if (draftError) {
        console.error('Error fetching draft:', draftError);
        toast.error('Failed to load draft data');
        return;
      }

      setDraftData(draftData);

      const { data: tradesData, error: tradesError } = await supabase
        .from('hedge_request_draft_trades')
        .select('*')
        .eq('draft_id', draftId);

      if (tradesError) {
        console.error('Error fetching trades:', tradesError);
        toast.error('Failed to load trades');
        return;
      }

      if (!tradesData || tradesData.length === 0) {
        setRowData([{
          draft_id: draftId,
          entity_id: draftData?.entity_id,
          entity_name: draftData?.entity_name,
          strategy: draftData?.strategy,
          instrument: draftData?.instrument,
        }]);
      } else {
        setRowData(tradesData.map(trade => ({
          ...trade,
          entity_id: draftData?.entity_id,
          entity_name: draftData?.entity_name,
          strategy: draftData?.strategy,
          instrument: draftData?.instrument,
        })));
      }
    };

    fetchDraftAndTrades();
  }, [draftId]);

  const columnDefs: ColDef[] = [
    {
      field: 'draft_id',
      headerName: 'Draft ID',
      width: 200,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-left right-border',
    },
    {
      field: 'entity_id',
      headerName: 'Entity ID',
      width: 120,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-center',
    },
    {
      field: 'entity_name',
      headerName: 'Entity Name',
      width: 150,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-left',
    },
    {
      field: 'strategy',
      headerName: 'Strategy',
      width: 120,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-center',
    },
    {
      field: 'instrument',
      headerName: 'Instrument',
      width: 120,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-center right-border',
    },
    {
      field: 'base_currency',
      headerName: 'Base Currency',
      editable: true,
      width: 120,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center',
    },
    {
      field: 'quote_currency',
      headerName: 'Quote Currency',
      editable: true,
      width: 120,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center',
    },
    {
      field: 'currency_pair',
      headerName: 'Currency Pair',
      editable: true,
      width: 120,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center right-border',
    },
    {
      field: 'trade_date',
      headerName: 'Trade Date',
      editable: true,
      width: 120,
      type: 'dateColumn',
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center',
    },
    {
      field: 'settlement_date',
      headerName: 'Settlement Date',
      editable: true,
      width: 120,
      type: 'dateColumn',
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center right-border',
    },
    {
      field: 'buy_sell',
      headerName: 'Buy/Sell',
      editable: true,
      width: 100,
      valueSetter: validateBuySell,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center',
    },
    {
      field: 'buy_sell_currency_code',
      headerName: 'Currency Code',
      editable: true,
      width: 120,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center',
    },
    {
      field: 'buy_sell_amount',
      headerName: 'Amount',
      editable: true,
      width: 120,
      type: 'numericColumn',
      valueSetter: validateAmount,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'ag-cell-focus text-center right-border',
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      width: 160,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-center',
    },
    {
      field: 'updated_at',
      headerName: 'Updated At',
      width: 160,
      editable: false,
      headerClass: 'text-center main-header wrap-header-text',
      cellClass: 'text-center',
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    suppressSizeToFit: true,
  };

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
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