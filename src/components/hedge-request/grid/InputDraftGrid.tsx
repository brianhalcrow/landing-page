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

interface ExposureType {
  exposure_type_id: number;
  exposure_category_l1: string;
  exposure_category_l2: string;
  exposure_category_l3: string;
  is_active: boolean;
}

// Custom cell renderer for exposure category L1 selection
const ExposureCategoryL1Selector = (props: any) => {
  const { data: exposureTypes } = useQuery({
    queryKey: ['exposure-types', props.data.entity_id],
    queryFn: async () => {
      if (!props.data.entity_id) return [];
      
      const { data, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          exposure_type_id,
          exposure_types (
            exposure_type_id,
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3
          )
        `)
        .eq('entity_id', props.data.entity_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exposure types:', error);
        toast.error('Failed to fetch exposure types');
        return [];
      }

      return data.map(item => item.exposure_types);
    },
    enabled: !!props.data.entity_id
  });

  const uniqueL1Categories = Array.from(new Set(exposureTypes?.map(type => type.exposure_category_l1) || []));

  // If only one L1 category exists, set it automatically
  if (uniqueL1Categories.length === 1 && !props.value) {
    props.node.setData({
      ...props.data,
      exposure_category_l1: uniqueL1Categories[0],
      exposure_category_l2: '',
      exposure_category_l3: ''
    });
  }

  return uniqueL1Categories.length > 1 ? (
    <select 
      value={props.value || ''} 
      onChange={(e) => {
        props.node.setData({
          ...props.data,
          exposure_category_l1: e.target.value,
          exposure_category_l2: '',
          exposure_category_l3: ''
        });
      }}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Category L1</option>
      {uniqueL1Categories.map((category: string) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  ) : (
    <span>{props.value}</span>
  );
};

// Custom cell renderer for exposure category L2 selection
const ExposureCategoryL2Selector = (props: any) => {
  const { data: exposureTypes } = useQuery({
    queryKey: ['exposure-types', props.data.entity_id, props.data.exposure_category_l1],
    queryFn: async () => {
      if (!props.data.entity_id || !props.data.exposure_category_l1) return [];
      
      const { data, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          exposure_type_id,
          exposure_types (
            exposure_type_id,
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3
          )
        `)
        .eq('entity_id', props.data.entity_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exposure types:', error);
        toast.error('Failed to fetch exposure types');
        return [];
      }

      return data
        .map(item => item.exposure_types)
        .filter(type => type.exposure_category_l1 === props.data.exposure_category_l1);
    },
    enabled: !!(props.data.entity_id && props.data.exposure_category_l1)
  });

  const uniqueL2Categories = Array.from(new Set(exposureTypes?.map(type => type.exposure_category_l2) || []));

  // If only one L2 category exists, set it automatically
  if (uniqueL2Categories.length === 1 && !props.value) {
    props.node.setData({
      ...props.data,
      exposure_category_l2: uniqueL2Categories[0],
      exposure_category_l3: ''
    });
  }

  return uniqueL2Categories.length > 1 ? (
    <select 
      value={props.value || ''} 
      onChange={(e) => {
        props.node.setData({
          ...props.data,
          exposure_category_l2: e.target.value,
          exposure_category_l3: ''
        });
      }}
      className="w-full h-full border-0 outline-none bg-transparent"
      disabled={!props.data.exposure_category_l1}
    >
      <option value="">Select Category L2</option>
      {uniqueL2Categories.map((category: string) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  ) : (
    <span>{props.value}</span>
  );
};

// Custom cell renderer for exposure category L3 selection
const ExposureCategoryL3Selector = (props: any) => {
  const { data: exposureTypes } = useQuery({
    queryKey: ['exposure-types', props.data.entity_id, props.data.exposure_category_l1, props.data.exposure_category_l2],
    queryFn: async () => {
      if (!props.data.entity_id || !props.data.exposure_category_l1 || !props.data.exposure_category_l2) return [];
      
      const { data, error } = await supabase
        .from('entity_exposure_config')
        .select(`
          exposure_type_id,
          exposure_types (
            exposure_type_id,
            exposure_category_l1,
            exposure_category_l2,
            exposure_category_l3
          )
        `)
        .eq('entity_id', props.data.entity_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching exposure types:', error);
        toast.error('Failed to fetch exposure types');
        return [];
      }

      return data
        .map(item => item.exposure_types)
        .filter(type => 
          type.exposure_category_l1 === props.data.exposure_category_l1 &&
          type.exposure_category_l2 === props.data.exposure_category_l2
        );
    },
    enabled: !!(props.data.entity_id && props.data.exposure_category_l1 && props.data.exposure_category_l2)
  });

  const uniqueL3Categories = Array.from(new Set(exposureTypes?.map(type => type.exposure_category_l3) || []));

  // If only one L3 category exists, set it automatically
  if (uniqueL3Categories.length === 1 && !props.value) {
    props.node.setDataValue('exposure_category_l3', uniqueL3Categories[0]);
  }

  return uniqueL3Categories.length > 1 ? (
    <select 
      value={props.value || ''} 
      onChange={(e) => props.node.setDataValue('exposure_category_l3', e.target.value)}
      className="w-full h-full border-0 outline-none bg-transparent"
      disabled={!props.data.exposure_category_l2}
    >
      <option value="">Select Category L3</option>
      {uniqueL3Categories.map((category: string) => (
        <option key={category} value={category}>{category}</option>
      ))}
    </select>
  ) : (
    <span>{props.value}</span>
  );
};

// Custom cell renderer for cost centre selection
const CostCentreSelector = (props: any) => {
  const { data: costCentres } = useQuery({
    queryKey: ['cost-centres', props.data.entity_id],
    queryFn: async () => {
      if (!props.data.entity_id) return [];
      
      const { data, error } = await supabase
        .from('management_structure')
        .select('cost_centre')
        .eq('entity_id', props.data.entity_id);

      if (error) {
        console.error('Error fetching cost centres:', error);
        toast.error('Failed to fetch cost centres');
        return [];
      }

      return data.map(item => item.cost_centre);
    },
    enabled: !!props.data.entity_id
  });

  // If only one cost centre exists, set it automatically
  if (costCentres?.length === 1 && !props.value) {
    props.node.setDataValue('cost_centre', costCentres[0]);
  }

  return costCentres?.length > 1 ? (
    <select 
      value={props.value || ''} 
      onChange={(e) => props.node.setDataValue('cost_centre', e.target.value)}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Cost Centre</option>
      {costCentres.map((cc: string) => (
        <option key={cc} value={cc}>{cc}</option>
      ))}
    </select>
  ) : (
    <span>{props.value}</span>
  );
};

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
        functional_currency: selectedEntity.functional_currency,
        cost_centre: '' // Reset cost centre when entity changes
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

