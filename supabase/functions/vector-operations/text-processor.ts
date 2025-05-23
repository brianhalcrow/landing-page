import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';
import { FileMetadata } from './types.ts';

export const CHUNK_SIZE = 400;
export const CHUNK_OVERLAP = 50;
export const MIN_CHUNK_LENGTH = 50;

async function analyzeContent(text: string): Promise<Partial<FileMetadata>> {
  // Initial attempt to analyze with AI, but return null values if it fails
  try {
    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    }));

    const response = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Analyze the following text and categorize it. Respond only in JSON format with these fields:
            - category: One of [forex, trading, risk_management, market_analysis, technical_analysis, uncategorized]
            - section: One of [theory, practice, case_study, reference, general]
            - difficulty: One of [beginner, intermediate, advanced, expert]
            Base this on the technical complexity and prerequisites needed to understand the content.`
        },
        {
          role: "user",
          content: text.slice(0, 1000) // Analyze first 1000 chars for efficiency
        }
      ],
      temperature: 0.1 // Low temperature for more consistent results
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    console.log('[TextProcessor] Content analysis result:', result);
    return result;
  } catch (error) {
    console.error('[TextProcessor] Error analyzing content:', error);
    // Return null values to allow recategorization later
    return {
      category: null,
      section: null,
      difficulty: null
    };
  }
}

function formatFinancialText(text: string): string {
  console.log('[TextProcessor] Starting text formatting');
  const startLength = text.length;
  
  // Log a sample of the input text for debugging
  console.log('[TextProcessor] Input text sample:', text.slice(0, 200));
  
  const formattedText = text
    // Remove document headers with more comprehensive patterns
    .replace(/(?:Confidential\s+Treatment\s+Requested\s+(?:By\s+)?(?:Lehman\s+Brothers\s+Holdings,?\s+Inc\.?)?)/gi, '')
    .replace(/(?:LBEX[-\s]*LL\s*\d+)/gi, '')
    .replace(/(?:Page\s+\d+\s+of\s+\d+)/gi, '')
    .replace(/(?:Document\s+ID:\s*[A-Z0-9-]+)/gi, '')
    // Remove "Source: Lehman Live" and similar headers (including right-aligned)
    .replace(/^.*(?:Source:\s*(?:Lehman\s+Live|LehmanLive)).*$/gim, '')
    .replace(/^.*(?:Lehman\s+Live\s*:\s*Source).*$/gim, '')
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
    // Remove any line that consists primarily of special characters (headers/footers often do)
    .replace(/^[\s\-_=\*]{3,}[\s\-_=\*]*$/gm, '')
    // Remove lines that are just single words commonly used in headers/footers
    .replace(/^\s*(?:confidential|draft|private|internal)\s*$/gim, '')
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

  // Log a sample of the output text for verification
  console.log('[TextProcessor] Output text sample:', formattedText.slice(0, 200));
  
  console.log(`[TextProcessor] Text formatting completed:
    - Original length: ${startLength}
    - Final length: ${formattedText.length}
    - Characters processed: ${startLength - formattedText.length}
    - Headers/footers removed: ${(text.match(/Confidential Treatment Requested/gi) || []).length}
    - Reference numbers removed: ${(text.match(/LBEX[-\s]*LL\s*\d+/gi) || []).length}
    - Source headers removed: ${(text.match(/Source:\s*(?:Lehman\s+Live|LehmanLive)/gi) || []).length}`
  );
  
  return formattedText;
}

export async function processFileContent(base64Content: string, fileType: string): Promise<{ text: string; metadata: Partial<FileMetadata> }> {
  try {
    console.log('[TextProcessor] Processing file content');
    
    if (fileType !== 'text/plain') {
      throw new Error('Only text/plain files are currently supported');
    }

    // Decode base64 content
    let text: string;
    try {
      text = decodeURIComponent(escape(atob(base64Content)));
      console.log('[TextProcessor] Successfully decoded base64 content');
    } catch (error) {
      console.error('[TextProcessor] Error decoding base64 content:', error);
      throw new Error('Failed to decode file content');
    }

    // Validate decoded text
    if (!text || text.trim().length === 0) {
      throw new Error('Decoded content is empty');
    }

    console.log(`[TextProcessor] Decoded text length: ${text.length}`);
    
    const formattedText = formatFinancialText(text);
    
    // Validate formatted text
    if (!formattedText || formattedText.trim().length === 0) {
      console.error('[TextProcessor] Formatting resulted in empty content');
      throw new Error('Formatting resulted in empty content');
    }
    
    // Explicitly set metadata fields
    const metadata: Partial<FileMetadata> = {
      category: null,
      section: null,
      difficulty: null
    };

    console.log('[TextProcessor] File content processed successfully with metadata:', metadata);
    
    return {
      text: formattedText,
      metadata
    };
  } catch (error) {
    console.error('[TextProcessor] Error processing file content:', error);
    throw error;
  }
}
