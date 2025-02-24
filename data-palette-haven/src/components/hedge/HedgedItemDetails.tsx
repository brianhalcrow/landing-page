import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface HedgedItemDetailsProps {
  formData: {
    hedgedItemType: string;
    probabilityAssessment: string;
    timePeriod: string;
    hedgedItemDescription: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
}

export const HedgedItemDetails = ({
  formData,
  handleInputChange,
  errors
}: HedgedItemDetailsProps) => {
  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm mt-2">
      <h2 className="text-xl font-semibold">Hedged Item Details</h2>
      <div className="grid grid-cols-9 gap-4">
        <div className="col-span-3 space-y-2">
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
        <div className="col-span-3 space-y-2">
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
        <div className="col-span-3 space-y-2">
          <Label>Time Period</Label>
          <Input
            value={formData.timePeriod}
            onChange={(e) => handleInputChange('timePeriod', e.target.value)}
            placeholder="e.g., 3 months"
            className={errors['timePeriod'] ? 'border-red-500' : ''}
          />
        </div>
      </div>
      <div className="mt-4">
        <Label>Description</Label>
        <Textarea
          value={formData.hedgedItemDescription}
          onChange={(e) => handleInputChange('hedgedItemDescription', e.target.value)}
          placeholder="Describe the hedged item..."
          className={`min-h-[100px] ${errors['hedgedItemDescription'] ? 'border-red-500' : ''}`}
        />
      </div>
    </div>
  );
};