import { Label } from "@/components/ui/label";

interface ForwardElementSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ForwardElementSelect = ({ value, onChange }: ForwardElementSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Forward Element Designation</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded h-9"
        required
      >
        <option value="">Select Designation</option>
        <option value="included">Included in hedge designation</option>
        <option value="excluded_pnl">Excluded from hedge designation and recognised in P&L</option>
        <option value="excluded_oci">Excluded from hedge designation and deferred in OCI</option>
        <option value="na">NA</option>
      </select>
    </div>
  );
};