
import { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridStyles } from "@/components/shared/grid/GridStyles";
import { Skeleton } from "@/components/ui/skeleton";
import { useInstrumentsConfig } from "../hooks/useInstrumentsConfig";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CheckboxCellRenderer from "../../grid/cellRenderers/CheckboxCellRenderer";
import type { ColDef } from "ag-grid-community";

export const InstrumentsConfigGrid = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    counterparties,
    instruments,
    configData,
    isLoading,
    pendingChanges,
    setPendingChanges,
    saveChanges,
  } = useInstrumentsConfig();

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const columnDefs: ColDef[] = [
    {
      field: "counterparty_name",
      headerName: "Counterparty",
      width: 200,
      pinned: 'left',
      suppressMovable: true,
    },
    ...instruments.map((instrument) => ({
      field: `instruments.${instrument.id}`,
      headerName: instrument.instrument,
      width: 120,
      cellRenderer: CheckboxCellRenderer,
      cellRendererParams: {
        disabled: !isEditing,
        onChange: (checked: boolean, data: any) => {
          if (!data?.counterparty_id) return;
          setPendingChanges((prev) => ({
            ...prev,
            [data.counterparty_id]: {
              ...prev[data.counterparty_id],
              [instrument.id]: checked,
            },
          }));
        },
      },
    })),
  ];

  const handleSave = async () => {
    try {
      await saveChanges();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Instrument Configuration</h3>
        <div>
          {isEditing ? (
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setPendingChanges({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit</Button>
          )}
        </div>
      </div>
      <div className="w-full h-[400px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={configData}
          columnDefs={columnDefs}
          defaultColDef={{
            resizable: true,
            sortable: true,
            filter: true,
          }}
          rowHeight={24}
          headerHeight={40}
          suppressRowClickSelection={true}
          enableCellTextSelection={true}
        />
      </div>
    </div>
  );
};
