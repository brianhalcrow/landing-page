
import { Button } from "@/components/ui/button";
import { Plus, Copy, Save, Trash } from "lucide-react";
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

  const handleSave = useCallback(async () => {
    try {
      const isSwap = data.instrument?.toLowerCase() === 'swap';
      
      if (isSwap) {
        const otherLeg = findSwapPair()?.[0];
        
        if (!otherLeg) {
          toast.error("Cannot save incomplete swap pair");
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
        if (!validateTradeRequest(data)) {
          return;
        }

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
    const lastRowIndex = api.getDisplayedRowCount() - 1;
    updateRowData(lastRowIndex, rowToCopy);
    toast.success("Row copied successfully");
  }, [data, onAddRow, api, updateRowData]);

  const handleAddBelow = useCallback(() => {
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
