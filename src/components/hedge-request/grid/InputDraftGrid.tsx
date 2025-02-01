import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef, useState } from 'react';
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

// Custom cell renderer for entity selection
const EntityNameSelector = (props: any) => {
  const entities = props.context.validEntities || [];
  
  const handleChange = (event: any) => {
    const selectedEntity = entities.find(
      (entity: ValidEntity) => entity.entity_name === event.target.value
    );
    if (selectedEntity) {
      props.node.setData({
        ...props.data,
        entity_name: selectedEntity.entity_name,
        entity_id: selectedEntity.entity_id,
        functional_currency: selectedEntity.functional_currency
      });
    }
  };

  return (
    <select 
      value={props.value || ''} 
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Entity</option>
      {entities.map((entity: ValidEntity) => (
        <option key={entity.entity_id} value={entity.entity_name}>
          {entity.entity_name}
        </option>
      ))}
    </select>
  );
};

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
    editable: true
  },
  {
    field: 'exposure_category_l1',
    headerName: 'Exposure Category L1',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'exposure_category_l2',
    headerName: 'Exposure Category L2',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true
  },
  {
    field: 'exposure_category_l3',
    headerName: 'Exposure Category L3',
    minWidth: 160,
    flex: 1.5,
    headerClass: 'ag-header-center',
    editable: true
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
      console.log('Fetching valid entities...');
      
      // Get entities with active exposure configurations using a single query
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

      // Transform the data to remove duplicates and match the ValidEntity interface
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
      // Validate that all entities in rowData are valid
      const invalidEntities = rowData.filter(row => 
        !validEntities?.some(valid => valid.entity_id === row.entity_id)
      );

      if (invalidEntities.length > 0) {
        toast.error('Some entities are not properly configured. Please select valid entities.');
        return;
      }

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