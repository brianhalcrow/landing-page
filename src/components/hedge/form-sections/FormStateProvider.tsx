import { createContext, useContext, useState } from 'react';
import { addMonths, format } from 'date-fns';

interface FormState {
  formData: any;
  setFormData: (data: any) => void;
  errors: Record<string, boolean>;
  setErrors: (errors: Record<string, boolean>) => void;
  monthLabels: string[];
  handleInputChange: (field: string, value: string | number) => void;
  handleMonthlyForecastChange: (index: number, value: string) => void;
  handleHedgeLayerChange: (index: number, value: string) => void;
  handleCoverageChange: (index: number, value: string) => void;
  handleRevenueChange: (index: number, value: string) => void;
  handleCostChange: (index: number, value: string) => void;
}

const FormContext = createContext<FormState | undefined>(undefined);

export const useFormState = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormState must be used within a FormStateProvider');
  }
  return context;
};

export const FormStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState({
    hedgeId: '',
    documentationDate: new Date().toISOString().split('T')[0],
    entityName: '',
    entityCurrency: '',
    hedgeEntityName: '',
    hedgeEntityCurrency: '',
    hedgeType: '',
    riskType: '',
    hedgedItem: '',
    exposedCurrency: '',
    layerNumber: 1,
    hedgeRatio: '',
    monthlyForecasts: Array(12).fill(''),
    hedgeLayerAmounts: Array(12).fill(''),
    cumulativeHedgeAmounts: Array(12).fill(''),
    cumulativeCoveragePercentages: Array(12).fill(''),
    coverageValues: Array(12).fill(''),
    objective: '',
    instrumentDescription: '',
    instrumentType: '',
    hedgedItemType: '',
    probabilityAssessment: '',
    timePeriod: '',
    hedgedItemDescription: '',
    prospectiveEffectiveness: '',
    testingMethod: '',
    effectivenessCriteria: '',
    forwardElement: '',
    basisSpreads: '',
    startDate: '',
    revenueAmounts: Array(12).fill(''),
    costAmounts: Array(12).fill(''),
  });

  const monthLabels = Array.from({ length: 12 }, (_, i) => {
    const date = addMonths(new Date(), i);
    return format(date, 'MMM yyyy');
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMonthlyForecastChange = (index: number, value: string) => {
    setFormData(prev => {
      const newForecasts = [...prev.monthlyForecasts];
      newForecasts[index] = value;
      return { ...prev, monthlyForecasts: newForecasts };
    });
  };

  const handleHedgeLayerChange = (index: number, value: string) => {
    setFormData(prev => {
      const newHedgeAmounts = [...prev.hedgeLayerAmounts];
      newHedgeAmounts[index] = value;
      return { ...prev, hedgeLayerAmounts: newHedgeAmounts };
    });
  };

  const handleCoverageChange = (index: number, value: string) => {
    setFormData(prev => {
      const newCoverageValues = [...prev.coverageValues];
      newCoverageValues[index] = value;
      return { ...prev, coverageValues: newCoverageValues };
    });
  };

  const handleRevenueChange = (index: number, value: string) => {
    setFormData(prev => {
      const newRevenueAmounts = [...prev.revenueAmounts];
      newRevenueAmounts[index] = value;
      return { ...prev, revenueAmounts: newRevenueAmounts };
    });
  };

  const handleCostChange = (index: number, value: string) => {
    setFormData(prev => {
      const newCostAmounts = [...prev.costAmounts];
      newCostAmounts[index] = value;
      return { ...prev, costAmounts: newCostAmounts };
    });
  };

  const value = {
    formData,
    setFormData,
    errors,
    setErrors,
    monthLabels,
    handleInputChange,
    handleMonthlyForecastChange,
    handleHedgeLayerChange,
    handleCoverageChange,
    handleRevenueChange,
    handleCostChange,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};