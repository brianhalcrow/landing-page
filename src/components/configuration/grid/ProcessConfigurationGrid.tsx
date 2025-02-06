import { AgGridReact } from 'ag-grid-react';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useRef } from 'react';
import CheckboxCellRenderer from './CheckboxCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

interface ProcessConfigurationGridProps {
  entities: any[];
  processTypes: any[];
}

const ProcessConfigurationGrid = ({ entities, processTypes }: ProcessConfigurationGridProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const baseColumnDefs: ColDef[] = [
    { 
      field: 'entity_id', 
      headerName: 'Entity ID', 
      minWidth: 120,
      flex: 1,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true
    },
    { 
      field: 'entity_name', 
      headerName: 'Entity Name', 
      minWidth: 240,
      flex: 2,
      headerClass: 'ag-header-center custom-header',
      suppressSizeToFit: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'text-left pl-4'
    }
  ];

  const processColumnGroups: ColGroupDef[] = processTypes.map(processType => ({
    headerName: processType.process_name,
    groupId: `process_${processType.process_type_id}`,
    headerClass: 'ag-header-center custom-header',
    children: processType.process_options.map(option => ({
      headerName: option.option_name,
      groupId: `option_${option.process_option_id}`,
      headerClass: 'ag-header-center custom-header',
      children: option.process_settings.map(setting => ({
        headerName: setting.setting_name,
        field: `setting_${setting.process_setting_id}`,
        minWidth: 120,
        flex: 1,
        headerClass: 'ag-header-center custom-header',
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: (params: any) => ({
          disabled: !params.data?.isEditing,
          value: params.value,
          onChange: (checked: boolean) => {
            if (params.node && params.api) {
              const updatedData = { ...params.data };
              updatedData[params.column.getColId()] = checked;
              params.node.setData(updatedData);
              params.api.refreshCells({ 
                rowNodes: [params.node],
                force: true
              });
            }
          }
        })
      }))
    }))
  }));

  const actionsColumn: ColDef = {
    headerName: 'Actions',
    minWidth: 100,
    maxWidth: 100,
    suppressSizeToFit: true,
    headerClass: 'ag-header-center custom-header',
    cellRenderer: ActionsCellRenderer,
    cellRendererParams: (params: any) => ({
      isEditing: params.data?.isEditing,
      onEditClick: () => {
        if (params.node && params.api) {
          const updatedData = { ...params.data, isEditing: true };
          params.node.setData(updatedData);
          params.api.refreshCells({ rowNodes: [params.node] });
        }
      },
      onSaveClick: async () => {
        if (params.node && params.api) {
          const updatedData = { ...params.data, isEditing: false };
          params.node.setData(updatedData);
          params.api.refreshCells({ rowNodes: [params.node] });
        }
      }
    })
  };

  const columnDefs = [...baseColumnDefs, ...processColumnGroups, actionsColumn];

  return (
    <div className="w-full h-[600px] ag-theme-alpine">
      <style>
        {`
          .ag-header-cell,
          .ag-header-group-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .ag-header-cell-label,
          .ag-header-group-cell-label {
            width: 100% !important;
            text-align: center !important;
          }
          .ag-header-cell-text {
            text-overflow: clip !important;
            overflow: visible !important;
            white-space: normal !important;
          }
          .ag-header-group-cell-with-group {
            border-bottom: 1px solid #babfc7 !important;
          }
          .custom-header {
            white-space: normal !important;
            line-height: 1.2 !important;
          }
          .custom-header .ag-header-cell-label {
            padding: 4px !important;
          }
          .ag-cell {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .text-left {
            justify-content: flex-start !important;
          }
        `}
      </style>
      <AgGridReact
        ref={gridRef}
        rowData={entities}
        columnDefs={columnDefs}
        defaultColDef={{
          sortable: true,
          filter: true,
          resizable: true,
          suppressSizeToFit: false,
          wrapHeaderText: true,
          autoHeaderHeight: true
        }}
        suppressColumnVirtualisation={true}
        enableCellTextSelection={true}
      />
    </div>
  );
};

export default ProcessConfigurationGrid;