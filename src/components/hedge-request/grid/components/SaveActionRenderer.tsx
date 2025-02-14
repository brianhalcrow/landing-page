
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';
import TradeDialog from '../../trade-grid/components/TradeDialog';

interface SaveActionRendererProps {
  data: any;
}

export const SaveActionRenderer = ({ data }: SaveActionRendererProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [savedDraftId, setSavedDraftId] = useState<number | null>(null);

  const handleSaveRow = async () => {
    try {
      console.log('Saving trade data:', data);
      
      // Validate required fields
      if (!data.entity_id || !data.exposure_category_l2 || !data.strategy_description) {
        toast.error('Please fill in all required fields: Entity, Exposure Category, and Strategy');
        return;
      }
      
      // Remove id, calculated fields, but preserve timestamps
      const { id, spot_rate, contract_rate, ...rowData } = data;
      
      const dataToSave = {
        ...rowData,
        created_at: rowData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: savedDraft, error } = await supabase
        .from('hedge_request_draft')
        .insert([dataToSave])
        .select()
        .single();

      if (error) {
        // Check for validation error message
        if (error.message.includes('Invalid hedge request configuration')) {
          toast.error('This combination of entity, exposure category, strategy, and counterparty is not allowed. Please check the hedge strategy configuration.');
          return;
        }
        throw error;
      }
      
      toast.success('Draft saved successfully');
      setSavedDraftId(savedDraft.id);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSaveRow}
        className="h-8 w-8"
      >
        <Save className="h-4 w-4" />
      </Button>

      {savedDraftId && (
        <TradeDialog 
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          draftId={savedDraftId}
        />
      )}
    </>
  );
};
