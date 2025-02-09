import { supabase } from "@/integrations/supabase/client";

const sanitizeText = (text: string): string => {
  console.log('[TextProcessor] Starting text sanitization');
  const startLength = text.length;
  
  const sanitizedText = text
    // Remove document headers with more comprehensive patterns
    .replace(/(?:Confidential\s+Treatment\s+Requested\s+(?:By\s+)?(?:Lehman\s+Brothers\s+Holdings,?\s+Inc\.?)?)/gi, '')
    .replace(/(?:LBEX[-\s]*LL\s*\d+)/gi, '')
    .replace(/(?:Page\s+\d+\s+of\s+\d+)/gi, '')
    .replace(/(?:Document\s+ID:\s*[A-Z0-9-]+)/gi, '')
    // Remove header/footer separator lines
    .replace(/^[_\-=]{3,}$/gm, '')
    .replace(/^[\s_\-=]*Confidential[\s_\-=]*$/gm, '')
    // Remove timestamp patterns
    .replace(/\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?/gi, '')
    // Remove date patterns (various formats)
    .replace(/(?:\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})/g, '')
    // Remove page numbers
    .replace(/^\s*(?:\d+|\(\d+\)|\[\d+\])\s*$/gm, '')
    // Remove reference numbers
    .replace(/^\s*(?:Ref(?:erence)?:?\s*\d+|#\d+)\s*$/gim, '')
    // Remove multiple consecutive empty lines
    .replace(/\n{3,}/g, '\n\n')
    // Standardize newlines
    .replace(/\r\n/g, '\n')
    // Remove multiple spaces
    .replace(/[ ]{2,}/g, ' ')
    // Clean up any remaining headers that might appear at the start of lines
    .replace(/^.*(?:Confidential\s+Treatment|LBEX[-\s]*LL).*$\n?/gim, '')
    // Remove any leftover page indicators
    .replace(/^\s*Page\s+\d+\s*$/gim, '')
    // Final cleanup of whitespace
    .replace(/^\s+|\s+$/gm, '')
    .trim();

  console.log(`[TextProcessor] Text sanitization completed:
    - Original length: ${startLength}
    - Final length: ${sanitizedText.length}
    - Characters removed: ${startLength - sanitizedText.length}
    - Headers removed: ${(text.match(/Confidential Treatment Requested/gi) || []).length}
    - Reference numbers removed: ${(text.match(/LBEX[-\s]*LL\s*\d+/gi) || []).length}`
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
