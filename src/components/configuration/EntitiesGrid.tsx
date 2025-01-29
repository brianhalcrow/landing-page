import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { Edit, Trash, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import { useRef, useState } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface EntitiesGridProps {
  entities: Tables<'pre_trade_sfx_config_exposures'>[];
  onRefresh: () => void;
}

const EntitiesGrid = ({ entities, onRefresh }: EntitiesGridProps) => {
  const gridRef = useRef<AgGridReact>(null);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const handleEdit = (entityId: string) => {
    setEditingRow(entityId);
    const node = gridApi?.getRowNode(entityId);
    if (node) {
      node.setRowHeight(45);
      gridApi?.redrawRows({ rowNodes: [node] });
    }
  };

  const handleSave = async (entityId: string) => {
    const rowNode = gridApi?.getRowNode(entityId);
    if (!rowNode) return;

    const updatedData = rowNode.data;
    try {
      const { error } = await supabase
        .from('pre_trade_sfx_config_exposures')
        .update(updatedData)
        .eq('entity_id', entityId);

      if (error) throw error;

      setEditingRow(null);
      onRefresh();
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Failed to update configuration');
    }
  };

  const handleDelete = async (entityId: string) => {
    try {
      const { error } = await supabase
        .from('pre_trade_sfx_config_exposures')
        .delete()
        .eq('entity_id', entityId);

      if (error) throw error;

      onRefresh();
      toast.success('Configuration deleted successfully');
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Failed to delete configuration');
    }
  };

  const handleAdd = async () => {
    const newRow = {
      entity_id: crypto.randomUUID(),
      entity_name: '',
      functional_currency: '',
      created_at: new Date().toISOString(),
      po: false,
      ap: false,
      ar: false,
      other: false,
      revenue: false,
      costs: false,
      net_income: false,
      ap_realized: false,
      ar_realized: false,
      fx_realized: false,
      net_monetary: false,
      monetary_assets: false,
      monetary_liabilities: false,
    };

    try {
      const { error } = await supabase
        .from('pre_trade_sfx_config_exposures')
        .insert([newRow]);

      if (error) throw error;

      onRefresh();
      toast.success('New configuration added successfully');
    } catch (error) {
      console.error('Error adding configuration:', error);
      toast.error('Failed to add configuration');
    }
  };

  const wrapHeaderText = (params: any) => {
    return {
      template: `<div class="ag-header-cell-label" style="white-space: normal; line-height: 1.2em;">
                  ${params.displayName.split(' ').join('<br/>')}
                </div>`
    };
  };

  const columnDefs: ColDef[] = [
    {
      headerName: 'Actions',
      field: 'actions',
      width: 120,
      suppressSizeToFit: true,
      resizable: false,
      cellRenderer: (params: any) => {
        const entityId = params.data.entity_id;
        const isEditing = editingRow === entityId;

        return (
          <div className="flex gap-2">
            {isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSave(entityId)}
              >
                <Save className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(entityId)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(entityId)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
    { 
      field: 'entity_id',
      headerName: 'Entity ID',
      editable: true,
      width: 120,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    { 
      field: 'entity_name',
      headerName: 'Entity Name',
      editable: true,
      width: 150,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    { 
      field: 'functional_currency',
      headerName: 'Currency',
      editable: true,
      width: 100,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'po',
      headerName: 'PO',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 80,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'ap',
      headerName: 'AP',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 80,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'ar',
      headerName: 'AR',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 80,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'other',
      headerName: 'Other',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 80,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'revenue',
      headerName: 'Revenue',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 100,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'costs',
      headerName: 'Costs',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 80,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'net_income',
      headerName: 'Net Income',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 110,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'ap_realized',
      headerName: 'AP Realized',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 110,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'ar_realized',
      headerName: 'AR Realized',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 110,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'fx_realized',
      headerName: 'FX Realized',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 110,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'net_monetary',
      headerName: 'Net Monetary',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 120,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'monetary_assets',
      headerName: 'Monetary Assets',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 130,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    },
    {
      field: 'monetary_liabilities',
      headerName: 'Monetary Liabilities',
      editable: true,
      cellRenderer: 'agCheckboxCellRenderer',
      width: 140,
      suppressSizeToFit: true,
      resizable: false,
      headerComponentParams: { template: wrapHeaderText }
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: false,
    suppressMovable: true,
  };

  const gridStyle = {
    height: '600px',
    width: '100%',
  };

  const gridThemeClass = 'ag-theme-alpine';

  if (!entities.length) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          No entities found. Click below to add one.
        </p>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>
      <div
        className={gridThemeClass}
        style={gridStyle}
      >
        <AgGridReact
          ref={gridRef}
          rowData={entities}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          onGridReady={onGridReady}
          rowSelection="multiple"
          enableCellTextSelection={true}
          suppressRowClickSelection={true}
          getRowId={(params) => params.data.entity_id}
        />
      </div>
    </div>
  );
};

export default EntitiesGrid;
