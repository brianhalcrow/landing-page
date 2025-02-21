
import { validateFile } from './utils/fileValidator';
import { processTextFile } from './utils/textProcessor';
import { processZipFile } from './utils/zipProcessor';

export class FileProcessor {
  static validateFile = validateFile;
  static processTextFile = processTextFile;
  static processZipFile = processZipFile;
}
