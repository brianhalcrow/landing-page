
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
  }
  
  const allowedTypes = [
    'application/zip', 
    'text/plain', 
    'application/x-zip-compressed',
    'application/msword',                // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only .txt, .doc, .docx files and zip archives containing these files are supported');
  }

  // Additional validation for file names
  const fileName = file.name.toLowerCase();
  if (!fileName.endsWith('.txt') && 
      !fileName.endsWith('.zip') && 
      !fileName.endsWith('.doc') && 
      !fileName.endsWith('.docx')) {
    throw new Error('File must have a .txt, .doc, .docx or .zip extension');
  }
};
