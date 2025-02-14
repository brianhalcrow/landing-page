import { useEffect, useState } from 'react';

const useFormValidation = (amount) => {
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setIsFormValid(amount > 0);
  }, [amount]);

  return isFormValid;
};

export default useFormValidation;
