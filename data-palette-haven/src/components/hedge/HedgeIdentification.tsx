import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HedgeIdentificationProps {
  formData: {
    hedgeId: string;
    documentationDate: string;
    entityName: string;
    hedgeType: string;
  };
  existingHedgeIds: string[];
  handleInputChange: (field: string, value: string) => void;
}

export const HedgeIdentification = ({ 
  formData, 
  existingHedgeIds, 
  handleInputChange 
}: HedgeIdentificationProps) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Hedge Identification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Hedge Type</Label>
          <select
            value={formData.hedgeType}
            onChange={(e) => handleInputChange('hedgeType', e.target.value)}
            className="w-full p-2 border rounded h-9"
            required
          >
            <option value="">Select Type</option>
            <option value="CASH_FLOW">Cash Flow Hedge</option>
            <option value="FAIR_VALUE">Fair Value Hedge</option>
            <option value="NET_INVESTMENT">Net Investment Hedge</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Hedge ID</Label>
            <Input
              type="text"
              value={formData.hedgeId}
              onChange={(e) => handleInputChange('hedgeId', e.target.value)}
              list="hedgeIds"
              placeholder="Enter or select ID"
            />
            <datalist id="hedgeIds">
              {existingHedgeIds.map((id) => (
                <option key={id} value={id} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label>Documentation Date</Label>
            <Input
              type="date"
              value={formData.documentationDate}
              className="bg-gray-100"
              readOnly
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label>Entity Name</Label>
            <Input
              type="text"
              value={formData.entityName}
              onChange={(e) => handleInputChange('entityName', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Entity Currency</Label>
            <Input
              type="text"
              placeholder="Functional Currency"
              onChange={(e) => handleInputChange('entityCurrency', e.target.value)}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};