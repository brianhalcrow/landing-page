
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SaveActionRendererProps {
  data: any;
}

export const SaveActionRenderer = ({ data }: SaveActionRendererProps) => {
  const handleSaveRow = async () => {
    try {
      console.log('Saving trade request:', data);
      
      // Validate required fields
      if (!data.entity_id || !data.exposure_category_l2 || !data.strategy_description) {
        toast.error('Please fill in all required fields: Entity, Exposure Category, and Strategy');
        return;
      }
      
      // Remove calculated fields
      const { id, spot_rate, contract_rate, ...rowData } = data;
      
      const dataToSave = {
        ...rowData,
        created_at: rowData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('trade_requests')
        .insert([dataToSave]);

      if (error) {
        // Check for validation error message
        if (error.message.includes('Invalid hedge request configuration')) {
          toast.error('This combination of entity, exposure category, strategy, and counterparty is not allowed. Please check the hedge strategy configuration.');
          return;
        }
        throw error;
      }
      
      toast.success('Trade request saved successfully');
    } catch (error) {
      console.error('Error saving trade request:', error);
      toast.error('Failed to save trade request');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleSaveRow}
      className="h-8 w-8"
    >
      <Save className="h-4 w-4" />
    </Button>
  );
};
