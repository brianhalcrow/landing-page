
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TradeDataGrid from "./TradeDataGrid";
import TradeGridToolbar from "./TradeGridToolbar";
import { useState } from "react";
import { HedgeRequestDraftTrade } from "../../grid/types";

interface TradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  draftId: number;
}

const TradeDialog = ({ isOpen, onClose, draftId }: TradeDialogProps) => {
  const { data: draftDetails } = useQuery({
    queryKey: ['draft-details', draftId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select('*')
        .eq('id', draftId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: isOpen && !!draftId
  });

  const emptyRow: Partial<HedgeRequestDraftTrade> = {
    draft_id: draftId.toString(),
    entity_id: draftDetails?.entity_id || null,
    entity_name: draftDetails?.entity_name || null
  };

  const [rowData, setRowData] = useState<HedgeRequestDraftTrade[]>([emptyRow as HedgeRequestDraftTrade]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] p-0">
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Add Trades</h2>
          <TradeGridToolbar
            draftId={draftId}
            rowData={rowData}
            setRowData={setRowData}
            entityId={draftDetails?.entity_id}
            entityName={draftDetails?.entity_name}
          />
          <TradeDataGrid
            rowData={rowData}
            onRowDataChange={setRowData}
            entityId={draftDetails?.entity_id}
            entityName={draftDetails?.entity_name}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDialog;
