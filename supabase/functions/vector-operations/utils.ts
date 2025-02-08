
import { RequestBody, FileMetadata } from './types.ts';

export const BATCH_SIZE = 5;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createErrorResponse = (error: Error, status = 500) => {
  const errorMessage = error.message || 'An unknown error occurred';
  console.error('Error details:', errorMessage);
  
  return new Response(
    JSON.stringify({ 
      error: errorMessage,
      details: 'If this error persists, try reducing the size of your document or processing it in smaller parts.'
    }),
    { 
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

export const validateRequestBody = async (req: Request): Promise<RequestBody> => {
  try {
    const body = await req.json();
    console.log('Raw request body:', JSON.stringify(body, null, 2));
    
    if (!body.action) {
      throw new Error('Action is required');
    }

    // Validate file object for store action
    if (body.action === 'store') {
      if (!body.file?.content || !body.file?.name) {
        throw new Error('File content and name are required for store action');
      }

      // Create a sanitized metadata object with required fields
      const metadata: FileMetadata = {
        fileName: body.file.name,
        fileType: body.file.type || 'text/plain',
        size: body.file.size || body.file.content.length,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
        category: body.metadata?.category || 'uncategorized',
        section: body.metadata?.section || 'general',
        difficulty: body.metadata?.difficulty || 'beginner'
      };

      // Return properly typed request body
      return {
        action: 'store',
        file: {
          name: body.file.name,
          type: body.file.type || 'text/plain',
          size: body.file.size || body.file.content.length,
          content: body.file.content
        },
        metadata
      };
    }

    // Validate search request
    if (body.action === 'search') {
      if (!body.query) {
        throw new Error('Search query is required');
      }
      return body as SearchRequestBody;
    }

    throw new Error('Invalid action type');
  } catch (e) {
    console.error('Error validating request body:', e);
    throw e;
  }
};
