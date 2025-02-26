
import { format, parse } from 'date-fns';

export const convertToDBDate = (mmYyDate: string | null | undefined): string | null => {
  if (!mmYyDate) return null;
  
  // Validate MM-YY format
  const isValidFormat = /^(0[1-9]|1[0-2])-\d{2}$/.test(mmYyDate);
  if (!isValidFormat) return null;

  try {
    // Parse MM-YY to Date (assuming 20xx for year)
    const [month, year] = mmYyDate.split('-');
    const fullYear = `20${year}`; // Assumes 21st century
    const date = parse(`${fullYear}-${month}-01`, 'yyyy-MM-dd', new Date());
    
    // Format as YYYY-MM-DD for database
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Date conversion error:', error);
    return null;
  }
};

export const convertToDisplayFormat = (dbDate: string | null | undefined): string => {
  if (!dbDate) return '';
  
  try {
    const date = parse(dbDate, 'yyyy-MM-dd', new Date());
    return format(date, 'MM-yy');
  } catch (error) {
    console.error('Display date conversion error:', error);
    return '';
  }
};

export const validateDateRange = (startDate: string | null | undefined, endDate: string | null | undefined): boolean => {
  if (!startDate) return true; // If no start date, validation passes
  
  const start = convertToDBDate(startDate);
  const end = convertToDBDate(endDate);
  
  if (!start || !end) return true; // If either date is invalid, let other validations handle it
  
  return start <= end;
};
