
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { GLTransactionsPaginationProps } from "./types";

const GLTransactionsPagination = ({ 
  page, 
  totalPages, 
  totalRows, 
  pageSize,
  onPageChange 
}: GLTransactionsPaginationProps) => {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => page > 1 && onPageChange(page - 1)}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {/* First page */}
        {page > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(1)}>1</PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis */}
        {page > 3 && <PaginationItem>...</PaginationItem>}
        
        {/* Previous page */}
        {page > 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(page - 1)}>
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
            <PaginationLink onClick={() => onPageChange(page + 1)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        )}
        
        {/* Ellipsis */}
        {page < totalPages - 2 && <PaginationItem>...</PaginationItem>}
        
        {/* Last page */}
        {page < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext 
            onClick={() => page < totalPages && onPageChange(page + 1)}
            className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default GLTransactionsPagination;
