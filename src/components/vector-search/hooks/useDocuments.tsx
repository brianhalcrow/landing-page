
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);

  const fetchDocuments = async () => {
    try {
      console.log('Fetching documents...');
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        throw error;
      }
      
      console.log('Fetched documents:', data?.length || 0);
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();

    // Set up real-time subscription
    const subscription = supabase
      .channel('documents_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'documents' }, 
        () => {
          fetchDocuments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { documents };
}
