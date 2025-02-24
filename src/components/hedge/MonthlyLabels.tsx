import { Label } from "@/components/ui/label";

interface MonthlyLabelsProps {
  monthLabels: string[];
}

export const MonthlyLabels = ({ monthLabels }: MonthlyLabelsProps) => {
  return (
    <div className="grid grid-cols-[200px_repeat(12,minmax(60px,1fr))] gap-1">
      <div></div>
      {monthLabels.map((label, index) => (
        <Label key={index} className="text-sm font-medium text-center">
          {label}
        </Label>
      ))}
    </div>
  );
};