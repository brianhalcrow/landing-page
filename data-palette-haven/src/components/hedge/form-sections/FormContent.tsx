import { HedgeGeneralInformation } from '@/components/hedge/HedgeGeneralInformation';
import { DescriptionSection } from '@/components/hedge/sections/DescriptionSection';
import { HedgedItemDetailsSection } from '@/components/hedge/sections/HedgedItemDetailsSection';
import { HedgingInstrument } from '@/components/hedge/HedgingInstrument';
import { HedgedItem } from '@/components/hedge/HedgedItem';
import { HedgeEffectiveness } from '@/components/hedge/HedgeEffectiveness';
import { useFormState } from './FormStateProvider';

export const FormContent = () => {
  const {
    formData,
    errors,
    monthLabels,
    handleInputChange,
    handleMonthlyForecastChange,
    handleHedgeLayerChange,
    handleCoverageChange,
    handleRevenueChange,
    handleCostChange,
  } = useFormState();

  return (
    <>
      <HedgeGeneralInformation
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
      />
      <DescriptionSection
        objective={formData.objective}
        handleInputChange={handleInputChange}
        errors={errors}
      />
      <HedgedItemDetailsSection
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
      />
      <HedgingInstrument
        formData={formData}
        handleInputChange={handleInputChange}
      />
      <HedgedItem
        formData={formData}
        monthLabels={monthLabels}
        handleMonthlyForecastChange={handleMonthlyForecastChange}
        handleHedgeLayerChange={handleHedgeLayerChange}
        handleCoverageChange={handleCoverageChange}
        handleInputChange={handleInputChange}
        handleRevenueChange={handleRevenueChange}
        handleCostChange={handleCostChange}
        errors={errors}
      />
      <HedgeEffectiveness
        formData={formData}
        handleInputChange={handleInputChange}
        errors={errors}
      />
    </>
  );
};