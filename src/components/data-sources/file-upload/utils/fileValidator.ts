
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  const fileName = file.name.toLowerCase();
  console.log('Validating file:', { name: fileName, type: file.type });
  
  // Some systems might send different MIME types for CSV files
  const isCsv = fileName.endsWith('.csv');  // Only check file extension for CSV
  const isText = fileName.endsWith('.txt') || file.type === 'text/plain';
  const isZip = fileName.endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed';

  if (!isCsv && !isText && !isZip) {
    throw new Error('Only .txt files, .csv files, and zip archives containing .txt files are supported');
  }

  // Log the validation result
  console.log('File validation result:', { isCsv, isText, isZip });
};
