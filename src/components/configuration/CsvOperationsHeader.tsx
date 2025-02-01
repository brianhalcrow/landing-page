import { CsvOperations } from "./CsvOperations";

interface CsvOperationsHeaderProps {
  onUploadComplete?: (updatedIds: string[]) => void;
}

const CsvOperationsHeader = ({ onUploadComplete }: CsvOperationsHeaderProps) => {
  return (
    <div className="flex justify-end p-4 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <CsvOperations onUploadComplete={onUploadComplete} />
    </div>
  );
};

export default CsvOperationsHeader;