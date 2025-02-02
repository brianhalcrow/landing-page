import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TradeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  draftId: number;
}

const TradeDialog = ({ isOpen, onClose, draftId }: TradeDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Trades for Draft #{draftId}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Trade grid will be added here in next step */}
          <p className="text-muted-foreground">Trade grid coming soon...</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TradeDialog;