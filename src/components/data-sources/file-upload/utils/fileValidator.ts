
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  const allowedTypes = ['application/zip', 'text/plain', 'application/x-zip-compressed', 'text/csv'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only .txt files, .csv files, and zip archives containing .txt files are supported');
  }

  // Additional validation for file names
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.txt') && !fileName.endsWith('.zip') && !fileName.endsWith('.csv')) {
    throw new Error('File must have a .txt, .csv, or .zip extension');
  }
};
