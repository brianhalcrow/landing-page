import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EntityNameSelector } from './selectors/EntityNameSelector';
import { CostCentreSelector } from './selectors/CostCentreSelector';
import { ExposureCategoryL1Selector } from './selectors/ExposureCategoryL1Selector';
import { ExposureCategoryL2Selector } from './selectors/ExposureCategoryL2Selector';
import { ExposureCategoryL3Selector } from './selectors/ExposureCategoryL3Selector';
import { HedgeRequestDraft, ValidEntity } from './types';

const CACHE_KEY = 'hedge-request-draft-grid-state';

const columnDefs = [
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    minWidth: 180,
    flex: 2,
    headerClass: 'ag-header-center',
    cellRenderer: EntityNameSelector,
    editable: false
  },
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'functional_currency',
    headerName: 'Functional Currency',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: false
  },
  {
    field: 'cost_centre',
    headerName: 'Cost Centre',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    cellRenderer: CostCentreSelector,
    editable: false
  },
  {
    field: 'exposure_category_l1',
    headerName: 'Exposure Category L1',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: ExposureCategoryL1Selector,
    editable: false
  },
  {
    field: 'exposure_category_l2',
    headerName: 'Exposure Category L2',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: ExposureCategoryL2Selector,
    editable: false
  },
  {
    field: 'exposure_category_l3',
    headerName: 'Exposure Category L3',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    cellRenderer: ExposureCategoryL3Selector,
    editable: false
  },
  {
    field: 'strategy',
    headerName: 'Strategy',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'instrument',
    headerName: 'Instrument',
    minWidth: 120,
    flex: 1,
    headerClass: 'ag-header-center',
    editable: true
  }
];

const InputDraftGrid = () => {
  const gridRef = useRef<AgGridReact>(null);
  const queryClient = useQueryClient();
  
  // Initialize state from cache or default
  const cachedState = queryClient.getQueryData<HedgeRequestDraft[]>([CACHE_KEY]) || [{
    entity_id: '',
    entity_name: '',
    functional_currency: '',
    cost_centre: '',
    exposure_category_l1: '',
    exposure_category_l2: '',
    exposure_category_l3: '',
    strategy: '',
    instrument: ''
  }];
  
  const [rowData, setRowData] = useState<HedgeRequestDraft[]>(cachedState);

  // Update cache whenever rowData changes
  const updateCache = (newData: HedgeRequestDraft[]) => {
    queryClient.setQueryData([CACHE_KEY], newData);
    setRowData(newData);
  };

  const { data: validEntities } = useQuery({
    queryKey: ['valid-entities'],
    queryFn: async () => {
      console.log('Fetching valid entities...');
      
      const { data: configuredEntities, error: configError } = await supabase
        .from('entity_exposure_config')
        .select(`
          entity_id,
          entities!inner (
            entity_id,
            entity_name,
            functional_currency
          )
        `)
        .eq('is_active', true);

      if (configError) {
        console.error('Error fetching configured entities:', configError);
        throw configError;
      }

      if (!configuredEntities?.length) {
        console.log('No configured entities found');
        return [];
      }

      const uniqueEntities = Array.from(
        new Map(
          configuredEntities.map(item => [
            item.entities.entity_id,
            {
              entity_id: item.entities.entity_id,
              entity_name: item.entities.entity_name,
              functional_currency: item.entities.functional_currency
            }
          ])
        ).values()
      );

      console.log('Fetched valid entities:', uniqueEntities);
      return uniqueEntities as ValidEntity[];
    }
  });

  const handleSaveDraft = async () => {
    try {
      const invalidEntities = rowData.filter(row => 
        !validEntities?.some(valid => valid.entity_id === row.entity_id)
      );

      if (invalidEntities.length > 0) {
        toast.error('Some entities are not properly configured. Please select valid entities.');
        return;
      }

      const { error } = await supabase
        .from('hedge_request_draft')
        .insert(rowData)
        .select();

      if (error) throw error;

      toast.success('Draft saved successfully');
      const emptyRow = {
        entity_id: '',
        entity_name: '',
        functional_currency: '',
        cost_centre: '',
        exposure_category_l1: '',
        exposure_category_l2: '',
        exposure_category_l3: '',
        strategy: '',
        instrument: ''
      };
      updateCache([emptyRow]);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  const addNewRow = () => {
    const newRow = {
      entity_id: '',
      entity_name: '',
      functional_currency: '',
      cost_centre: '',
      exposure_category_l1: '',
      exposure_category_l2: '',
      exposure_category_l3: '',
      strategy: '',
      instrument: ''
    };
    const newData = [...rowData, newRow];
    updateCache(newData);
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
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false,
            editable: true
          }}
          context={{ validEntities }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          onCellValueChanged={(event) => {
            const newData = [...rowData];
            newData[event.rowIndex] = { ...newData[event.rowIndex], [event.colDef.field]: event.newValue };
            updateCache(newData);
          }}
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