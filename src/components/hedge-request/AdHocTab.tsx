import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import HedgeRequestGrid from "./grid/HedgeRequestGrid";
import DraftDetailsGrid from "./grid/DraftDetailsGrid";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { draftDetailsColumnDefs } from "./grid/draftDetailsColumnDefs";

const AdHocTab = () => {
  const { data: hedgeRequests, isLoading } = useQuery({
    queryKey: ['hedge-request-drafts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hedge_request_draft')
        .select(`
          id,
          entity_id,
          entity_name,
          functional_currency,
          cost_centre,
          exposure_category_l1,
          exposure_category_l2,
          exposure_category_l3,
          strategy,
          instrument,
          status
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching hedge request drafts:', error);
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
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Column Names</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field Name</TableHead>
              <TableHead>Header Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {draftDetailsColumnDefs.map((col, index) => (
              <TableRow key={index}>
                <TableCell>{col.field}</TableCell>
                <TableCell>{col.headerName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Draft Details</h2>
        <DraftDetailsGrid hedgeRequests={hedgeRequests || []} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Ad-Hoc Hedge Requests</h2>
        <HedgeRequestGrid hedgeRequests={hedgeRequests || []} />
      </div>
    </div>
  );
};

export default AdHocTab;