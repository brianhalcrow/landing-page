import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RiskManagementProps {
  formData: {
    objective: string;
    strategy: string;
    instrumentDescription: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
}

export const RiskManagement = ({
  formData,
  handleInputChange,
  errors
}: RiskManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Objective</Label>
          <Textarea
            value={formData.objective}
            onChange={(e) => handleInputChange('objective', e.target.value)}
            className={`min-h-[100px] ${errors['objective'] ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label>Strategy</Label>
          <Textarea
            value={formData.strategy}
            onChange={(e) => handleInputChange('strategy', e.target.value)}
            className={`min-h-[100px] ${errors['strategy'] ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label>Instrument Description</Label>
          <Textarea
            value={formData.instrumentDescription}
            onChange={(e) => handleInputChange('instrumentDescription', e.target.value)}
            className={`min-h-[100px] ${errors['instrumentDescription'] ? 'border-red-500' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};