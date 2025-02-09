
import { Input } from "@/components/ui/input";

interface DocumentSearchProps {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DocumentSearch({ onSearch }: DocumentSearchProps) {
  return (
    <Input
      type="text"
      placeholder="Search documents by content, filename, category..."
      onChange={onSearch}
      className="w-full"
    />
  );
}
