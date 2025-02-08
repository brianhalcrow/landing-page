
import JSZip from 'jszip';
import { processTextFile } from './textProcessor';

export const processZipFile = async (file: File, onProgress: (progress: number) => void) => {
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);
  const textFiles = Object.values(zipContent.files).filter(
    zipEntry => !zipEntry.dir && zipEntry.name.toLowerCase().endsWith('.txt')
  );

  if (textFiles.length === 0) {
    throw new Error('No text files found in the zip archive');
  }

  console.log(`[ZipProcessor] Processing ${textFiles.length} files from zip archive`);
  let processedFiles = 0;
  
  for (const zipEntry of textFiles) {
    const content = await zipEntry.async('string');
    await processTextFile(content, zipEntry.name);
    processedFiles++;
    onProgress((processedFiles / textFiles.length) * 100);
  }

  return processedFiles;
};
