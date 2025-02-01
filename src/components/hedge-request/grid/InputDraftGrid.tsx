import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { draftDetailsColumnDefs } from './draftDetailsColumnDefs';
import { useRef, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

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

interface ValidEntity {
  entity_id: string;
  entity_name: string;
  functional_currency: string;
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

  // Fetch valid entities that have exposure configurations
  const { data: validEntities } = useQuery({
    queryKey: ['valid-entities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entities')
        .select('entity_id, entity_name, functional_currency')
        .in('entity_id', (
          await supabase
            .from('entity_exposure_config')
            .select('entity_id')
            .eq('is_active', true)
        ).data?.map(config => config.entity_id) || []);

      if (error) {
        console.error('Error fetching valid entities:', error);
        throw error;
      }

      return data as ValidEntity[];
    }
  });

  // Update column definitions to include entity dropdown
  useEffect(() => {
    if (validEntities && gridRef.current) {
      const gridApi = gridRef.current.api;
      const entityColumn = gridApi.getColumnDef('entity_id');
      if (entityColumn) {
        entityColumn.cellEditor = 'agSelectCellEditor';
        entityColumn.cellEditorParams = {
          values: validEntities.map(entity => entity.entity_id)
        };
      }
    }
  }, [validEntities]);

  const handleSaveDraft = async () => {
    try {
      // Validate that all entities in rowData are valid
      const invalidEntities = rowData.filter(row => 
        !validEntities?.some(valid => valid.entity_id === row.entity_id)
      );

      if (invalidEntities.length > 0) {
        toast.error('Some entities are not properly configured. Please select valid entities.');
        return;
      }

      // Enhance row data with entity information
      const enhancedRowData = rowData.map(row => {
        const entityInfo = validEntities?.find(e => e.entity_id === row.entity_id);
        return {
          ...row,
          entity_name: entityInfo?.entity_name || '',
          functional_currency: entityInfo?.functional_currency || ''
        };
      });

      const { data, error } = await supabase
        .from('hedge_request_draft')
        .insert(enhancedRowData)
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
        <Button 
          onClick={handleSaveDraft}
          disabled={!validEntities?.length}
        >
          Save Draft
        </Button>
      </div>
    </div>
  );
};

export default InputDraftGrid;