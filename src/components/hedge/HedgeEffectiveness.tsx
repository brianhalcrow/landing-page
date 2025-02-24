import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HedgeEffectivenessProps {
  formData: {
    prospectiveEffectiveness: string;
    testingMethod: string;
    effectivenessCriteria: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
}

export const HedgeEffectiveness = ({
  formData,
  handleInputChange,
  errors
}: HedgeEffectivenessProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hedge Effectiveness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Prospective Effectiveness</Label>
          <Textarea
            value={formData.prospectiveEffectiveness}
            onChange={(e) => handleInputChange('prospectiveEffectiveness', e.target.value)}
            className={`min-h-[100px] ${errors['prospectiveEffectiveness'] ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label>Testing Method</Label>
          <Textarea
            value={formData.testingMethod}
            onChange={(e) => handleInputChange('testingMethod', e.target.value)}
            className={`min-h-[100px] ${errors['testingMethod'] ? 'border-red-500' : ''}`}
          />
        </div>
        <div>
          <Label>Criteria for Effectiveness</Label>
          <Textarea
            value={formData.effectivenessCriteria}
            onChange={(e) => handleInputChange('effectivenessCriteria', e.target.value)}
            className={`min-h-[100px] ${errors['effectivenessCriteria'] ? 'border-red-500' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};