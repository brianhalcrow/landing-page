
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
        .from('erp_gl_transaction')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      // Then get the paginated data
      const { data, error } = await supabase
        .from('erp_gl_transaction')
        .select('*')
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
        .order('document_date', { ascending: false });
      
      if (error) throw error;

      // Transform the data to match GLTransaction interface
      const transformedData = data?.map(item => ({
        entity: item.entity || '',
        entity_id: item.entity_id || 0,
        cost_centre: item.cost_centre || '',
        account_number: item.account_number || '',
        account_name: item.account_name || '',
        transaction_currency: item.transaction_currency || '',
        transaction_amount: item.transaction_amount || 0,
        base_amount: item.base_amount || 0,
        document_date: item.document_date || '',
        period: item.period || '',
        year: (item.year || '').toString()
      })) as GLTransaction[];

      return {
        transactions: transformedData,
        totalRows: count || 0
      };
    }
  });
};

export { PAGE_SIZE };
