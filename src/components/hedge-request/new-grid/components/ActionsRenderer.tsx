
import { Button } from "@/components/ui/button";
import { Plus, Copy, SendHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { useCallback } from "react";
import { validateTradeRequest, transformTradeRequest } from "../utils/tradeRequestUtils";
import { useTradeRequestSave } from "../hooks/useTradeRequestSave";
import { HedgeRequestRow } from "../types/hedgeRequest.types";

interface ActionsRendererProps {
  data: HedgeRequestRow;
  node: any;
  api: any;
  rowIndex: number;
  onAddRow?: () => void;
  updateRowData?: (rowIndex: number, updates: any) => void;
  onRemoveRow?: (row: HedgeRequestRow) => void;
}

export const ActionsRenderer = ({ 
  data, 
  node, 
  api, 
  rowIndex,
  onAddRow,
  updateRowData,
  onRemoveRow
}: ActionsRendererProps) => {
  const saveMutation = useTradeRequestSave();

  const handleDelete = useCallback(() => {
    if (!data) {
      console.error('No data provided for deletion');
      return;
    }

    if (data.isSaved) {
      toast.error("Cannot delete saved trade requests");
      return;
    }

    try {
      if (onRemoveRow) {
        onRemoveRow(data);
        toast.success(data.instrument?.toLowerCase() === 'swap' ? 
          "Swap pair removed from grid" : 
          "Row removed from grid"
        );
      } else {
        console.error('Remove row function not provided');
        toast.error("Unable to remove row - missing handler");
      }
    } catch (error) {
      console.error('Error removing row:', error);
      toast.error("Failed to remove row from grid");
    }
  }, [data, onRemoveRow]);

  const findSwapPair = useCallback(() => {
    if (!data.swap_id) return null;
    
    const allRows = api.getModel().rowsToDisplay;
    return allRows
      .map(row => row.data)
      .filter(rowData => rowData.swap_id === data.swap_id && rowData !== data);
  }, [api, data]);

  const handleSubmit = useCallback(async () => {
    try {
      const isSwap = data.instrument?.toLowerCase() === 'swap';
      
      if (isSwap) {
        const otherLeg = findSwapPair()?.[0];
        
        if (!otherLeg) {
          toast.error("Cannot submit incomplete swap pair");
          return;
        }

        const isFirstLegValid = validateTradeRequest(data);
        const isSecondLegValid = validateTradeRequest(otherLeg);

        if (!isFirstLegValid || !isSecondLegValid) {
          return;
        }

        const firstLegToSave = transformTradeRequest(data);
        const secondLegToSave = transformTradeRequest(otherLeg);

        const savedData = await saveMutation.mutateAsync([firstLegToSave, secondLegToSave]);
        
        const savedFirstLeg = savedData?.[0];
        const savedSecondLeg = savedData?.[1];
        
        if (savedFirstLeg && savedSecondLeg) {
          // Remove both legs from the grid
          api.applyTransaction({
            remove: [data, otherLeg]
          });
          
          toast.success(`Request No ${savedFirstLeg.request_no} and ${savedSecondLeg.request_no} have been submitted`);
        }
      } else {
        if (!validateTradeRequest(data)) {
          return;
        }

        const tradeToSave = transformTradeRequest(data);
        const savedData = await saveMutation.mutateAsync(tradeToSave);
        
        if (savedData?.[0]) {
          // Remove the submitted row from the grid
          api.applyTransaction({
            remove: [data]
          });
          
          toast.success(`Request No ${savedData[0].request_no} has been submitted`);
        }
      }

    } catch (error) {
      console.error("Error submitting trade request:", error);
      toast.error("Failed to submit trade request");
    }
  }, [data, api, saveMutation, findSwapPair]);

  const handleCopy = useCallback(() => {
    try {
      const { isSaved, ...rowToCopy } = data;
      const newRowId = crypto.randomUUID();
      const newRow = { ...rowToCopy, rowId: newRowId };
      
      // Use AG Grid's transaction API to add the new row
      api.applyTransaction({
        add: [newRow],
        addIndex: api.getDisplayedRowCount()
      });

      toast.success("Row copied successfully");
    } catch (error) {
      console.error('Error copying row:', error);
      toast.error("Failed to copy row");
    }
  }, [data, api]);

  const handleAddBelow = useCallback(() => {
    if (onAddRow) {
      onAddRow();
    }
  }, [onAddRow]);

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleAddBelow}
        className="h-8 w-8"
        disabled={data.isSaved}
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
        onClick={handleSubmit}
        className="h-8 w-8"
        disabled={data.isSaved || saveMutation.isPending}
      >
        <SendHorizontal className="h-4 w-4" />
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
