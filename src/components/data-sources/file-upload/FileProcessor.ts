
import { supabase } from "@/integrations/supabase/client";
import JSZip from 'jszip';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export class FileProcessor {
  static validateFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }
    
    // Only allow .txt files and zip archives containing .txt files
    const allowedTypes = ['application/zip', 'text/plain', 'application/x-zip-compressed'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only .txt files and zip archives containing .txt files are supported');
    }
  }

  static async processTextFile(content: string, filename: string) {
    console.log(`Processing text file: ${filename}, length: ${content.length}`);
    
    // Convert the text content to base64
    const base64Content = btoa(unescape(encodeURIComponent(content)));
    
    const { data, error } = await supabase.functions.invoke('vector-operations', {
      body: {
        action: 'store',
        file: {
          name: filename,
          type: 'text/plain',
          size: content.length,
          content: base64Content
        },
        metadata: { 
          filename: filename,
          fileType: 'text/plain',
          size: content.length,
          uploadedAt: new Date().toISOString(),
          status: 'processing'
        }
      }
    });

    if (error) throw error;
    return data;
  }

  static async processZipFile(file: File, onProgress: (progress: number) => void) {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(file);
    const textFiles = Object.values(zipContent.files).filter(
      zipEntry => !zipEntry.dir && zipEntry.name.toLowerCase().endsWith('.txt')
    );

    if (textFiles.length === 0) {
      throw new Error('No text files found in the zip archive');
    }

    let processedFiles = 0;
    for (const zipEntry of textFiles) {
      const content = await zipEntry.async('string');
      await this.processTextFile(content, zipEntry.name);
      processedFiles++;
      onProgress((processedFiles / textFiles.length) * 100);
    }

    return processedFiles;
  }
}
