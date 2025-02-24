import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HedgedItemDetailsSectionProps {
  formData: {
    hedgedItemType: string;
    probabilityAssessment: string;
    timePeriod: string;
    hedgedItemDescription: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
}

export const HedgedItemDetailsSection = ({
  formData,
  handleInputChange,
  errors
}: HedgedItemDetailsSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hedged Item Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label>Hedged Item Type</Label>
            <Select
              value={formData.hedgedItemType}
              onValueChange={(value) => handleInputChange('hedgedItemType', value)}
            >
              <SelectTrigger className={errors['hedgedItemType'] ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Forecasted Transaction">Forecasted Transaction</SelectItem>
                <SelectItem value="Firm Commitment">Firm Commitment</SelectItem>
                <SelectItem value="Recognized Asset">Recognized Asset</SelectItem>
                <SelectItem value="Recognized Liability">Recognized Liability</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Probability Assessment</Label>
            <Select
              value={formData.probabilityAssessment}
              onValueChange={(value) => handleInputChange('probabilityAssessment', value)}
            >
              <SelectTrigger className={errors['probabilityAssessment'] ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select probability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Highly Probable">Highly Probable</SelectItem>
                <SelectItem value="Probable">Probable</SelectItem>
                <SelectItem value="Possible">Possible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Time Period</Label>
            <Input
              value={formData.timePeriod}
              onChange={(e) => handleInputChange('timePeriod', e.target.value)}
              placeholder="e.g., 3 months"
              className={errors['timePeriod'] ? 'border-red-500' : ''}
            />
          </div>
        </div>
        <div className="mt-6">
          <Label>Description</Label>
          <Textarea
            value={formData.hedgedItemDescription}
            onChange={(e) => handleInputChange('hedgedItemDescription', e.target.value)}
            placeholder="Describe the hedged item..."
            className={`min-h-[100px] ${errors['hedgedItemDescription'] ? 'border-red-500' : ''}`}
          />
        </div>
      </CardContent>
    </Card>
  );
};