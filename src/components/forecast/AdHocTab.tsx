import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import HedgeRequestGrid from "../hedge-request/grid/HedgeRequestGrid";

const AdHocTab = () => {
  const { data: hedgeRequests, isLoading } = useQuery({
    queryKey: ['hedge-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hedge requests:', error);
        throw error;
      }

      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Ad-Hoc Hedge Requests</h2>
      <HedgeRequestGrid hedgeRequests={hedgeRequests || []} />
    </div>
  );
};

export default AdHocTab;