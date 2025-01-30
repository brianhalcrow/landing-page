import { Button } from "@/components/ui/button";
import CsvUploader from "../csv/CsvUploader";
import CsvDownloader from "../csv/CsvDownloader";

interface CsvOperationsProps {
  onUploadComplete: (updatedEntityIds: string[]) => void;
}

const CsvOperations = ({ onUploadComplete }: CsvOperationsProps) => {
  return (
    <div className="flex gap-4 items-center">
      <CsvUploader onUploadComplete={onUploadComplete} />
      <CsvDownloader />
    </div>
  );
};

export default CsvOperations;