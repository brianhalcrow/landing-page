import { Label } from "@/components/ui/label";

interface BasisSpreadsSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const BasisSpreadsSelect = ({ value, onChange }: BasisSpreadsSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Foreign Currency Basis Spreads</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded h-9"
        required
      >
        <option value="">Select Option</option>
        <option value="included">Included in hedge designation</option>
        <option value="excluded_pnl">Excluded from hedge designation and recognised in P&L</option>
        <option value="excluded_oci">Excluded from hedge designation and deferred in OCI</option>
        <option value="na">NA</option>
      </select>
    </div>
  );
};