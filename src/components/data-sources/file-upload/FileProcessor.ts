
import { validateFile } from './utils/fileValidator';
import { processTextFile } from './utils/textProcessor';
import { processZipFile } from './utils/zipProcessor';
import { processYoutubeUrl } from './utils/youtubeProcessor';
import { processCsvFile } from './utils/csvProcessor';

export class FileProcessor {
  static validateFile = validateFile;
  static processTextFile = processTextFile;
  static processZipFile = processZipFile;
  static processYoutubeUrl = processYoutubeUrl;
  static processCsvFile = processCsvFile;
}
