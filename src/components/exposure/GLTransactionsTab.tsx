
import { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import GLTransactionsGrid from './gl-transactions/GLTransactionsGrid';
import GLTransactionsPagination from './gl-transactions/GLTransactionsPagination';
import { useGLTransactions, PAGE_SIZE } from './gl-transactions/useGLTransactions';

const GLTransactionsTab = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGLTransactions(page);
  
  const totalRows = data?.totalRows || 0;
  const totalPages = Math.ceil(totalRows / PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[600px] w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <div className="text-sm text-muted-foreground">
          Showing rows {((page - 1) * PAGE_SIZE) + 1} - {Math.min(page * PAGE_SIZE, totalRows)} of {totalRows}
        </div>
      </div>

      <GLTransactionsGrid transactions={data?.transactions || []} />

      <GLTransactionsPagination
        page={page}
        totalPages={totalPages}
        totalRows={totalRows}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
};

export default GLTransactionsTab;
