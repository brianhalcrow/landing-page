
import { Button } from "@/components/ui/button";
import { Plus, Copy, Save, Trash } from "lucide-react";
import { toast } from "sonner";
import { useCallback } from "react";
import { validateTradeRequest, transformTradeRequest } from "../utils/tradeRequestUtils";
import { useTradeRequestSave } from "../hooks/useTradeRequestSave";

interface ActionsRendererProps {
  data: any;
  node: any;
  api: any;
  rowIndex: number;
  onAddRow: () => void;
  updateRowData: (rowIndex: number, updates: any) => void;
  onClearGrid?: () => void;
}

export const ActionsRenderer = ({ 
  data, 
  node, 
  api, 
  rowIndex,
  onAddRow,
  updateRowData,
  onClearGrid 
}: ActionsRendererProps) => {
  const saveMutation = useTradeRequestSave();

  const handleDelete = useCallback(() => {
    // Only allow deletion of unsaved rows
    if (data.isSaved) {
      toast.error("Cannot delete saved trade requests");
      return;
    }

    const isSwap = data.instrument?.toLowerCase() === 'swap';
    
    if (isSwap && data.swapId) {
      // Find all rows with the same swapId
      const allRows = api.getModel().rowsToDisplay;
      const swapRows = allRows.filter(row => row.data.swapId === data.swapId);
      
      if (swapRows.length) {
        api.applyTransaction({
          remove: swapRows.map(row => row.data)
        });
        toast.success("Swap pair removed from grid");
      }
    } else {
      // For non-swaps, remove single row
      api.applyTransaction({
        remove: [data]
      });
      toast.success("Row removed from grid");
    }
  }, [api, data]);

  const findSwapPair = useCallback(() => {
    if (!data.swapId) return null;
    
    const allRows = api.getModel().rowsToDisplay;
    return allRows
      .map(row => row.data)
      .filter(rowData => rowData.swapId === data.swapId && rowData !== data);
  }, [api, data]);

  const handleSave = useCallback(async () => {
    try {
      const isSwap = data.instrument?.toLowerCase() === 'swap';
      
      if (isSwap) {
        // Find the other leg of the swap
        const otherLeg = findSwapPair()?.[0];
        
        if (!otherLeg) {
          toast.error("Cannot save incomplete swap pair");
          return;
        }

        // Validate both legs
        const isFirstLegValid = validateTradeRequest(data);
        const isSecondLegValid = validateTradeRequest(otherLeg);

        if (!isFirstLegValid || !isSecondLegValid) {
          return; // validateTradeRequest already shows error toasts
        }

        // Transform both legs for saving
        const firstLegToSave = transformTradeRequest(data);
        const secondLegToSave = transformTradeRequest(otherLeg);

        // Save both legs
        const savedData = await saveMutation.mutateAsync([firstLegToSave, secondLegToSave]);
        
        // Update both rows with saved state and new IDs
        const savedFirstLeg = savedData?.[0];
        const savedSecondLeg = savedData?.[1];
        
        if (savedFirstLeg && savedSecondLeg) {
          const firstRowNode = api.getRowNode(data.rowId);
          const secondRowNode = api.getRowNode(otherLeg.rowId);
          
          if (firstRowNode) {
            firstRowNode.setData({ ...data, isSaved: true, request_no: savedFirstLeg.request_no });
          }
          
          if (secondRowNode) {
            secondRowNode.setData({ ...otherLeg, isSaved: true, request_no: savedSecondLeg.request_no });
          }
        }
        
        toast.success("Swap trade request saved successfully");
      } else {
        // For non-swaps, validate and save single row
        if (!validateTradeRequest(data)) {
          return;
        }

        // Transform and save the trade
        const tradeToSave = transformTradeRequest(data);
        const savedData = await saveMutation.mutateAsync(tradeToSave);
        
        if (savedData?.[0]) {
          const rowNode = api.getRowNode(data.rowId);
          if (rowNode) {
            rowNode.setData({ ...data, isSaved: true, request_no: savedData[0].request_no });
          }
        }
        
        toast.success("Trade request saved successfully");
      }

    } catch (error) {
      console.error("Error saving trade request:", error);
      toast.error("Failed to save trade request");
    }
  }, [data, api, saveMutation, findSwapPair]);

  const handleCopy = useCallback(() => {
    const { isSaved, ...rowToCopy } = data;
    onAddRow();
    // Get the new row's data and update it with copied data
    const lastRowIndex = api.getDisplayedRowCount() - 1;
    updateRowData(lastRowIndex, rowToCopy);
    toast.success("Row copied successfully");
  }, [data, onAddRow, api, updateRowData]);

  const handleAddBelow = useCallback(() => {
    // Only allow adding rows at the end
    const totalRows = api.getDisplayedRowCount();
    const isLastRow = rowIndex === totalRows - 1;
    
    if (!isLastRow) {
      toast.error("New rows can only be added at the end");
      return;
    }

    onAddRow();
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
        disabled={data.isSaved || saveMutation.isPending}
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
