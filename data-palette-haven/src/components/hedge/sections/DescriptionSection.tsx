import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionSectionProps {
  objective: string;
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
}

export const DescriptionSection = ({
  objective,
  handleInputChange,
  errors
}: DescriptionSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Management Objective and Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Description</Label>
          <Textarea
            value={objective}
            onChange={(e) => handleInputChange('objective', e.target.value)}
            placeholder="Describe the Risk management objective and strategy..."
            className={`min-h-[100px] ${errors['objective'] ? 'border-red-500' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};