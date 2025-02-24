import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RiskManagementSectionProps {
  formData: {
    objective: string;
    strategy: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
}

export const RiskManagementSection = ({
  formData,
  handleInputChange,
  errors
}: RiskManagementSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Management Objective and Strategy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Objective</Label>
          <Textarea
            value={formData.objective}
            onChange={(e) => handleInputChange('objective', e.target.value)}
            placeholder="Describe the risk management objective..."
            className={`min-h-[100px] ${errors['objective'] ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label>Strategy</Label>
          <Textarea
            value={formData.strategy}
            onChange={(e) => handleInputChange('strategy', e.target.value)}
            placeholder="Describe the hedging strategy..."
            className={`min-h-[100px] ${errors['strategy'] ? 'border-red-500' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};