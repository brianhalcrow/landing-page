import { useEffect, useState } from 'react';

const useFormValidation = (fromCurrency, toCurrency, amount) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(fromCurrency && toCurrency && fromCurrency !== toCurrency && amount > 0);
  }, [fromCurrency, toCurrency, amount]);

  return isFormValid;
};

export default useFormValidation;
