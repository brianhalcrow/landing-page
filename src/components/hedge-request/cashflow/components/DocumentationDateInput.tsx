
import { Input } from "@/components/ui/input";

interface DocumentationDateInputProps {
  documentDate: string;
  onDateChange: (value: string) => void;
}

export const DocumentationDateInput = ({
  documentDate,
  onDateChange
}: DocumentationDateInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Documentation Date</label>
      <Input 
        type="date" 
        value={documentDate}
        onChange={(e) => onDateChange(e.target.value)}
      />
    </div>
  );
};
