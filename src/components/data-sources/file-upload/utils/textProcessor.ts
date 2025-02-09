
import { supabase } from "@/integrations/supabase/client";

const sanitizeText = (text: string): string => {
  console.log('[TextProcessor] Starting text sanitization');
  const startLength = text.length;
  
  const sanitizedText = text
    // Remove common headers and footers
    .replace(/Confidential Treatment Requested By Lehman Brothers Holdings, Inc\./g, '')
    .replace(/LBEX-LL \d+/g, '')
    // Remove any line that's just page numbers
    .replace(/^\s*\d+\s*$/gm, '')
    // Remove lines that are just dates or timestamps
    .replace(/^\s*\d{1,2}\/\d{1,2}\/\d{2,4}\s*$/gm, '')
    // Remove lines with just reference numbers
    .replace(/^\s*Ref:\s*\d+\s*$/gm, '')
    // Remove multiple consecutive empty lines
    .replace(/\n{3,}/g, '\n\n')
    // Standardize newlines
    .replace(/\r\n/g, '\n')
    .trim();

  console.log(`[TextProcessor] Text sanitization completed:
    - Original length: ${startLength}
    - Final length: ${sanitizedText.length}
    - Characters removed: ${startLength - sanitizedText.length}
    - Headers removed: ${(text.match(/Confidential Treatment Requested/g) || []).length}
    - Reference numbers removed: ${(text.match(/LBEX-LL \d+/g) || []).length}`
  );
  
  return sanitizedText;
};

export const processTextFile = async (content: string, filename: string) => {
  console.log(`[TextProcessor] Starting processing of: ${filename}`);
  console.log(`[TextProcessor] Initial content length: ${content.length} characters`);
  
  // Sanitize text before encoding
  const sanitizedContent = sanitizeText(content);
  console.log('[TextProcessor] Content sanitized, converting to base64');
  
  // Convert the sanitized text content to base64
  const base64Content = btoa(unescape(encodeURIComponent(sanitizedContent)));
  
  // Structure the metadata
  const metadata = {
    fileName: filename,
    fileType: 'text/plain',
    size: content.length,
    uploadedAt: new Date().toISOString(),
    status: 'processing' as const,
    category: 'uncategorized',
    section: 'general',
    difficulty: 'beginner'
  };

  console.log('[TextProcessor] Sending request with metadata:', JSON.stringify(metadata, null, 2));
  
  try {
    const { data, error } = await supabase.functions.invoke('vector-operations', {
      body: {
        action: 'store',
        file: {
          name: filename,
          type: 'text/plain',
          size: sanitizedContent.length,
          content: base64Content
        },
        metadata: metadata
      }
    });

    if (error) {
      console.error('[TextProcessor] Error:', error);
      throw error;
    }
    
    console.log(`[TextProcessor] Successfully processed ${filename}`);
    return data;
  } catch (error) {
    console.error('[TextProcessor] Error processing file:', error);
    throw error;
  }
};
