import { ColDef } from 'ag-grid-community';
import { Select } from '@/components/ui/select';

// Custom cell renderer for the entity name dropdown
const EntityNameSelector = (props: any) => {
  const entities = props.context.validEntities || [];
  
  const handleChange = (event: any) => {
    const selectedEntity = entities.find(
      (entity: any) => entity.entity_name === event.target.value
    );
    if (selectedEntity) {
      const updatedData = {
        ...props.data,
        entity_name: selectedEntity.entity_name,
        entity_id: selectedEntity.entity_id,
        functional_currency: selectedEntity.functional_currency
      };
      props.node.setData(updatedData);
    }
  };

  return (
    <select 
      value={props.value || ''} 
      onChange={handleChange}
      className="w-full h-full border-0 outline-none bg-transparent"
    >
      <option value="">Select Entity</option>
      {entities.map((entity: any) => (
        <option key={entity.entity_id} value={entity.entity_name}>
          {entity.entity_name}
        </option>
      ))}
    </select>
  );
};

export const inputDraftColumnDefs: ColDef[] = [
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