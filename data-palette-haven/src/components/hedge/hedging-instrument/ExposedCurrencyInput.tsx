import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExposedCurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const ExposedCurrencyInput = ({ value, onChange }: ExposedCurrencyInputProps) => {
  return (
    <div className="space-y-2">
      <Label>Exposed Currency</Label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
};