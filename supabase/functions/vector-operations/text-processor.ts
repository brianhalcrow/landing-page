
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
  
  const formattedText = text
    // Standardize newlines
    .replace(/\r\n/g, '\n')
    // Remove multiple spaces
    .replace(/[ ]{2,}/g, ' ')
    // Fix common OCR/formatting issues with numbers and symbols
    .replace(/(\d)\s+\./g, '$1.')
    .replace(/(\d)\s+%/g, '$1%')
    .replace(/\$\s+(\d)/g, '$$$1')
    // Ensure mathematical operations have consistent spacing
    .replace(/(\d)\s*([+\-=@])\s*(\d)/g, '$1 $2 $3')
    // Ensure currency codes have proper spacing
    .replace(/(USD|GBP|EUR|CHF|JPY)\s*(\d)/g, '$1 $2')
    // Separate sections with double newlines
    .replace(/\n{3,}/g, '\n\n')
    // Ensure examples and their explanations stay together
    .replace(/Example(\s+\d+)?:/g, '\n\nExample$1:\n')
    .replace(/Analysis:/g, '\n\nAnalysis:\n')
    .replace(/Result:/g, '\n\nResult:\n')
    .trim();

  console.log(`[TextProcessor] Text formatting completed:
    - Original length: ${startLength}
    - Final length: ${formattedText.length}
    - Characters processed: ${startLength - formattedText.length}`
  );
  
  return formattedText;
}

export async function processFileContent(base64Content: string, fileType: string): Promise<{ text: string; metadata: Partial<FileMetadata> }> {
  try {
    console.log('[TextProcessor] Processing file content');
    
    if (fileType !== 'text/plain') {
      throw new Error('Only text/plain files are currently supported');
    }

    const text = atob(base64Content);
    const formattedText = formatFinancialText(text);
    
    // Explicitly set metadata fields to null
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
