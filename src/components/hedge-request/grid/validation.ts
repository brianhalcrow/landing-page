import { ValueSetterParams } from 'ag-grid-community';
import { toast } from "@/hooks/use-toast";

export const validateDate = (params: ValueSetterParams) => {
  const value = params.newValue;
  if (!value) return false;
  
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    toast({
      title: "Invalid Date",
      description: "Please enter a valid date in YYYY-MM-DD format",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const validateAmount = (params: ValueSetterParams) => {
  const value = Number(params.newValue);
  if (isNaN(value) || value <= 0) {
    toast({
      title: "Invalid Amount",
      description: "Amount must be a positive number",
      variant: "destructive"
    });
    return false;
  }
  return true;
};

export const validateBuySell = (params: ValueSetterParams) => {
  const value = params.newValue?.toUpperCase();
  if (!['BUY', 'SELL'].includes(value)) {
    toast({
      title: "Invalid Buy/Sell",
      description: "Value must be either BUY or SELL",
      variant: "destructive"
    });
    return false;
  }
  return true;
};