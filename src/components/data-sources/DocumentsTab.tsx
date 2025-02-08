
import { DocumentUpload } from "../DocumentUpload";
import { VectorSearch } from "../VectorSearch";
import { RecategorizeDocuments } from "./RecategorizeDocuments";
import { useState } from "react";

const DocumentsTab = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <DocumentUpload onUploadSuccess={handleUploadSuccess} />
      <RecategorizeDocuments />
      <VectorSearch key={refreshTrigger} />
    </div>
  );
};

export default DocumentsTab;
