import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { draftDetailsColumnDefs } from './draftDetailsColumnDefs';
import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface HedgeRequestDraft {
  id?: string;
  entity_id: string;
  entity_name: string;
  functional_currency: string;
  cost_centre: string;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  strategy: string;
  instrument: string;
}

const InputDraftGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [rowData, setRowData] = useState<HedgeRequestDraft[]>([{
    entity_id: '',
    entity_name: '',
    functional_currency: '',
    cost_centre: '',
    exposure_category_l1: '',
    exposure_category_l2: '',
    exposure_category_l3: '',
    strategy: '',
    instrument: ''
  }]);

  const handleSaveDraft = async () => {
    try {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .insert(rowData)
        .select();

      if (error) throw error;

      toast.success('Draft saved successfully');
      setRowData([{
        entity_id: '',
        entity_name: '',
        functional_currency: '',
        cost_centre: '',
        exposure_category_l1: '',
        exposure_category_l2: '',
        exposure_category_l3: '',
        strategy: '',
        instrument: ''
      }]);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const addNewRow = () => {
    setRowData([...rowData, {
      entity_id: '',
      entity_name: '',
      functional_currency: '',
      cost_centre: '',
      exposure_category_l1: '',
      exposure_category_l2: '',
      exposure_category_l3: '',
      strategy: '',
      instrument: ''
    }]);
  };

  return (
    <div className="space-y-4">
      <div className="w-full h-[300px] ag-theme-alpine">
        <style>
          {`
            .ag-header-center .ag-header-cell-label {
              justify-content: center;
            }
            .ag-cell {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
          `}
        </style>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={draftDetailsColumnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false,
            editable: true
          }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
        />
      </div>
      <div className="flex gap-4">
        <Button onClick={addNewRow}>Add Row</Button>
        <Button onClick={handleSaveDraft}>Save Draft</Button>
      </div>
    </div>
  );
};

export default InputDraftGrid;