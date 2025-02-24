import { Label } from "@/components/ui/label";

interface HedgeTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const HedgeTypeSelect = ({ value, onChange }: HedgeTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Instrument Type</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded h-9"
        required
      >
        <option value="">Select Type</option>
        <option value="FORWARD">Forward Contract</option>
        <option value="SWAP">Swap</option>
        <option value="OPTION">Option</option>
      </select>
    </div>
  );
};