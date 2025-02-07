
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import { GridStyles } from "../hedge-request/grid/components/GridStyles";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from 'react';

const PAGE_SIZE = 100;

const GLTransactionsTab = () => {
  const [page, setPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['gl-transactions', page],
    queryFn: async () => {
      // First, get the count
      const { count, error: countError } = await supabase
        .from('erp_gl_transactions')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      if (count) setTotalRows(count);

      // Then get the paginated data
      const { data, error } = await supabase
        .from('erp_gl_transactions')
        .select('*')
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)
        .order('document_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const totalPages = Math.ceil(totalRows / PAGE_SIZE);

  const columnDefs: ColDef[] = [
    { 
      field: 'entity', 
      headerName: 'Entity',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'entity_id', 
      headerName: 'Entity ID',
      flex: 1,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'cost_centre', 
      headerName: 'Cost Centre',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'account_number', 
      headerName: 'Account Number',
      flex: 1,
      minWidth: 130,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'account_name', 
      headerName: 'Account Name',
      flex: 1.5,
      minWidth: 150,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'transaction_currency', 
      headerName: 'Currency',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'transaction_amount', 
      headerName: 'Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      type: 'numericColumn',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : '';
      }
    },
    { 
      field: 'base_amount', 
      headerName: 'Base Amount',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      type: 'numericColumn',
      valueFormatter: (params) => {
        return params.value ? params.value.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }) : '';
      }
    },
    { 
      field: 'document_date', 
      headerName: 'Document Date',
      flex: 1,
      minWidth: 120,
      headerClass: 'ag-header-center',
      valueFormatter: (params) => {
        return params.value ? new Date(params.value).toLocaleDateString() : '';
      }
    },
    { 
      field: 'period', 
      headerName: 'Period',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center'
    },
    { 
      field: 'year', 
      headerName: 'Year',
      flex: 0.8,
      minWidth: 100,
      headerClass: 'ag-header-center'
    }
  ];

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

      <div className="w-full h-[600px] ag-theme-alpine">
        <GridStyles />
        <AgGridReact
          rowData={transactions}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            suppressSizeToFit: false
          }}
          animateRows={true}
          suppressColumnVirtualisation={true}
          enableCellTextSelection={true}
          pagination={false}
          rowBuffer={10}
        />
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
            />
          </PaginationItem>
          
          {/* First page */}
          {page > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis */}
          {page > 3 && <PaginationItem>...</PaginationItem>}
          
          {/* Previous page */}
          {page > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page - 1)}>
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Current page */}
          <PaginationItem>
            <PaginationLink isActive>{page}</PaginationLink>
          </PaginationItem>
          
          {/* Next page */}
          {page < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(page + 1)}>
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis */}
          {page < totalPages - 2 && <PaginationItem>...</PaginationItem>}
          
          {/* Last page */}
          {page < totalPages - 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => setPage(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default GLTransactionsTab;
