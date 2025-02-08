
import { supabase } from "@/integrations/supabase/client";

export const processTextFile = async (content: string, filename: string) => {
  console.log(`[TextProcessor] Starting processing of: ${filename}`);
  console.log(`[TextProcessor] Content length: ${content.length} characters`);
  
  // Convert the text content to base64
  const base64Content = btoa(unescape(encodeURIComponent(content)));
  
  // Structure the metadata as a proper JSON object with strict typing
  const metadata = {
    fileName: filename,
    fileType: 'text/plain',
    size: content.length,
    uploadedAt: new Date().toISOString(),
    status: 'processing'
  };

  console.log('[TextProcessor] Sending request with metadata:', JSON.stringify(metadata, null, 2));
  
  try {
    const { data, error } = await supabase.functions.invoke('vector-operations', {
      body: {
        action: 'store',
        file: {
          name: filename,
          type: 'text/plain',
          size: content.length,
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
