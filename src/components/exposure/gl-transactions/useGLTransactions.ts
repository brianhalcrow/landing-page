
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { GLTransaction } from './types';

const PAGE_SIZE = 100;

export const useGLTransactions = (page: number) => {
  return useQuery({
    queryKey: ['gl-transactions', page],
    queryFn: async () => {
      // First, get the count
      const { count, error: countError } = await supabase
        .from('erp_gl_transactions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Then get the paginated data
      const { data, error } = await supabase
        .from('erp_gl_transactions')
        .select('*')
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
        .order('document_date', { ascending: false });
      
      if (error) throw error;

      return {
        transactions: data as GLTransaction[],
        totalRows: count || 0
      };
    }
  });
};

export { PAGE_SIZE };
