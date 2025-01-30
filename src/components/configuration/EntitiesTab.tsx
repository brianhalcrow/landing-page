import { supabase } from '@/integrations/supabase/client';
import EntitiesGrid from './EntitiesGrid';
import CsvOperations from './CsvOperations';
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from 'react';
import { toast } from "sonner";
import { useEntities } from '@/hooks/useEntities';

const EntitiesTab = () => {
  const { entities, isLoading, error, refetch } = useEntities();

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        refetch();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  const handleUploadComplete = (updatedEntityIds: string[]) => {
    refetch();
  };

  if (error) {
    toast.error(`Error loading entities: ${error.message}`);
    return (
      <div className="p-4 space-y-4">
        <CsvOperations onUploadComplete={handleUploadComplete} />
        <div className="text-red-500">
          Error loading entities. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <CsvOperations onUploadComplete={handleUploadComplete} />
      {isLoading ? (
        <Skeleton className="h-[600px] w-full" />
      ) : (
        <EntitiesGrid entities={entities || []} />
      )}
    </div>
  );
};

export default EntitiesTab;