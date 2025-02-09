
import { Card } from "@/components/ui/card";
import { DocumentGrid } from './vector-search/DocumentGrid';
import { DocumentSearch } from './vector-search/DocumentSearch';
import { useDocuments } from './vector-search/hooks/useDocuments';
import { useState } from 'react';

export function VectorSearch() {
  const { documents } = useDocuments();
  const [gridApi, setGridApi] = useState<any>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gridApi) {
      gridApi.setQuickFilter(e.target.value);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Document Search</h2>
        <div className="space-y-4">
          <DocumentSearch onSearch={handleSearch} />
          <DocumentGrid documents={documents} onGridReady={(api) => setGridApi(api)} />
        </div>
      </div>
    </Card>
  );
}
