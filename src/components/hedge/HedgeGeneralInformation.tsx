import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HedgeGeneralInformationProps {
  formData: {
    hedgeId: string;
    documentationDate: string;
    entityName: string;
    entityCurrency: string;
    hedgeEntityName: string;
    hedgeEntityCurrency: string;
    hedgeType: string;
    riskType: string;
    exposedCurrency: string;
  };
  handleInputChange: (field: string, value: string) => void;
  errors: Record<string, boolean>;
  legalEntities?: { legal_entity_name: string; functional_currency: string; }[];
  currencyPairs?: { quote_currency: string; }[];
}

export const HedgeGeneralInformation = ({
  formData,
  handleInputChange,
  errors,
  legalEntities,
  currencyPairs,
}: HedgeGeneralInformationProps) => {
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">General Information</h2>
      <div className="grid grid-cols-9 gap-6">
        <div className="space-y-2">
          <Label htmlFor="entityName" className="text-base">Entity Name</Label>
          <Select
            value={formData.entityName}
            onValueChange={(value) => handleInputChange('entityName', value)}
          >
            <SelectTrigger className={`h-11 ${errors.entityName ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select entity" />
            </SelectTrigger>
            <SelectContent>
              {legalEntities?.map((entity) => (
                <SelectItem key={entity.legal_entity_name} value={entity.legal_entity_name}>
                  {entity.legal_entity_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hedgeId" className="text-base">Hedge ID</Label>
          <Input
            id="hedgeId"
            value={formData.hedgeId}
            onChange={(e) => handleInputChange('hedgeId', e.target.value)}
            list="existingHedgeIds"
            placeholder="Enter or select ID"
            className={`h-11 ${errors.hedgeId ? 'border-red-500' : ''}`}
          />
          <datalist id="existingHedgeIds">
            {/* Existing hedge IDs would be populated here */}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentationDate" className="text-base">Documentation Date</Label>
          <Input
            id="documentationDate"
            type="date"
            value={formData.documentationDate}
            onChange={(e) => handleInputChange('documentationDate', e.target.value)}
            className={`h-11 ${errors.documentationDate ? 'border-red-500' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="riskType" className="text-base">Risk Type</Label>
          <Select
            value={formData.riskType}
            onValueChange={(value) => handleInputChange('riskType', value)}
          >
            <SelectTrigger className={`h-11 ${errors.riskType ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select risk type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fx">FX Risk</SelectItem>
              <SelectItem value="ir">Interest Rate Risk</SelectItem>
              <SelectItem value="commodity">Commodity Risk</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hedgeType" className="text-base">Hedge Type</Label>
          <Select
            value={formData.hedgeType}
            onValueChange={(value) => handleInputChange('hedgeType', value)}
          >
            <SelectTrigger className={`h-11 ${errors.hedgeType ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select hedge type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fair-value">Fair Value</SelectItem>
              <SelectItem value="cash-flow">Cash Flow</SelectItem>
              <SelectItem value="net-investment">Net Investment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hedgeEntityName" className="text-base">Hedging Entity Name</Label>
          <Select
            value={formData.hedgeEntityName}
            onValueChange={(value) => handleInputChange('hedgeEntityName', value)}
          >
            <SelectTrigger className={`h-11 ${errors.hedgeEntityName ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select hedging entity" />
            </SelectTrigger>
            <SelectContent>
              {legalEntities?.map((entity) => (
                <SelectItem key={entity.legal_entity_name} value={entity.legal_entity_name}>
                  {entity.legal_entity_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entityCurrency" className="text-base">Entity Currency</Label>
          <Input
            id="entityCurrency"
            value={formData.entityCurrency}
            disabled
            className="h-11 bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exposedCurrency" className="text-base">Exposed Currency</Label>
          <Select
            value={formData.exposedCurrency}
            onValueChange={(value) => handleInputChange('exposedCurrency', value)}
          >
            <SelectTrigger className={`h-11 ${errors.exposedCurrency ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyPairs?.map((pair) => (
                <SelectItem key={pair.quote_currency} value={pair.quote_currency}>
                  {pair.quote_currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="hedgeEntityCurrency" className="text-base">Hedge Entity Currency</Label>
          <Input
            id="hedgeEntityCurrency"
            value={formData.hedgeEntityCurrency}
            disabled
            className="h-11 bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};
