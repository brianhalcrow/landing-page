
import { useState } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { HedgeAccountingRequest } from "../types";

interface LoadDraftDialogProps {
  onDraftSelect: (draft: HedgeAccountingRequest) => void;
}

export const LoadDraftDialog = ({ onDraftSelect }: LoadDraftDialogProps) => {
  const [open, setOpen] = useState(false);

  const { data: drafts, isLoading } = useQuery({
    queryKey: ['hedge-drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_accounting_requests')
        .select()
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      return data as HedgeAccountingRequest[];
    }
  });

  const handleDraftSelect = (draft: HedgeAccountingRequest) => {
    onDraftSelect(draft);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Load Draft</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select a Draft</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : drafts?.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No drafts found</p>
          ) : (
            <div className="space-y-2">
              {drafts?.map((draft) => (
                <button
                  key={draft.hedge_id}
                  onClick={() => handleDraftSelect(draft)}
                  className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{draft.hedge_id}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(draft.updated_at), "MMM d, yyyy HH:mm")}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{draft.entity_name}</p>
                    <p>Documentation Date: {format(new Date(draft.documentation_date), "MMM d, yyyy")}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
