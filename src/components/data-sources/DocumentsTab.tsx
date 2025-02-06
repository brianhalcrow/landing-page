
import { DocumentUpload } from "../DocumentUpload";
import { VectorSearch } from "../VectorSearch";

const DocumentsTab = () => {
  return (
    <div className="space-y-6">
      <DocumentUpload />
      <VectorSearch />
    </div>
  );
};

export default DocumentsTab;
