
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from "@/components/ui/button";
import { Edit, Save } from "lucide-react";

export const ActionsCellRenderer = (params: ICellRendererParams) => {
  const isEditing = params.data?.isEditing;

  const handleEdit = () => {
    const updatedData = { ...params.data, isEditing: true };
    params.node.setData(updatedData);
    params.api.refreshCells({ rowNodes: [params.node] });
  };

  const handleSave = () => {
    const updatedData = { ...params.data, isEditing: false };
    params.node.setData(updatedData);
    params.api.refreshCells({ rowNodes: [params.node] });
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {isEditing ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-8 w-8 p-0"
        >
          <Save className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleEdit}
          className="h-8 w-8 p-0"
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
