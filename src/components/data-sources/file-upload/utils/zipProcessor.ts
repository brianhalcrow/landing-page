
import JSZip from 'jszip';
import { processTextFile } from './textProcessor';

export const processZipFile = async (file: File, onProgress: (progress: number) => void) => {
  console.log('[ZipProcessor] Starting zip file processing:', file.name);
  
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);
  
  // Log all files in the zip for debugging
  console.log('[ZipProcessor] Files in zip:', Object.keys(zipContent.files));
  
  const textFiles = Object.values(zipContent.files).filter(zipEntry => {
    // Ignore directories
    if (zipEntry.dir) {
      return false;
    }
    
    const fileName = zipEntry.name.toLowerCase();
    // Check for .txt extension and handle potential path separators
    const isTxtFile = fileName.split('/').pop()?.endsWith('.txt') || false;
    
    console.log(`[ZipProcessor] Checking file: ${zipEntry.name}, isTxtFile: ${isTxtFile}`);
    return isTxtFile;
  });

  if (textFiles.length === 0) {
    console.error('[ZipProcessor] No text files found in zip archive');
    const filesFound = Object.keys(zipContent.files).join(', ');
    throw new Error(`No text files found in the zip archive. Files found: ${filesFound}`);
  }

  console.log(`[ZipProcessor] Found ${textFiles.length} text files in zip archive`);
  let processedFiles = 0;
  
  for (const zipEntry of textFiles) {
    try {
      console.log(`[ZipProcessor] Processing file: ${zipEntry.name}`);
      const content = await zipEntry.async('string');
      await processTextFile(content, zipEntry.name);
      processedFiles++;
      onProgress((processedFiles / textFiles.length) * 100);
    } catch (error) {
      console.error(`[ZipProcessor] Error processing ${zipEntry.name}:`, error);
      throw error;
    }
  }

  console.log(`[ZipProcessor] Successfully processed ${processedFiles} files`);
  return processedFiles;
};
