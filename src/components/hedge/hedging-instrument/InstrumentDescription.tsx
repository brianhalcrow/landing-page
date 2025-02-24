import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InstrumentDescriptionProps {
  value: string;
  onChange: (value: string) => void;
}

export const InstrumentDescription = ({ value, onChange }: InstrumentDescriptionProps) => {
  return (
    <div className="space-y-2">
      <Label>Instrument Description</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
        placeholder="Enter instrument description..."
        required
      />
    </div>
  );
};