import { Button } from "@/components/ui/button";
import { Save, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { HedgeRequestDraftTrade } from "../../grid/types";

interface ActionsCellRendererProps {
  data: HedgeRequestDraftTrade;
}

const ActionsCellRenderer = ({ data }: ActionsCellRendererProps) => {
  const handleSave = async () => {
    try {
      console.log('Saving trade data:', data);
      const { error } = await supabase
        .from('hedge_request_draft_trades')
        .insert([data]);

      if (error) throw error;
      toast.success('Trade saved successfully');
    } catch (error) {
      console.error('Error saving trade:', error);
      toast.error('Failed to save trade');
    }
  };

  const handleSubmit = () => {
    // TODO: Implement submit functionality
    toast.info('Submit functionality coming soon');
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        className="h-8 w-8 p-0"
      >
        <Save className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSubmit}
        className="h-8 w-8 p-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ActionsCellRenderer;