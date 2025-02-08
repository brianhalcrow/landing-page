
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  // Allow .txt files and zip archives containing .txt files
  const allowedTypes = ['application/zip', 'text/plain', 'application/x-zip-compressed'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only .txt files and zip archives containing .txt files are supported');
  }
};
