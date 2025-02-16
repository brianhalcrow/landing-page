
import { Button } from "@/components/ui/button";
import { Plus, Copy, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { useCallback } from "react";

interface ActionsRendererProps {
  data: any;
  node: any;
  api: any;
  rowIndex: number;
  onAddRow: () => void;
  updateRowData: (rowIndex: number, updates: any) => void;
}

export const ActionsRenderer = ({ 
  data, 
  node, 
  api, 
  rowIndex,
  onAddRow,
  updateRowData 
}: ActionsRendererProps) => {
  const handleSave = useCallback(async () => {
    try {
      // Mark row as saved
      updateRowData(rowIndex, { isSaved: true });
      node.setData({ ...data, isSaved: true });
      toast.success("Trade request saved successfully");
    } catch (error) {
      console.error("Error saving trade request:", error);
      toast.error("Failed to save trade request");
    }
  }, [data, node, rowIndex, updateRowData]);

  const handleCopy = useCallback(() => {
    const { isSaved, ...rowToCopy } = data;
    onAddRow();
    // Get the new row's data and update it with copied data
    const lastRowIndex = api.getDisplayedRowCount() - 1;
    updateRowData(lastRowIndex, rowToCopy);
    toast.success("Row copied successfully");
  }, [data, onAddRow, api, updateRowData]);

  const handleDelete = useCallback(() => {
    const rowNode = api.getRowNode(node.id);
    if (rowNode) {
      api.applyTransaction({
        remove: [rowNode.data]
      });
      toast.success("Row deleted successfully");
    } else {
      toast.error("Unable to delete row");
      console.error("Row node not found for deletion");
    }
  }, [api, node.id]);

  const handleAddBelow = useCallback(() => {
    // Only allow adding rows at the end
    const totalRows = api.getDisplayedRowCount();
    const isLastRow = rowIndex === totalRows - 1;
    
    if (!isLastRow) {
      toast.error("New rows can only be added at the end");
      return;
    }

    onAddRow();
    toast.success("New row added");
  }, [api, rowIndex, onAddRow]);

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleAddBelow}
        className="h-8 w-8"
        disabled={data.isSaved || rowIndex !== api.getDisplayedRowCount() - 1}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleCopy}
        className="h-8 w-8"
      >
        <Copy className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleSave}
        className="h-8 w-8"
        disabled={data.isSaved}
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleDelete}
        className="h-8 w-8"
        disabled={data.isSaved}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
