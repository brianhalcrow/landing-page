
import { ColGroupDef } from 'ag-grid-community';
import CheckboxCellRenderer from '../cellRenderers/CheckboxCellRenderer';

export const createProcessColumnGroups = (processTypes: any[]): ColGroupDef[] =>
  (processTypes || []).map(processType => ({
    headerName: processType.process_name,
    headerClass: 'ag-header-center custom-header',
    children: processType.process_options.map(option => ({
      headerName: option.option_name,
      headerClass: 'ag-header-center custom-header',
      children: option.process_settings.map(setting => ({
        field: `setting_${setting.process_setting_id}`,
        headerName: setting.setting_name,
        flex: 1,
        headerClass: 'ag-header-center custom-header',
        cellRenderer: CheckboxCellRenderer,
        cellRendererParams: {
          settingType: setting.setting_type
        }
      }))
    }))
  }));
