
import { validateFile } from './utils/fileValidator';
import { processTextFile } from './utils/textProcessor';
import { processZipFile } from './utils/zipProcessor';
import { processDocFile } from './utils/docProcessor';

export class FileProcessor {
  static validateFile = validateFile;
  static processTextFile = processTextFile;
  static processZipFile = processZipFile;
  static processDocFile = processDocFile;
}
