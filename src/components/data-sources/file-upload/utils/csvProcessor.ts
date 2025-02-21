
import Papa from 'papaparse';
import { processYoutubeUrl } from './youtubeProcessor';

export const processCsvFile = async (file: File, setProgress: (progress: number) => void): Promise<number> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: async (results) => {
        try {
          // Flatten all columns and rows into a single array and filter for valid URLs
          const urls = results.data
            .flat()
            .filter((value): value is string => 
              typeof value === 'string' && 
              value.trim() !== '' &&
              (value.includes('youtube.com') || value.includes('youtu.be'))
            );

          console.log('Found URLs in CSV:', urls.length);

          let processedCount = 0;
          for (const url of urls) {
            try {
              await processYoutubeUrl(url.trim());
              processedCount++;
              setProgress(Math.round((processedCount / urls.length) * 100));
            } catch (error) {
              console.warn(`Failed to process URL: ${url}`, error);
              // Continue processing other URLs even if one fails
            }
          }

          resolve(processedCount);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV file: ${error.message}`));
      }
    });
  });
};
