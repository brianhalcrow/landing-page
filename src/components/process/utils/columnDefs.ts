
import { ColDef, ColGroupDef } from 'ag-grid-community';
import CheckboxCellRenderer from '@/components/configuration/grid/cellRenderers/CheckboxCellRenderer';
import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const createBaseColumnDefs = (): ColDef[] => [
  {
    field: 'entity_id',
    headerName: 'Entity ID',
    width: 120,
    sort: 'asc',
    pinned: 'left',
    headerClass: 'ag-header-center custom-header'
  },
  {
    field: 'entity_name',
    headerName: 'Entity Name',
    width: 200,
    pinned: 'left',
    headerClass: 'ag-header-center custom-header'
  }
];

export const createProcessColumnGroups = (processTypes: any[]): ColGroupDef[] =>
  (processTypes || []).map(processType => ({
    headerName: processType.process_name,
    headerClass: 'ag-header-center custom-header',
    children: processType.process_options.flatMap(option => 
      option.process_settings.map(setting => ({
        field: `setting_${setting.process_setting_id}`,
        headerName: setting.setting_name,
        flex: 1,
        headerClass: 'ag-header-center custom-header',
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: (params: any) => ({
          disabled: !params.data?.isEditing,
          value: params.value,
          hasSchedule: setting.setting_type === 'scheduled',
          entityId: params.data?.entity_id,
          processSettingId: setting.process_setting_id,
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
    )
  }));

export const createActionsColumn = (): ColDef => ({
  headerName: 'Actions',
  minWidth: 100,
  maxWidth: 100,
  headerClass: 'ag-header-center custom-header',
  cellRenderer: (params: any) => (
    <div className="flex items-center justify-center gap-2">
      {!params.data.isEditing ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const updatedData = { ...params.data, isEditing: true };
            params.node.setData(updatedData);
            params.api.refreshCells({ rowNodes: [params.node] });
          }}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const updatedData = { ...params.data, isEditing: false };
            params.node.setData(updatedData);
            params.api.refreshCells({ rowNodes: [params.node] });
          }}
          className="h-8 w-8 p-0"
        >
          <Save className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
});
