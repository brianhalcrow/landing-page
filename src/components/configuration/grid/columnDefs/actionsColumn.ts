
import { ColDef } from 'ag-grid-community';

export const createActionColumn = (): ColDef => ({
  headerName: 'Actions',
  minWidth: 100,
  maxWidth: 100,
  suppressSizeToFit: true,
  headerClass: 'ag-header-center custom-header',
  cellRenderer: 'actionsCellRenderer',
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

        // Get all exposure type changes
        const updates = Object.entries(params.data)
          .filter(([key, value]) => key.startsWith('exposure_'))
          .map(([key, value]) => ({
            entityId: params.data.entity_id,
            exposureTypeId: parseInt(key.replace('exposure_', '')),
            isActive: value
          }));

        // Call the update mutation
        await params.context.updateConfig.mutateAsync(updates);
      }
    }
  })
});
