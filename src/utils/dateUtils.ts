import { parse, format, isValid } from 'date-fns';

export const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;

  // Try parsing as ISO date first (YYYY-MM-DD)
  let date = new Date(dateStr);
  if (isValid(date)) {
    return date;
  }

  // Try parsing DD/MM/YYYY format
  date = parse(dateStr, 'dd/MM/yyyy', new Date());
  if (isValid(date)) {
    return date;
  }

  return null;
};

export const formatDateForDisplay = (dateStr: string | null): string => {
  if (!dateStr) return '';
  
  const date = parseDate(dateStr);
  if (!date) return '';
  
  return format(date, 'dd/MM/yyyy');
};

export const formatDateForDB = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  
  const date = parseDate(dateStr);
  if (!date) return null;
  
  return format(date, 'yyyy-MM-dd');
};